const User = require('../models/User');

exports.getPrivateData = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: 'ye',
		chatIDS: req.user.chatID,
	});
};

exports.getUsers = async (req, res, next) => {
	const inputUsername = req.body.inputUsername;
	console.log('a');
	console.log(inputUsername);
	if (!inputUsername) {
		return next(new ErrorResponse('Please enter a username', 400));
	}

	try {
		const user = await User.find({ username: { $regex: inputUsername } });

		if (!user) {
			return next(new ErrorResponse('No user found', 401));
		}
		console.log(user);
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
