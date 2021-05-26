import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './PrivateScreen.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/', {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 5,
});

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	//input for search
	const [inputUsername, setInputUsername] = useState('');
	//usernames to display conversations
	const [outputUsernames, setOutputUsernames] = useState([]);
	const [findId, setfindId] = useState(['']);
	const [addId, setAddId] = useState(['']);
	//input data from sendMessagesHandler
	const [messageState, setMessageState] = useState({
		recipientID: '',
		username: '',
		message: '',
		messageID: '',
		file: '',
		fileType: '',
		fileName: '',
	});
	//data from fetchMessages
	const [chat, setChat] = useState([]);
	//reikes naudot po pakeitimu
	//const [conversationID, setConversationID] = useState('');

	// socket.on('askForUserId', () => {
	// 	socket.emit('userIdReceived', localStorage.getItem('userID'));
	// });

	socket.on(
		'messageReceived',
		({ username, message, file, fileName, fileType }) => {
			const snd = new Audio(
				'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
			);
			snd.play();
			setChat([...chat, { username, message, file, fileName, fileType }]);
		}
	);

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			history.push('/login');
		}

		if (error.includes('Unauthorized to access this route')) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('username');
			localStorage.removeItem('conversationIDS');
			localStorage.removeItem('userID');
			history.push('/login');
		}

		socket.emit('userIdReceived', localStorage.getItem('userID'));
	}, [error, history]);
	//user search should throw errors if there are missing inputs
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
			setOutputUsernames(data.data.usernamesList);
			setfindId(data.data.idList);
			console.log(data.data);
		} catch (error) {
			console.log(error);
			//setError(error.response.data.error);
		}
	};

	const loopthrough =(value) =>{
		var arr =[]
		value.map(i => {
			arr.push(i.id)
		})
		return arr
	}

	const newConversationHandler = async (e, convIds) => {
		e.preventDefault();

		const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		console.log(config);
		console.log(loopthrough(convIds))
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/newconversation',
				data: { recipients:[localStorage.getItem('userID'),...loopthrough(convIds)]
			},
				headers: config.header,
			});
			console.log(data.data);
		} catch (error) {
			console.log(error);
			setError(error.response.data.error);
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
				data: {}, //Cia turi atsirast conversationID is room name paspaudimo
				headers: config.headers,
			});
			setMessageState({ recipientID: data.data });
			console.log(messageState);
		} catch (error) {
			console.log(error);
			setError(error.response.data.error);
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
				data: {conversationID: localStorage.getItem('conversationIDS')}, //Cia turi atsirast conversationID is room name paspaudimo
				headers: config.headers,
			});
			console.log(data.data);
		} catch (error) {
			console.log(error);
			setError(error.response.data.error);
		}
	};

	const fetchMessages = async (e) => {
		//e.preventDefault();
		setChat([]);
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
				data: { conversationID: localStorage.getItem('conversationIDS') }, //Cia turi atsirast conversationID is room name paspaudimo
				headers: config.headers,
			});

			console.log(data);

			let messageUsernameArray = [];
			for (let i = 0; i < data.data.length; i++) {
				let username = data.data[i].fromUsername;
				let message = data.data[i].body;
				let file = data.data[i].file;
				let fileType = data.data[i].fileType;
				let fileName = data.data[i].fileName;
				let messageID = data.data[i]._id;
				messageUsernameArray.push({
					username,
					message,
					file,
					messageID,
					fileType,
					fileName,
				});
			}
			setChat(messageUsernameArray);
		} catch (error) {
			console.log(error);
			setError(error.response.data.error);
		}
	};

	const sendMessagesHandler = async (e) => {
		e.preventDefault();
		const { username, message, file, fileType, fileName } = messageState;
		const recipientID = '607710a96b5ccc0ee4a70309';

		const config = {
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios({
				method: 'post',
				url: '/api/private/postmessage',
				data: {
					conversationID: localStorage.getItem('conversationIDS'), //Cia turi atsirast conversationID is room name paspaudimo
					from: localStorage.getItem('userID'),
					fromUsername: username,
					body: message,
					file: file,
					fileName: fileName,
				},
				headers: config.header,
			});

			setChat([
				...chat,
				{ username, message, file, fileType, fileName, messageID: data.data },
			]);
		} catch (error) {
			setError(error.response.data.error);
		}

		socket.emit('message', {
			recipientID,
			username,
			message,
			file,
			fileType,
			fileName,
		});

		//e.preventDefault();
		setMessageState({
			message: '',
			username,
			file: '',
			messageID: '',
			fileName: '',
			fileType: '',
		});
	};

	const onTextChange = (e) => {
		setMessageState({
			...messageState,
			username: localStorage.getItem('username'),
			message: e,
		});
	};

	const logoutHandler = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('username');
		localStorage.removeItem('conversationIDS');
		localStorage.removeItem('userID');

		history.push('/login');
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
						usernameState={localStorage.getItem('username')}
						findId={findId}
						setAddId={setAddId}
						newConversationHandler={newConversationHandler}
					/>
					<Chat
						messageState={messageState}
						usernameState={localStorage.getItem('username')}
						setMessageState={setMessageState}
						input={messageState}
						onTextChange={onTextChange}
						sendMessage={sendMessagesHandler}
						messages={chat}
						username={localStorage.getItem('username')}
						errorState={setError}
					/>
				</div>
			</div>
		</>
	);
};

export default PrivateScreen;
