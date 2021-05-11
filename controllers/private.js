const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');
const sanitize = require('mongo-sanitize');
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
//return next(new ErrorResponse('Email could not be sent', 404));

exports.getPrivateData = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: {
			username: req.user.username,
			conversationIDS: req.user.conversationIDS,
			_id: req.user._id,
		},
	});
};

exports.getUsers = async (req, res, next) => {
	const inputUsername = sanitize(req.body.inputUsername);

	if (!inputUsername) {
		return next(new ErrorResponse('Please enter a username', 400));
	}

	try {
		const user = await User.find({ username: { $regex: inputUsername } });

		if (!user) {
			return next(new ErrorResponse('No user found', 401));
		}

		let usernamesList = user.map((a) => a.username);

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

	if (!recipients) {
		return next(new ErrorResponse('Invalid recipients', 400));
	}

	try {
		let result = await Conversation.findOne({ recipients: recipients });

		if (!result) {
			const conversation = await Conversation.create({
				recipients,
			});

			await recipients.forEach((recipient) => {
				User.findByIdAndUpdate(recipient, {
					conversationIDS: conversation._id,
				});
			});

			//pridet useriu usernamus
			res.status(200).json({
				success: true,
				data: conversation,
			});
		} else {
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
	const conversationID = sanitize(req.body.conversationID);

	try {
		const messages = await Message.find({ conversation: conversationID }).limit(
			50
		);

		res.status(200).json({
			success: true,
			data: messages,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.postMessage = async (req, res, next) => {
	const conversationID = sanitize(req.body.conversationID);
	const from = sanitize(req.body.from);
	const fromUsername = sanitize(req.body.fromUsername);
	let body = sanitize(req.body.body);
	if (body === undefined) body = '';
	//Fix to shorthand if statement
	const file = req.body.file;

	// console.log(conversationID);
	// console.log(from);
	// console.log(fromUsername);
	// console.log(body);
	// console.log(file);

	if (file === '') {
		try {
			const message = await Message.create({
				conversation: conversationID,
				from: from,
				fromUsername: fromUsername,
				file: file,
				fileType: 'empty',
				body: body,
			});
			res.status(200).json({
				success: true,
				data: message._id,
			});
		} catch (error) {
			console.log('First error: ' + error);
			res.status(500).json({ success: false, error: error.message });
		}
	} else {
		let fileType = file.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

		if (acceptedFileTypes.includes(fileType) === true) {
			try {
				const message = await Message.create({
					conversation: conversationID,
					from: from,
					fromUsername: fromUsername,
					body: body,
					file: file,
					fileType: fileType,
				});
				res.status(200).json({
					success: true,
					data: message._id,
				});
			} catch (error) {
				console.log('Second error: ' + error);
				res.status(500).json({ success: false, error: error.message });
			}
		} else {
			return next(new ErrorResponse('Untrusted file type', 415));
		}
	}
};

exports.editMessage = async (req, res, next) => {
	const messageID = sanitize(req.body.messageID);
	const editedText = sanitize(req.body.editedText);

	try {
		const message = await Message.findByIdAndUpdate(messageID, {
			body: editedText,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.getConversationRecipientUsernames = async (req, res, next) => {
	const conversationID = sanitize(req.body.conversationID);

	try {
		if (!conversationID) {
			return next(new ErrorResponse('Conversation ID is missing', 400));
		}
		const conversation = await Conversation.findById(conversationID);

		let recipientUsernames = [];

		for (const id of conversation.recipients) {
			let user = await User.findById(id);
			let username = user.username;
			recipientUsernames.push(username);
		}

		res.status(200).json({
			success: true,
			data: recipientUsernames,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.getConversationRecipientIDS = async (req, res, next) => {
	const conversationID = sanitize(req.body.conversationID);

	if (!conversationID) {
		return next(new ErrorResponse('Conversation ID is missing', 400));
	}

	try {
		const conversation = await Conversation.findById(conversationID);

		res.status(200).json({
			success: true,
			data: conversation.recipients,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
