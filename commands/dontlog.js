module.exports = class dontlog {
	constructor() {
		(this.name = 'dontlog'), (this.alias = ['dl']), (this.usage = '-dl');
	}

	async run(bot, message, args) {
		const moment = require('moment');
		moment().format();
		const date = moment();
		const Discord = require('discord.js');
		const Server = require('../models/server');
		const serverDoc = await Server.findOne({
			serverID: message.guild.id,
		}).catch((err) => console.log(err));
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		if (!serverDoc) {
			const newServer = new Server({
				serverName: message.guild.name,
				serverID: message.guild.id,
				botJoinedAt: date,
			});
			newServer.save().catch((err) => console.log(err));
			return message.reply(
				'for whatever reason your guild wasnt in the database. rerun command.'
			);
		}
		let exists = false;
		serverDoc.dontLog.forEach((channel) => {
			if (channel === message.channel.id) {
				exists = true;
				serverDoc.dontLog = serverDoc.dontLog.filter(
					(x) => x !== message.channel.id
				);
			}
		});
		if (!exists) {
			serverDoc.dontLog = serverDoc.dontLog.concat(message.channel.id);
		}
		serverDoc.save().catch((err) => console.log(err));
	}
};
