**CS2 Challenge Tracker**
===============================

[![Preview](https://i.ibb.co/RBzX73T/cs2-ohne-challange-recreation-final.png)](https://i.ibb.co/RBzX73T/cs2-ohne-challange-recreation-final.png)

**⚠️Important Notes⚠️**
------------------

* **Hosting**: This project requires port forwarding or a server provider to function.
* **Security**: Only allow access to people you trust.

**About**
---------

Inspired by OhnePixels' YouTube video, this project is a real-time challenge tracker designed for CS2 streamers. Track your progress, view images related to the challenge, and interact with your audience through a simple and intuitive interface.

**▶️Getting Started▶️**
-------------------

1. **Clone the repo**: Get the code on your local machine.
2. **Install dependencies**: Run `npm install` to get everything you need.
3. **Configure your setup**:
	* Set your IP address in `server.js`.
	* Choose your port in `package.json`.
4. **Start the server**: Run `npm start` and you're good to go!
5. **Customize**: Modify `server.js` and `index.html` to make it your own.

**🔑Key Features🔐**
----------------

* **Real-time image updates**
* **Challenge progress tracking**
* **Timer functionality**
* **Image replacement and reversion**
* **Socket.io integration**

**📖How to Use📖**
--------------

* **Secure connection**: Share a one-time code with your trusted team members to grant access.
* **Viewer page**: Display the map items and timer in your OBS overlay (`http://localhost:3000/`).
* **Admin page**: Change the state, image, and time settings (`http://localhost:3000/admin/admin.html`).

**Features to be added**
--------------

- [ ] Pick what maps to display
- [ ] Hide time
- [ ] Color Control of Timestamp

**📋Requirements📋**
---------------

* Node.js
* Express.js
* Socket.io
* A CS2 stream to track

**Contributing**
---------------

Contributions are welcome! Submit a pull request or issue on the repository to help make this project even better.

**Acknowledgments**
-----------------

Special thanks to OhnePixels for inspiring this project with their YouTube video, "I Streamed Until I Beat CS2's Hardest Challenge. It was a mistake."
