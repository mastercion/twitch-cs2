**CS2 Twitch Challenge Tracker**
=====================================

Inspired by OhnePixels' YouTube video, "I Streamed Until I Beat CS2's Hardest Challenge. It was a mistake.", this project is a real-time challenge tracker designed for CS2 streamers. It allows the streamer to track his progress, view images related to the challenge, and interact and let Moderators/other interact with the overlay through a simple and intuitive interface.

![preview](https://i.ibb.co/rMb3KQX/cs2-ohne-challange-recreation.png)

**How to use**
------------
* **Viewerpage**: It will display the Map items and timer. You will use this as your overlay in obs `http://localhost:3000/`.
* **Admin Page**: This gives you the ability to interact with the Viewerpage. It lets you change the State, Image and Time&Time color `http://localhost:3000/admin/admin.html`.

**Features**
------------

* **Real-time Image Updates**: The tracker can display images related to the challenge, such as screenshots or concept art, and update them in real-time as the streamer progresses.
* **Challenge Progress Tracking**: The tracker can display the streamer's progress, including the current challenge, completed challenges, and remaining challenges.
* **Timer Functionality**: The tracker includes a timer that can be started, stopped, and reset, allowing viewers to track the streamer's progress over time.
* **Image Replacement**: Viewers can replace images in the tracker with their own, allowing for community engagement and interaction.
* **Image Reversion**: Viewers can revert images to their original state, allowing for easy management of image replacements.
* **Socket.io Integration**: The tracker uses Socket.io to enable real-time communication between the server and clients, allowing for seamless updates and interactions.

**Functionality**
-----------------

* The tracker is designed to be used in conjunction with a CS2 stream, allowing viewers to track the streamer's progress and interact with the streamer through the tracker.
* The tracker can be customized to display different images, challenges, and timer settings, allowing streamers to tailor the tracker to their specific needs.
* The tracker includes a simple and intuitive interface, making it easy for viewers to use and interact with the tracker.

**Requirements**
---------------

* Node.js
* Express.js
* Socket.io
* A CS2 stream to track

**Getting Started**
-------------------

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Start the server using `node server.js`.
4. Open the tracker in your web browser by navigating to `http://localhost:3000`.
5. Customize the tracker to suit your needs by modifying the `server.js` and `index.html` files.

**Contributing**
---------------

Contributions are welcome! If you have any ideas for new features or improvements, please submit a pull request or issue on the repository.

**Acknowledgments**
-----------------

This project was inspired by OhnePixels' YouTube video, "I Streamed Until I Beat CS2's Hardest Challenge. It was a mistake." Special thanks to OhnePixels for creating the original content that inspired this project.
