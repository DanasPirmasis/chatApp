import React from 'react';
import './Chat.css';
import {
	Button,
	FormControl,
	InputLabel,
	Input,
	Avatar,
} from '@material-ui/core';
import Message from './Message';

function Chat({ input, onTextChange, sendMessage, messages, username }) {
	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar />

				<div className="chat__headerInfo">
					<h3>Room name</h3>
					<p>last seen</p>
				</div>
			</div>

			<div className="chat__body">
				{messages.map((message) => (
					<Message username={username} message={message}></Message>
				))}
			</div>

			<div className="chat__footer">
				<form>
					<FormControl>
						<InputLabel>Enter a message</InputLabel>
						<Input
							onChange={(e) => onTextChange(e.target.value)}
							value={input.message}
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
