import React from 'react';
import { useState, useEffect } from 'react';
import './Chat.css';
import Picker from 'emoji-picker-react';
import Modal from 'react-modal';
import Gif from './Gif';
import {
	Button,
	FormControl,
	InputLabel,
	Input,
	Avatar,
} from '@material-ui/core';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import GifIcon from '@material-ui/icons/Gif';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Message from './Message';

function Chat({
	input,
	onTextChange,
	sendMessage,
	messages,
	username,
	setMessageState,
	usernameState,
	messageState,
	errorState,
}) {
	const [emojiModalOpen, setEmojiModalOpen] = useState(false);
	const [gifModalOpen, setGifModalOpen] = useState(false);
	const [fileModalOpen, setFileModalOpen] = useState(false);
	const [showGif, setShowGif] = useState(null);
	const [search, setSearch] = useState('');

	const [chosenEmoji, setChosenEmoji] = useState('');

	const onEmojiClick = (event, emojiObject) => {
		setMessageState({
			...messageState,
			username: usernameState,
			message: emojiObject.emoji,
		});
	};

	const fileModalSendHandler = (e) => {
		sendMessage(e);
		setFileModalOpen(false);
	};

	const fileHandler = async (e) => {
		console.log(e.target.files[0]);

		if (e.target.files[0].size > 16000000) {
			errorState('File size too big');
			return;
		}

		const file = await toBase64(e.target.files[0]);
		console.log(file);
		setMessageState({ username: usernameState, file: file });
		console.log(messageState);
	};

	const toBase64 = async (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar />

				<div className="chat__headerInfo">
					<h3>Room name</h3>
					<p>last seen</p>
				</div>
				<div>
					<input
						type="search"
						placeholder="Search in chat"
						onChange={(e) => setSearch(e.target.value)}
					></input>
				</div>
			</div>

			<div className="chat__body">
				{messages
					.filter((val) => {
						if (search === '') {
							console.log('search is empty');
							return val;
						} else if (
							val.message.toLowerCase().includes(search.toLowerCase())
						) {
							return val;
						}
					})
					.map((message) => (
						<Message username={username} message={message}></Message>
					))}
			</div>

			<div className="chat__footer">
				<AttachmentIcon onClick={() => setFileModalOpen(true)} />
				<Modal
					isOpen={fileModalOpen}
					onRequestClose={() => setFileModalOpen(false)}
				>
					<div className="file">
						<input
							placeholder="Choose File"
							type="file"
							onChange={(e) => fileHandler(e)}
						></input>
						<button onClick={fileModalSendHandler}>Upload</button>
					</div>
				</Modal>

				<GifIcon onClick={() => setGifModalOpen(true)} />
				<Modal
					isOpen={gifModalOpen}
					onRequestClose={() => setGifModalOpen(false)}
				>
					<Gif
						setGifModalOpen={setGifModalOpen}
						setShowGif={setShowGif}
						setMessageState={setMessageState}
						usernameState={usernameState}
						messageState={messageState}
					/>
				</Modal>

				<InsertEmoticonIcon onClick={() => setEmojiModalOpen(true)} />
				<Modal
					size="sm"
					isOpen={emojiModalOpen}
					onRequestClose={() => setEmojiModalOpen(false)}
				>
					<Picker isOpen={emojiModalOpen} onEmojiClick={onEmojiClick} />
				</Modal>
				<form className="chat__footerForm">
					<FormControl fullWidth>
						<InputLabel>Enter a message</InputLabel>
						<Input
							onChange={(e) => onTextChange(e.target.value)}
							value={input.message}
							maxLength={12}
						/>
						<Button
							type="submit"
							disabled={!input}
							variant="contained"
							color="primary"
							onClick={sendMessage}
						>
							Send Message
						</Button>
					</FormControl>
				</form>
			</div>
		</div>
	);
}

export default Chat;
