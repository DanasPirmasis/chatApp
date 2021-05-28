import { Card, CardContent, Typography } from '@material-ui/core';
import { useState } from 'react';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import './Message.css';

function Message({ message, username, color }) {
	const [edit, setEdit] = useState(false);
	const [input, setInput] = useState('');
	const [style, setStyle] = useState({ display: 'none' });
	const isUser = username === message.username;
	const imageFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
	const audioFileTypes = ['audio/mpeg', 'audio/wav', 'audio/aac'];

	const textToDisplay = () => {
		//console.log(message);
		if (message.file === '') {
			if (message.message.includes('giphy')) {
				return <img src={message.message} alt={''} />;
			}
			return message.username + ' : ' + message.message;
		} else if (
			(message.message === '' || message.message === undefined) &&
			message.file !== undefined &&
			imageFileTypes.includes(message.fileType)
		) {
			return <img src={`${message.file}`} alt={''} />;
		} else if (
			(message.message === '' || message.message === undefined) &&
			message.file !== undefined &&
			audioFileTypes.includes(message.fileType)
		) {
			return <audio src={message.file} controls />;
		} else if (
			(message.message === '' || message.message === undefined) &&
			message.file !== undefined
		) {
			return (
				<button
					className={'button'}
					onClick={() => {
						downloadFile(message.file, message.fileName);
					}}
				>
					{message.fileName}
				</button>
			);
		}
		return 'Something went wrong Message.js';
	};

	function downloadFile(file, fileName) {
		let a = document.createElement('a');
		a.href = file;
		a.download = fileName;
		a.click();
	}

	const openEditText = () => {
		setEdit(edit ? false : true);
	};

	const editText = (info) => {
		if (input !== '') {
			message.message = input;
			updateMessage(message.messageID, input);
		}

		setEdit(false);
	};

	const deleteMessage =() =>{
		console.log(message);
		//setMessageState(messageState.filter(item => item.name !== name));
		message.message="message has been deleted";
		
		
	}

	const updateMessage = async (messageID, editedText) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/editmessage',
				data: { messageID, editedText },
				headers: config.headers,
			});
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const addEditButtonOnHover = () => {
		if (
			isUser &&
			message.file.length < 1 &&
			!message.message.includes('giphy')
		) {
			return (
				<div className='edit__message'>
					<EditIcon
						fontSize="small"
						style={style}
						onClick={() => openEditText()}
					/>
					
					<DeleteIcon 
					fontSize="small"
					style={style}
					onClick={() => deleteMessage()}
					/>
					
				</div>
			);
		}
	};
	

	return (
		<div className={`message ${isUser && 'message_user'}`}>
			<Card
				className={isUser ? 'message__userCard' : 'message__guestCard'}
				style={{ backgroundColor: color }}
			>
				<CardContent>
					<Typography color="initial" varinat="h5" component="h2">
						{edit ? (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									flexWrap: 'wrap',
								}}
							>
								<input
									placeholder={message.message}
									onChange={(e) => setInput(e.target.value)}
								></input>
								<CheckIcon fontSize="small" onClick={() => editText(message)}>
									Change
								</CheckIcon>
								<ClearIcon
									fontSize="small"
									onClick={() => setEdit(false)}
								></ClearIcon>
							</div>
						) : (
							<div
								onMouseEnter={(e) => setStyle({ display: 'block' })}
								onMouseLeave={(e) => setStyle({ display: 'none' })}
							>
								{addEditButtonOnHover()}
								<div>{textToDisplay()}</div>
							</div>
						)}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
}

export default Message;
