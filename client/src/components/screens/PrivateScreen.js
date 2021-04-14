import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import Message from './Message';

Modal.setAppElement('#root');

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [privateData, setPrivateData] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [chatIDS, setChatIDS] = useState('');
	const [inputUsername, setInputUsername] = useState('');
	const [outputUsernames, setOutputUsernames] = useState('');
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([
		{ username: 'ustinas', text: 'labas' },
		{ username: 'Danas', text: 'sveikutis' },
	]);
	const [username, setUsername] = useState('');

	useEffect(() => {
		//setUsername(prompt('Please enter username'));
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
				console.log(data);
				//setPrivateData(data.data);
				//setChatIDS(data.chatIDS);
			} catch (error) {
				localStorage.removeItem('authToken');
				setError('You are not authorized please login');
			}
		};
		console.log(localStorage);
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

			history.push('/searchusers');
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const sendMessage = (event) => {
		event.preventDefault();
		setMessages([...messages, { username: username, text: input }]);
		setInput('');
	};

	const logoutHandler = () => {
		localStorage.removeItem('authToken');
		history.push('/login');
	};

	return error ? (
		<span className="error-message">{error}</span>
	) : (
		<>
			<div style={{ background: 'green', color: 'white' }}>{privateData}</div>
			<div>{chatIDS}</div>
			<button onClick={logoutHandler}>Logout</button>
			<br />
			<h2> Welcome {username}</h2>

			<form>
				<FormControl>
					<InputLabel>Enter a message</InputLabel>
					<Input
						value={input}
						onChange={(event) => setInput(event.target.value)}
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

			<br />
			{messages.map((message) => (
				<Message username={message.username} text={message.text} />
			))}

			<br />
			<button onClick={() => setModalOpen(true)}>Open new message</button>
			<Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
				<h2>Find New Message</h2>
				<form onSubmit={userSearchHandler}>
					<input
						placeholder="Search users"
						value={inputUsername}
						onChange={(e) => setInputUsername(e.target.value)}
					/>
					<button type="submit">New Message</button>
				</form>

				<button onClick={() => setModalOpen(false)}>Close</button>
			</Modal>
		</>
	);
};

export default PrivateScreen;
