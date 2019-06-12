const generateMessage = (username, text) => {
	return {
		username,
		text,
		createdAt: new Date().getTime()
	};
};

const generateLocation = (username, location) => {
	const baseUrl = 'https://www.google.com/maps?q=';

	return {
		username,
		url: `${baseUrl}${location.latitude},${location.longitude}`,
		createdAt: new Date().getTime()
	};
};

module.exports = {
	generateMessage,
	generateLocation
};
