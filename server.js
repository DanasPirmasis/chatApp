require('dotenv').config({ path: './config.env' });
const express = require('express');
const socketIO = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
// Connect DB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(`Server running on port ${PORT}`)
);

const io = socketIO(server).on('connection', (socket) => {
	socket.on('message', function (message) {
		io.emit('message', { message });
	});
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged error: ${err}`);
	server.close(() => process.exit(1));
});
