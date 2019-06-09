// Establishes client connection
const socket = io();

// Elements
const messageForm = document.getElementById('message-form'),
	messageFormInput = messageForm.querySelector('input'),
	messageFormButton = messageForm.querySelector('button'),
	sendLocationButton = document.getElementById('send-location'),
	messages = document.getElementById('messages'),
	// Templates
	messageTemplate = document.getElementById('message-template').innerHTML;

socket.on('message', message => {
	// Render new message to the screen using a template
	const html = Mustache.render(messageTemplate, {
		message
	});

	messages.insertAdjacentHTML('beforeend', html);
});

messageForm.addEventListener('submit', e => {
	e.preventDefault();

	// Disable form until a response is received
	messageFormButton.disabled = true;

	// Gets message from input field and emits message to the server
	const message = e.target.elements.message.value;

	// Callback function is sent to the server to determine if emit event was successful
	socket.emit('sendMessage', message, error => {
		// Re-enable form in callback
		messageFormButton.disabled = false;

		// Reset input field and restore focus
		messageFormInput.value = '';
		messageFormInput.focus();

		if (error) {
			return console.warn(error);
		}

		console.info('Message delivered successfully.');
	});
});

sendLocationButton.addEventListener('click', () => {
	// Disable button until a response is received
	// If browser does not support geolocation, the button will remain disabled
	sendLocationButton.disabled = true;

	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser.');
	}

	navigator.geolocation.getCurrentPosition(position => {
		if (!position.coords) return;

		const { latitude, longitude } = position.coords;
		// Re-enable button in callback
		sendLocationButton.disabled = false;

		socket.emit('sendLocation', { latitude, longitude }, () => {
			console.info('Location information shared successfully.');
		});
	});
});
