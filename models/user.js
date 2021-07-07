const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userID: String,
	username: String,
	pfp: String,
	createdAt: String,
	messageCount: { type: Number, default: 0 },
	bans: { type: [{}], default: [{}] },
	kicks: { type: [{}], default: [{}] },
});

module.exports = mongoose.model('User', userSchema);
