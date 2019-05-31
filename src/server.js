const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
// Creates server outside of the express library in order to configure
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', () => {
	console.log('New WebSocket connection');
});

module.exports = server;
