const User = require('../models/user');
const Server = require('../models/server');
const moment = require('moment');
moment().format();
module.exports.logMessage = async (member, guild, message) => {
	const userDoc = await User.findOne({ userID: member.id }).catch((err) =>
		console.log(err)
	);
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);
	const date = moment();

	//TODO: check dontLog array for message.channel.id

	if (!userDoc) {
		const newUser = new User({
			userID: member.id,
			username: member.user.username,
			pfp: member.user.displayAvatarURL(),
			createdAt: member.createdAt,
			messageCount: 1,
		});
		newUser.save().catch((err) => console.log(err));
	} else {
		userDoc.messageCount = userDoc.messageCount + 1;
		userDoc.save().catch((err) => console.log(err));
	}
	let memberManager = [];
	const newMessageLog = {
		id: message.id,
		serverID: guild.id,
		date: date,
		messages: [message.content],
		messageStatus: 'ACTIVE',
	};

	guild.members.cache.forEach((member) => {
		if (member.id === message.author.id) {
			const newEntry = {
				userID: member.id,
				joinedAt: member.joinedAt,
				messages: [newMessageLog],
			};
			memberManager.push(newEntry);
		}
	});

	if (!serverDoc) {
		const newServer = new Server({
			serverName: guild.name,
			serverID: guild.id,
			botJoinedAt: date,
			memberCount: guild.memberCount,
			members: memberManager,
		});
		newServer.save().catch((err) => console.log(err));
	} else {
		serverDoc.members.forEach((member) => {
			if (member.userID === message.author.id) {
				member.messages = member.messages.concat(newMessageLog);
				serverDoc.markModified('members');
				serverDoc.save().catch((err) => console.log(err));
			}
		});
	}
};

module.exports.editMessage = async (member, guild, oldMessage, newMessage) => {
	//
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);

	if (!serverDoc) {
		//this shouldn't happen but we're gonna make sure its taken care of
		const newServer = new Server({
			serverName: guild.name,
			serverID: guild.id,
			botJoinedAt: date,
			memberCount: guild.memberCount,
		});
		newServer.save().catch((err) => console.log(err));
	} else {
		serverDoc.members.forEach((user) => {
			if (user.userID === member.id) {
				user.messages.forEach((messageLog) => {
					if (messageLog.id === oldMessage.id) {
						messageLog.messages = messageLog.messages.concat(
							newMessage.content
						);
						messageLog.messageStatus = 'EDITED';
					}
				});
			}
		});
		serverDoc.markModified('members');
		serverDoc.save().catch((err) => console.log(err));
	}
};

module.exports.deleteMessage = async (message, member, guild) => {
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);
	if (!serverDoc) {
		const newServer = new Server({
			serverName: guild.name,
			serverID: guild.id,
			botJoinedAt: date,
			memberCount: guild.memberCount,
		});
		newServer.save().catch((err) => console.log(err));
	} else {
		//
		serverDoc.members.forEach((member) => {
			if (member.id === member.id) {
				member.messages.forEach((messageLog) => {
					if (messageLog.id === message.id) {
						messageLog.messageStatus = 'DELETED';
					}
				});
			}
		});
		serverDoc.markModified('members');
		serverDoc.save().catch((err) => console.log(err));
	}
};
