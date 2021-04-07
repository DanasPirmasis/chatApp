const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
	username: String,
	message: String,
	timestamp: String,
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
