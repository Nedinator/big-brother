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
	//TODO: Log message if allowed based on not excluded channels
	console.log('finished logging message counts possibly');
	let memberManager = [];
	console.log(memberManager);
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
	console.log(memberManager);
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
			if (member.id === message.author.id) {
				member.messages.concat(newMessageLog);
			}
		});
		serverDoc.markModified('members');
		serverDoc.save().catch((err) => console.log(err));
	}
};

module.exports.editMessage = (member, guild, oldMessage, newMessage) => {
	//
};
