//discord.js poop
const Discord = require('discord.js');
const bot = new Discord.Client();

//env secrets
require('dotenv').config();

//date stuff
const moment = require('moment');
moment().format();

//command handler
const { CommandHandler } = require('djs-commands');
const CH = new CommandHandler({
	folder: __dirname + '/commands/',
	prefix: ['-'],
});

//db
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/big-brother', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const User = require('./models/user');
const Server = require('./models/server');

//i started separating some event code randomly.
const MessageTools = require('./utils/message');

//bot started up
bot.on('ready', () => {
	console.log(bot.user.username + ' is online and ready.');
	bot.user.setActivity(`${bot.guilds.cache.size} servers.`, {
		type: 'WATCHING',
	});

	bot
		.generateInvite({ permissions: ['VIEW_AUDIT_LOG', 'VIEW_CHANNEL'] })
		.then((link) => console.log(`Generated link for invite ${link}.`))
		.catch(console.error);
});

//message sent event
bot.on('message', (message) => {
	if (message.channel.type === 'dm') return;
	if (message.author.type === 'bot') return;
	let args = message.content.split(' ');
	let command = args[0];
	let cmd = CH.getCommand(command);
	MessageTools.logMessage(message.member, message.guild, message);
	if (!cmd) return;

	try {
		cmd.run(bot, message, args);
	} catch (e) {
		console.log(e);
	}
});

bot.on('messageUpdate', (oldMessage, newMessage) => {
	//
	MessageTools.editMessage(
		oldMessage.member,
		oldMessage.guild,
		oldMessage,
		newMessage
	);
});

bot.on('messageDelete', (message) => {
	MessageTools.deleteMessage(message, message.member, message.guild);
});

//bot join
bot.on('guildCreate', async (guild) => {
	const date = moment();
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);

	if (!serverDoc) {
		let memberManager = [];
		guild.members.cache.forEach(async (member) => {
			//prepare memberManager for serverDoc
			console.log(member.displayName);
			let newEntry = {
				userID: member.id,
				joinedAt: member.joinedAt,
				messageCount: 0,
				messageLog: [],
			};
			memberManager.push(newEntry);
			//update/create userDocs for each member
			const userDoc = await User.findOne({ userID: member.id }).catch((err) =>
				console.log(err)
			);
			if (!userDoc) {
				const newUser = new User({
					userID: member.id,
					username: member.displayName,
					pfp: member.user.displayAvatarURL(),
					createdAt: member.createdAt,
				});
				newUser.save().catch((err) => console.log(err));
			} else {
				userDoc.username = member.displayName;
				userDoc.pfp = member.user.displayAvatarURL();
				userDoc.save().catch((err) => console.log(err));
			}
		});
		const newServer = new Server({
			serverName: guild.name,
			serverID: guild.id,
			botJoinedAt: date,
			memberCount: guild.memberCount,
			members: memberManager,
		});
		newServer.save().catch((err) => console.log(err));
	} else {
		//TODO: update members[] on serverdoc
		let memberManager = [];
		guild.members.cache.forEach(async (member) => {
			let newEntry = {
				userID: member.id,
				joinedAt: member.joinedAt,
				messageCount: 0,
				messageLog: [],
			};
			memberManager.push(newEntry);
			const userDoc = await User.findOne({ userID: member.id }).catch((err) =>
				console.log(err)
			);
			if (!userDoc) {
				const newUser = new User({
					userID: member.id,
					username: member.displayName,
					pfp: member.user.displayAvatarURL(),
					createdAt: member.createdAt,
				});
				newUser.save().catch((err) => console.log(err));
			} else {
				userDoc.username = member.displayName;
				userDoc.pfp = member.user.displayAvatarURL();
				userDoc.save().catch((err) => console.log(err));
			}
		});
		serverDoc.serverName = guild.name;
		serverDoc.botJoinedAt = date;
		serverDoc.memberCount = guild.memberCount;
		serverDoc.members = memberManager;
		serverDoc.save().catch((err) => console.log(err));
	}
});

//member join
bot.on('guildMemberAdd', async (member) => {
	const date = moment();
	const userDoc = await User.findOne({ userID: member.id }).catch((err) =>
		console.log(err)
	);
	const serverDoc = await Server.findOne({ serverID: guild.id }).catch((err) =>
		console.log(err)
	);
	if (!userDoc) {
		const newUser = new User({
			userID: member.id,
			username: member.name,
			pfp: member.user.displayAvatarURL(),
			createdAt: member.createdAt,
		});
	} else {
	}
});
//member kick

//member ban

//member unban

bot.login(process.env.TOKEN);
