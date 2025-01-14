const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const serveIndex = require('serve-index');

const upload = multer({ dest: 'uploads/' });

app.post('/upload-image', upload.single('image'), (req, res) => {
    const imageUrl = `http://192.168.0.154:5601/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

app.use('/uploads', express.static('uploads'));
app.use('/uploads', serveIndex('uploads', { icons: true }));

app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/cs2/twitch', express.static('cs2/twitch'));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
// Function to read images from directory and pair them
function getImagesFromDirectory(existingImages = []) {
    const imageDir = path.join(__dirname, 'cs2/twitch');
    try {
        const files = fs.readdirSync(imageDir);
        const newImages = [];
        
        // First, add existing images while preserving their order and state
        existingImages.forEach((existingImage) => {
            const baseFile = path.basename(existingImage.baseUrl);
            if (files.includes(baseFile)) {
              newImages.push({
                ...existingImage,
                tempUrl: null, // Add a tempUrl property
              });
            }
          });

        // Then process all PNG files that aren't already included
        files.forEach(file => {
            if (file.toLowerCase().endsWith('.png') && !file.toLowerCase().includes('_done')) {
                const baseName = file.replace('.png', '');
                const doneFile = `${baseName}_done.png`;
                
                // Check if this image is already in our newImages array
                const exists = newImages.some(img => img.baseUrl === `/cs2/twitch/${file}`);
                
                if (!exists) {
                    newImages.push({
                        baseUrl: `/cs2/twitch/${file}`,
                        doneUrl: `/cs2/twitch/${doneFile}`,
                        title: baseName,
                        isDone: false,
                        hasDoneVersion: files.includes(doneFile)
                    });
                }
            }
        });

        return newImages;
    } catch (err) {
        console.error('Error reading image directory:', err);
        return existingImages;
    }
}

let currentColor = '#000000';

io.on('connection', (socket) => {
    // Send current color to new connections
    socket.emit('colorChange', currentColor);

    // Your existing socket.io code here...

    // Add this new listener
    socket.on('colorChange', (color) => {
        currentColor = color;
        // Broadcast to all clients except sender
        socket.broadcast.emit('colorChange', color);
    });
});

let images = getImagesFromDirectory();

// Watch for changes in the images directory
const watchDir = path.join(__dirname, 'cs2/twitch');
let fsWatcher;
try {
    fsWatcher = fs.watch(watchDir, (eventType, filename) => {
        if (filename && filename.toLowerCase().endsWith('.png')) {
            console.log(`File change detected: ${filename}`);
            // Add a small delay to ensure both files (base and _done) are copied
            setTimeout(() => {
                images = getImagesFromDirectory(images);
                io.emit('updateImages', images);
            }, 1000);
        }
    });
} catch (err) {
    console.error('Error setting up file watcher:', err);
}

// Clean up watcher on server shutdown
process.on('SIGINT', () => {
    if (fsWatcher) {
        fsWatcher.close();
    }
    process.exit();
});

let timerState = {
    startTime: new Date(),
    isRunning: false
};

io.on('connection', (socket) => {
    socket.emit('updateImages', images);
    console.log('A user connected via HTTP');

    socket.on('timerControl', (data) => {
        switch(data.action) {
            case 'start':
                timerState.startTime = new Date();
                timerState.isRunning = true;1
                break;
            case 'stop':
                timerState.isRunning = false;
                break;
            case 'restart':
                timerState.startTime = new Date();
                timerState.isRunning = true;
                break;
        }
        io.emit('timerState', timerState);
    });

    socket.on('moveImage', ({ from, to }) => {
        if (to >= 0 && to < images.length) {
            const [removed] = images.splice(from, 1);
            images.splice(to, 0, removed);
            io.emit('updateImages', images);
        }
    });

    socket.on('replaceImage', (data) => {
        const { index, newImageUrl } = data;
        console.log(newImageUrl);
        images[index].tempUrl = newImageUrl;
        io.emit('updateImages', images);
      });
      
      // Add a new socket event to handle image reversion
      socket.on('revertImage', (index) => {
        images[index].tempUrl = null;
        io.emit('updateImages', images);
      });

    socket.on('toggleDone', (index) => {
        if (index >= 0 && index < images.length) {
            images[index].isDone = !images[index].isDone;
            if (images[index].isDone) {
                // Add timestamp when marked as done
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const seconds = now.getSeconds().toString().padStart(2, '0');
                images[index].timestamp = `${hours}:${minutes}:${seconds}`;
            } else {
                // Remove timestamp when unmarked
                images[index].timestamp = null;
            }
            io.emit('updateImages', images);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
