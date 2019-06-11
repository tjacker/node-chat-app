const users = [];

const addUser = ({ id, username, room }) => {
	//  Clean data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	// Validate date
	if (!username || !room) {
		return {
			error: 'Username and room are required.'
		};
	}

	// Check for existing user in room
	const existingUser = users.find(user => user.room === room && user.username === username);

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is in use.'
		};
	}

	// Store user if validations above are passed
	const user = { id, username, room };

	users.push(user);
	return { user };
};

const removeUser = id => {
	// Find user in array by id
	// Note findIndex stops searching after match is found
	const index = users.findIndex(user => user.id === id);

	// If match is found, return user
	if (index !== -1) {
		// Splice returns an array of one object below and that object
		// is accessed at index 0
		return users.splice(index, 1)[0];
	}
};

const getUser = id => {
	// Find user in array by id and return user or undefined (if there is no match)
	return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
	// Find all users in a given room and return users or an empty array (if there are no matches)
	return users.filter(user => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
};
