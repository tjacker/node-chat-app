// Establishes client connection
const socket = io();

// Elements
const messageForm = document.getElementById('message-form'),
	messageFormInput = messageForm.querySelector('input'),
	messageFormButton = messageForm.querySelector('button'),
	sendLocationButton = document.getElementById('send-location'),
	messages = document.getElementById('messages'),
	sidebar = document.getElementById('sidebar');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML,
	locationTemplate = document.getElementById('location-template').innerHTML,
	sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// Options
// Helper function for parsing URL query parameters
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Listens for messages being sent from the server
socket.on('message', message => {
	// Render new message to the screen using a template
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	});

	messages.insertAdjacentHTML('beforeend', html);
});

// Listens for location information being sent from the server
socket.on('location', message => {
	// Render user location to the screen using a template
	const html = Mustache.render(locationTemplate, {
		username: message.username,
		url: message.url,
		createdAt: moment(message.createdAt).format('h:mm a')
	});

	messages.insertAdjacentHTML('beforeend', html);
});

// Listens for room information being sent from the server
socket.on('roomInfo', ({ room, users }) => {
	// Render room and users to the screen using a template
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	});

	sidebar.innerHTML = html;
});

// Sends a messages to the server
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

// Sends user's location information to the server
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

// Sends a request to the server to join a chat room
socket.emit('join', { username, room }, error => {
	// If error, alert user and redirect them back to join page
	if (error) {
		alert(error);
		location.href = '/';
	}
});
