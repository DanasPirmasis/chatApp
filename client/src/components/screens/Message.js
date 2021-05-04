import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './Message.css';

function Message({ message, username }) {
	const isUser = username === message.username;

	const textToDisplay = () => {
		if (
			message.message !== undefined &&
			(message.file === undefined || message.file === '')
		) {
			if (message.message.includes('giphy')) {
				return <img src={message.message} alt={''} />;
			}
			return message.username + ' : ' + message.message;
		} else if (message.message === undefined && message.file !== undefined) {
			return <img src={`data:image/png;base64 ${message.file}`} alt={''} />;
		}
		return 'Something went wrong';
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
