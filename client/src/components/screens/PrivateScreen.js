import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [privateData, setPrivateData] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [chatIDS, setChatIDS] = useState('');

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

		fetchPrivateData();
	}, [history]);

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
				<input />
				<button>New Message</button>
				<button onClick={() => setModalOpen(false)}>Close</button>
			</Modal>
		</>
	);
};

export default PrivateScreen;
