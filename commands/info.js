module.exports = class info {
	constructor() {
		(this.name = 'info'),
			(this.alias = ['i']),
			(this.usage = '-info [@member]');
	}

	async run(bot, message, args) {
		const User = require('../models/user');
		const { MessageEmbed } = require('discord.js');
		console.log(message.mentions.members.first());
		const mention = message.mentions.members.first() || message.author;
		const member = await User.findOne({ userID: mention.id }).catch((err) =>
			console.log(err)
		);
		if (!member) return message.reply(this.usage);
		//TODO: going to add more to this once actual logging system is more complete
		const embed = new MessageEmbed()
			.setTitle('User info: ' + member.name)
			.setColor('BLURPLE')
			.addField('Joined Server', member.joinedAt);
		return message.channel.send(embed);
	}
};
