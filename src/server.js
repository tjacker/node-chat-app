const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
// Creates server outside of the express library in order to configure
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

// Handles socket connections to the server
io.on('connection', socket => {
	console.log('New WebSocket connection');

	// Emits a message to a user upon connection
	socket.emit('message', 'Welcome!');

	// Broadcasts a message to all other users when a new user has connected
	socket.broadcast.emit('message', 'A new user has joined');

	// Listens for a message being sent by a user
	socket.on('sendMessage', message => {
		// Emits that message to all connected users
		io.emit('message', message);
	});

	// Listens for a location being sent by a user
	socket.on('sendLocation', location => {
		// Emits that location to all connected users
		io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
	});

	// Handles socket disconnects and informs all other users
	socket.on('disconnect', () => {
		io.emit('message', 'A user has left');
	});
});

module.exports = server;
