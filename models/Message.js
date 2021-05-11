const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
	conversation: {
		type: Schema.Types.ObjectId,
		ref: 'Conversations',
	},
	from: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
	},
	fromUsername: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: function () {
			return this.file == null;
		},
		maxLength: [640, 'Message is too long'],
	},
	file: {
		type: String,
	},
	fileType: {
		type: String,
		required: function () {
			return this.file != null;
		},
	},
	date: {
		type: String,
		default: Date.now,
	},
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
