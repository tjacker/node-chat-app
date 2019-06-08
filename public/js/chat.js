// Establishes client connection
const socket = io();

socket.on('message', message => {
	console.log(message);
});

document.getElementById('message-form').addEventListener('submit', e => {
	e.preventDefault();

	// Gets message from input field and emits message to the server
	const message = e.target.elements.message.value;
	socket.emit('sendMessage', message);
});
