import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './Message.css';

function Message({ message, username }) {
	const isUser = username === message.username;

	const textToDisplay = () => {
		console.log(message);
		if (message.file === '') {
			if (message.message.includes('giphy')) {
				return <img src={message.message} alt={''} />;
			}
			return message.username + ' : ' + message.message;
		} else if (message.message === '' && message.file !== undefined) {
			return <img src={`${message.file}`} alt={''} />;
		}
		return 'Something went wrong Message.js';
	};

	return (
		<div className={`message ${isUser && 'message_user'}`}>
			<Card className={isUser ? 'message__userCard' : 'message__guestCard'}>
				<CardContent>
					<Typography color="initial" varinat="h5" component="h2">
						{textToDisplay()}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
}

export default Message;
