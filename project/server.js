const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/cs2/twitch', express.static('cs2/twitch'));

// Function to read images from directory and pair them
function getImagesFromDirectory(existingImages = []) {
    const imageDir = path.join(__dirname, 'cs2/twitch');
    try {
        const files = fs.readdirSync(imageDir);
        const newImages = [];
        
        // First, add existing images while preserving their order and state
        existingImages.forEach(existingImage => {
            const baseFile = path.basename(existingImage.baseUrl);
            if (files.includes(baseFile)) {
                newImages.push({
                    ...existingImage
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

io.on('connection', (socket) => {
    socket.emit('updateImages', images);

    socket.on('moveImage', ({ from, to }) => {
        if (to >= 0 && to < images.length) {
            const [removed] = images.splice(from, 1);
            images.splice(to, 0, removed);
            io.emit('updateImages', images);
        }
    });

    socket.on('toggleDone', (index) => {
        if (index >= 0 && index < images.length) {
            images[index].isDone = !images[index].isDone;
            io.emit('updateImages', images);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
