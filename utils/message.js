const User = require('../models/user');
const Server = require('../models/server');

module.exports.logMessage = async (member, guild, message) => {
	const userDoc = await User.findOne({ userID: member.id }).catch((err) =>
		console.log(err)
	);
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);

	//TODO: simple count logging on userdoc

	//TODO: messageLog
};

module.exports.editMessage = (member, guild, oldMessage, newMessage) => {
	//
};
