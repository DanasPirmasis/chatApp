import React from 'react';
import { useState } from 'react';
import './Chat.css';
import Picker from 'emoji-picker-react';
import Modal from 'react-modal';
import Gif from './Gif';
import uuid from 'react-uuid';
import { ChromePicker } from 'react-color';
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
import MicIcon from '@material-ui/icons/Mic';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { ReactMediaRecorder } from 'react-media-recorder';
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
	//open and close modals
	const [emojiModalOpen, setEmojiModalOpen] = useState(false);
	const [gifModalOpen, setGifModalOpen] = useState(false);
	const [fileModalOpen, setFileModalOpen] = useState(false);
	const [recordingModalOpen, setRecordingModalOpen] = useState(false);
	const [colorPiker, setColorPiker] = useState(false);

	const [color, setColor] = useState('#5967b8');
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

	const audioMessageHandler = async (mediaBlobUrl) => {
		console.log(mediaBlobUrl);
		let blob = await fetch(mediaBlobUrl).then((r) => r.blob());
		if (blob.size > 16000000) {
			errorState('Voice message is too long');
			return;
		}
		const file = await toBase64(blob);

		setMessageState({
			username: usernameState,
			file: file,
			fileType: 'audio/wav',
			fileName: 'Audio message',
		});
	};

	const audioModalSendHandler = (e) => {
		sendMessage(e);
		setRecordingModalOpen(false);
	};

	const fileHandler = async (e) => {
		console.log(e.target.files[0]);

		if (e.target.files[0].size > 16000000) {
			errorState('File size too big');
			return;
		}

		const file = await toBase64(e.target.files[0]);
		console.log(file);
		setMessageState({
			username: usernameState,
			file: file,
			fileType: e.target.files[0].type,
			fileName: e.target.files[0].name,
		});
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
							return val;
						} else if (
							val.message.toLowerCase().includes(search.toLowerCase())
						) {
							return val;
						}
						return null;
					})
					.map((message) => (
						<Message
							key={uuid()}
							username={username}
							message={message}
							color={color}
						></Message>
					))}
				{colorPiker && (
					<div className="pickcolor">
						<ChromePicker
							color={color}
							onChange={(updatedColor) => setColor(updatedColor.hex)}
						/>
					</div>
				)}

				{emojiModalOpen && (
					<div className="emojipiker">
						<Picker isOpen={emojiModalOpen} onEmojiClick={onEmojiClick} />
					</div>
				)}
			</div>

			<div className="chat__footer">
				<MicIcon onClick={() => setRecordingModalOpen(true)} />
				<Modal
					isOpen={recordingModalOpen}
					onRequestClose={() => setRecordingModalOpen(false)}
				>
					<ReactMediaRecorder
						audio
						render={({
							status,
							startRecording,
							stopRecording,
							mediaBlobUrl,
						}) => (
							<div>
								<button onClick={startRecording}>Start Recording</button>
								<button onClick={stopRecording}>Stop Recording</button>
								<button
									onClick={(e) => {
										audioModalSendHandler(e);
									}}
								>
									Send message
								</button>
								<audio src={mediaBlobUrl} controls />
							</div>
						)}
						onStop={(mediaBlobUrl) => {
							audioMessageHandler(mediaBlobUrl);
						}}
					/>
				</Modal>

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
						setMessageState={setMessageState}
						usernameState={usernameState}
						messageState={messageState}
					/>
				</Modal>
				<InsertEmoticonIcon
					onClick={() => setEmojiModalOpen((emojiModalOpen) => !emojiModalOpen)}
				/>

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

				<ColorLensIcon
					onClick={() => setColorPiker((colorPiker) => !colorPiker)}
				/>
			</div>
		</div>
	);
}

export default Chat;
