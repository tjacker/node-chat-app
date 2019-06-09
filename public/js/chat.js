// Establishes client connection
const socket = io();

socket.on('message', message => {
	console.log(message);
});

document.getElementById('message-form').addEventListener('submit', e => {
	e.preventDefault();

	// Gets message from input field and emits message to the server
	const message = e.target.elements.message.value;

	// Callback function is sent to the server to determine if emit event was successful
	socket.emit('sendMessage', message, error => {
		if (error) {
			return console.warn(error);
		}

		console.info('Message delivered successfully.');
	});
});

document.getElementById('send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser.');
	}

	navigator.geolocation.getCurrentPosition(position => {
		const { latitude, longitude } = position.coords;
		socket.emit('sendLocation', { latitude, longitude });
	});
});
