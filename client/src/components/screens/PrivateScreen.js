import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './PrivateScreen.css';
import { io } from 'socket.io-client';

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	//input for search
	const [inputUsername, setInputUsername] = useState('');
	//usernames to display conversations
	const [outputUsernames, setOutputUsernames] = useState('');
	//input data from sendMessagesHandler
	const [messageState, setMessageState] = useState({
		recipientID: '',
		username: '',
		message: '',
	});
	//data from fetchMessages
	const [chat, setChat] = useState([]);
	//data from fetchPrivateData
	const [conversationID, setConversationID] = useState('');
	const [usernameState, setUsernameState] = useState('');
	const [userID, setUserID] = useState('');

	//gif
	const [sendGif,SetSendGif] =useState('')

	const socket = io('http://localhost:5000/');

	socket.on('askForUserId', () => {
		socket.emit('userIdReceived', userID);
	});

	socket.on('message', ({ username, message }) => {
		setChat([...chat, { username, message }]);
	});

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			history.push('/login');
		}

		const fetchPrivateData = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.get('/api/private', config);
				setUsernameState(data.data.username);
				setConversationID(data.data.conversationIDS);
				setUserID(data.data._id);
			} catch (error) {
				localStorage.removeItem('authToken');
				setError('You are not authorized please login');
			}
		};

		fetchPrivateData();
	});

	const userSearchHandler = async (e) => {
		e.preventDefault();

		const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		console.log(config);
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/searchusers',
				data: { inputUsername },
				headers: config.header,
			});
			console.log(data);
			setOutputUsernames(data.data);
			console.log(data.data);

			//history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const getRecipients = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/getrecipients',
				data: { conversationID },
				headers: config.headers,
			});
			setMessageState({ recipientID: data.data });
			console.log(messageState);
		} catch (error) {
			console.log(error);
		}
	};

	const getConversationRecipientUsernames = async (e) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/getusernames',
				data: { conversationID },
				headers: config.headers,
			});
			console.log(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchMessages = async (e) => {
		//e.preventDefault();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};

		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/getmessages',
				data: { conversationID },
				headers: config.headers,
			});

			console.log(data);
			setChat([]);
			console.log(data.data.length);

			for (let i = 0; i < data.data.length; i++) {
				let username = data.data[i].fromUsername;
				let message = data.data[i].body;
				console.log(message);
				setChat([...chat, { username, message }]);
			}
			console.log(chat);
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const sendMessagesHandler = async (e) => {
		const { username, message } = messageState;
		const recipientID = '607710a96b5ccc0ee4a70309';
		/*const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			console.log(conversationID);
			console.log(username);
			console.log(message);
			const { data } = await axios({
				method: 'post',
				url: '/api/private/postmessage',
				data: {
					conversationID,
					from: userID,
					fromUsername: username,
					body: message,
				},
				headers: config.header,
			});
			console.log(data);
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}*/

		socket.emit('message', { recipientID: userID, username, message });
		socket.emit('message', { recipientID, username, message });
		console.log(recipientID);
		console.log(username);
		console.log(message);
		e.preventDefault();
		setMessageState({ message: '', username });
	};

	const onTextChange = (e) => {
		setMessageState({ ...messageState, username: usernameState, message: e });
	};

	const logoutHandler = () => {
		localStorage.removeItem('authToken');
		history.push('/login');
		setUsernameState('');
		setUserID('');
		console.log(usernameState);
		console.log(userID);
	};

	return error ? (
		<span className="error-message">{error}</span>
	) : (
		<>
			<div className="chatApp">
				<div className="chatApp__top">
					<button onClick={logoutHandler}>Logout</button>
					<button onClick={fetchMessages}>Refresh</button>
				</div>

				<div className="chatApp__body">
					<Sidebar
						userSearchHandler={userSearchHandler}
						inputUsername={inputUsername}
						setInputUsername={setInputUsername}
						outputUsernames={outputUsernames}
						usernameState={usernameState}
					/>

					<Chat
						SetSendGif= {SetSendGif}
						messageState={messageState}
						usernameState={usernameState}
						setMessageState={setMessageState}
						input={messageState}
						onTextChange={onTextChange}
						sendMessage={sendMessagesHandler}
						messages={chat}
						username={usernameState}
					/>
				</div>
			</div>
		</>
	);
};

export default PrivateScreen;
