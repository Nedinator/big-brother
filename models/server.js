const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
	serverName: String,
	serverID: String,
	botJoinedAt: String,
	memberCount: Number,
	dontLog: { type: [], default: [] },
	bans: { type: [{}], default: [{}] },
	kicks: { type: [{}], default: [{}] },
	members: { type: [{}], default: [{}] },
	//ex member: {userID, joinedAt,
	//messages: [{id,date,[messages], messageStatus}]}
});

module.exports = mongoose.model('Server', serverSchema);
