const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const sanitize = require('mongo-sanitize');

exports.register = async (req, res, next) => {
	const username = sanitize(req.body.username);
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	try {
		const user = await User.create({
			username,
			email,
			password,
		});

		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	if (!email || !password) {
		return next(new ErrorResponse('Please provide email and password', 400));
	}

	try {
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return next(new ErrorResponse('Invalid credentials', 401));
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials', 401));
		}

		sendToken(user, 201, res);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.forgotpassword = async (req, res, next) => {
	const email = sanitize(req.body.email);

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return next(new ErrorResponse('Email could not be sent', 404));
		}

		const resetToken = user.getResetPasswordToken();

		await user.save();
		//point towards frontend url
		const resetUrl = `http://localhost:5000/passwordreset/${resetToken}`;

		const message = `
		<h1> You have requested a password reset</h1>
		<p>Please go to this link to reset your password</p>
		<a href=${resetUrl} clicktracking=off> ${resetUrl}</a>
		`;

		try {
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message,
			});

			res.status(200).json({ success: true, data: 'Email Sent' });
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();
			return next(new ErrorResponse('Email could not be sent', 500));
		}
	} catch (error) {
		next(error);
	}
};

exports.resetpassword = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return next(new ErrorResponse('Invalid Reset Token', 400));
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(201).json({
			success: true,
			data: 'Password Reset Success',
		});
	} catch (error) {
		next(error);
	}
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ success: true, token });
};
