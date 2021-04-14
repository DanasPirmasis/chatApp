const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new mongoose.Schema({
	recipients: [{ type: Schema.Types.ObjectId, ref: 'users' }],
	date: {
		type: String,
		default: Date.now,
	},
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
