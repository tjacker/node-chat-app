/**
 * socket.emit => sends an event to a specific client
 * io.emit => sends an event to every connected client
 * socket.broadcast.emit => sends an event to every client except for client
 * 		on given socket
 * io.to(...).emit => sends an event to every connected client at a specific location
 * 		(ie room)
 * socket.broadcast.to(...).emit => ends an event to every client at a specific location
 * 		except for client on given socket
 */
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { generateMessage, generateLocation } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
// Creates server outside of the express library in order to configure
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

// Handles socket connections to the server
io.on('connection', socket => {
	console.log('New WebSocket connection');

	// Listens for a user requesting to join a chat room
	socket.on('join', ({ username, room }, cb) => {
		// Call add user function (will return either an error or user)
		const { error, user } = addUser({ id: socket.id, username, room });

		// if add user function returns an error, send back to the client
		if (error) {
			return cb(error);
		}

		// Server only method that restricts user to a designated area (ie room)
		socket.join(user.room);

		// Emits a message to a user upon connection
		socket.emit('message', generateMessage('Welcome!'));

		// Broadcasts a message to all other users in the room when a new user has connected
		socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`));

		// Return control back to the client
		cb();
	});

	// Listens for a message being sent by a user
	socket.on('sendMessage', (message, cb) => {
		const filter = new Filter();

		// Check if message contains profane language
		if (filter.isProfane(message)) {
			return cb('Profanity is not allowed.');
		}

		// Emits that message to all connected users
		io.to('JS').emit('message', generateMessage(message));
		// Callback function sent from the client. Used to acknowledge message was received
		cb();
	});

	// Listens for a location being sent by a user
	socket.on('sendLocation', (location, cb) => {
		// Emits that location to all connected users
		io.emit('location', generateLocation(location));
		cb();
	});

	// Handles socket disconnects and informs all other users
	socket.on('disconnect', () => {
		// Call remove user function (will return either a user or undefined)
		const user = removeUser(socket.id);

		// If user exists, emit a message only to that room
		if (user) {
			io.to(user.room).emit('message', generateMessage(`${user.username} has left the room.`));
		}
	});
});

module.exports = server;
