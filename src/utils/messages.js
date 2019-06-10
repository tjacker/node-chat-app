const generateMessage = text => {
	return {
		text,
		createdAt: new Date().getTime()
	};
};

const generateLocation = location => {
	const baseUrl = 'https://www.google.com/maps?q=';

	return {
		url: `${baseUrl}${location.latitude},${location.longitude}`,
		createdAt: new Date().getTime()
	};
};

module.exports = {
	generateMessage,
	generateLocation
};
