require('dotenv').config({ path: './config.env' });
const express = require('express');
const socket = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const app = express();
const server = require('http').Server(app);

// Connect DB
connectDB();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const io = socket(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
});

const sessionsMap = {};
let a = 0;
let b = 0;
let c = 0;
io.on('connection', (socket) => {
	io.emit('askForUserId');

	socket.on('userIdReceived', (userId) => {
		sessionsMap[userId] = socket.id;
	});

	socket.on(
		'message',
		({ recipientID, username, message, file, fileType, fileName }) => {
			console.log(sessionsMap);
			console.log(file);
			console.log(fileType);
			console.log(fileName);
			const socketID = sessionsMap[recipientID];
			socket.to(socketID).emit('messageReceived', {
				username,
				message,
				file,
				fileType,
				fileName,
			});
			// console.log(socketID);
			console.log(recipientID);
			console.log(message);
		}
	);
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged error: ${err}`);
	server.close(() => process.exit(1));
});
