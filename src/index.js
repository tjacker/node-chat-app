const server = require('./server');

const port = process.env.PORT;

server.listen(port, () => {
	console.info(`Started on port ${port}`);
});
