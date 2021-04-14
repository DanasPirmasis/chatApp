const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');

exports.getPrivateData = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.user.conversationIDS,
	});
};

exports.getUsers = async (req, res, next) => {
	const inputUsername = req.body.inputUsername;
	console.log(req.body);
	if (!inputUsername) {
		return next(new ErrorResponse('Please enter a username', 400));
	}

	try {
		const user = await User.find({ username: { $regex: inputUsername } });

		if (!user) {
			return next(new ErrorResponse('No user found', 401));
		}

		let usernamesList = user.map((a) => a.username);
		//console.log(usernamesList);

		res.status(200).json({
			success: true,
			data: usernamesList,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.newConversation = async (req, res, next) => {
	const recipients = req.body.recipients;
	// creatorID receiverID
	try {
		let result = await Conversation.findOne({ recipients: recipients });

		if (!result) {
			const conversation = await Conversation.create({
				recipients,
			});
			//Add for all users instead of only one
			await User.findByIdAndUpdate(recipients[0], {
				conversationIDS: conversation._id,
			});
			//pridet useriu usernamus
			res.status(200).json({
				success: true,
				data: conversation,
			});
		} else {
			console.log(result);

			res.status(200).json({
				success: true,
				data: result,
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.getMessages = async (req, res, next) => {
	const conversationID = req.body.conversationID;

	try {
		const messages = await Message.find({ conversation: conversationID });

		res.status(200).json({
			success: true,
			data: messages,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
exports.postMessage = async (req, res, next) => {
	const { conversationID, from, body } = req.body;

	try {
		await Conversation.create({
			conversationID,
			from,
			body,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
