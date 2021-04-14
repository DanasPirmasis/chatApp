import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [privateData, setPrivateData] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [chatIDS, setChatIDS] = useState('');
	const [inputUsername, setInputUsername] = useState('');
	const [outputUsernames, setOutputUsernames] = useState('');

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
				setPrivateData(data.data);
				setChatIDS(data.chatIDS);
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

		try {
			const { data } = await axios.post(
				'/api/private/searchusers',
				{ inputUsername },
				config
			);

			setOutputUsernames(data.data[0].username);
			console.log(data.data[0].username);

			history.push('/searchusers');
		} catch (error) {
			setError(error.response.data.error);
			localStorage.removeItem('authToken');
		}
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
