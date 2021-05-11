import { Card, CardContent, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react'; 
import React from 'react';
import './Message.css';

function Message({ message, username }) {
	const [edit, setEdit] = useState(false);
	const [input, setInput] = useState('');
	const isUser = username === message.username;

	const textToDisplay = () => {
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

	const openEditText =(info) =>{
		setEdit(edit ?false: true)
		//console.log(info)
	}
	const editText =(info) =>{
		console.log(info)
		message.message=input;
		setEdit(false)
	}

	return (
		<div className={`message ${isUser && 'message_user'}`}>
			{isUser ? <button onClick={() => openEditText(message.message)}>Edit</button> : <></>}
			<Card className={isUser ? 'message__userCard' : 'message__guestCard'}>
				<CardContent>
					<Typography color="initial" varinat="h5" component="h2">
						{edit ? <div> <input placeholder={message.message} onChange={(e) =>setInput(e.target.value)}></input> <button onClick={() => editText(message.message)}>Change</button> </div> : textToDisplay()}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
}

export default Message;
