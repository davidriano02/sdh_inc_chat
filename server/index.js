import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createConnection } from 'mysql2';
import cors from 'cors';

const app = express();
const server = createServer(app);
const socketio = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdh_inc_chat'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

let connectedUsers = [];

const updateConnectedUsers = () => {
    socketio.emit('connectedUsers', connectedUsers);
};

socketio.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (username, callback) => {
        socket.username = username;

        db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                callback({ success: false, message: 'Database error' });
                throw err;
            }

            if (results.length > 0) {
                socket.userId = results[0].id;
                connectedUsers.push({ username, userId: socket.userId, socketId: socket.id });
                updateConnectedUsers();
                callback({ success: true });
            } else {
                callback({ success: false, message: 'User not found' });
            }
        });
    });

    socket.on('message', (message) => {
        const { to, text, from } = message;
        const timestamp = new Date().toISOString();

        db.query('SELECT id FROM users WHERE username = ?', [to], (err, results) => {
            if (err) throw err;
            const receiverId = results[0].id;

            db.query('INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)', [socket.userId, receiverId, text, timestamp], (err) => {
                if (err) throw err;

                const receiverSocket = connectedUsers.find(user => user.userId === receiverId);
                if (receiverSocket) {
                    socketio.to(receiverSocket.socketId).emit('message', { from, text, timestamp });
                }
            });
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.userId !== socket.userId);
        updateConnectedUsers();
        socketio.emit('userDisconnected', { username: socket.username, userId: socket.userId });
    });
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});


