import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './PrivateScreen.css';

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [conversationID, setConversationID] = useState('');
	const [inputUsername, setInputUsername] = useState('');
	const [outputUsernames, setOutputUsernames] = useState('');
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);
	const [username, setUsername] = useState('');
	const [userID, setUserID] = useState('');

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
				//console.log(data);
				setUsername(data.data.username);
				setConversationID(data.data.conversationIDS);
				setUserID(data.data._id);
				//console.log(data.data.conversationIDS);
			} catch (error) {
				localStorage.removeItem('authToken');
				setError('You are not authorized please login');
			}
		};

		//console.log(localStorage);
		fetchPrivateData();
	}, [history]);

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
			setOutputUsernames(data.data[0]);
			console.log(data.data[0]);

			//history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const fetchMessages = async (e) => {
		e.preventDefault();
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
				headers: config.header,
			});


			data.data.forEach(mess => (
				userID != mess.from ? setMessages(messages => [...messages,{ username: 'Danas', text: mess.body }]): setMessages(messages => [...messages, { username: 'ustinas', text: mess.body }])
			));


			//history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const getMessagesHandler = async () => {
		const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/getmessages',
				data: { conversationID },
				headers: config.header,
			});

			data.data.forEach(mess => (
				userID != mess.from ? setMessages([...messages, { username: 'Danas', text: mess.body }]): setMessages([...messages, { username: 'ustinas', text: mess.body }])
				//userID != mess.from ? setMessages([...messages, { username: 'Danas', text: mess.body }]): setMessages([...messages, { username: 'ustinas', text: mess.body }])
				//console.log(mess)
			));


			//history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const sendMessagesHandler = async () => {
		const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			console.log(conversationID);
			const { data } = await axios({
				method: 'post',
				url: '/api/private/postmessage',
				data: { conversationID, from: userID, body: input },
				headers: config.header,
			});
			console.log(data);

			//history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const sendMessage = (event) => {
		event.preventDefault();
		//setMessages([...messages, { username: username, text: input }]);
		sendMessagesHandler();
		getMessagesHandler();
		setInput('');
	};

	const logoutHandler = () => {
		localStorage.removeItem('authToken');
		history.push('/login');
		setUsername('');
		setUserID('');
		console.log(username);
		console.log(userID);
	};

	return error ? (
		<span className="error-message">{error}</span>
	) : (
		<>
			<div className="chatApp">
				<div className="chatApp__top">
					<h2> Welcome {username}</h2>
					<button onClick={logoutHandler}>Logout</button>
					<button onClick={fetchMessages}>Refresh</button>
				</div>

				<div className="chatApp__body">
					<Sidebar
						userSearchHandler={userSearchHandler}
						inputUsername={inputUsername}
						setInputUsername={setInputUsername}
						outputUsernames={outputUsernames}
					/>

					<Chat
						input={input}
						setInput={setInput}
						sendMessage={sendMessage}
						messages={messages}
						username={username}
					/>
				</div>
			</div>
		</>
	);
};

export default PrivateScreen;
