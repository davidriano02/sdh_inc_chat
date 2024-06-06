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
    console.log('Conectado a la base de datos');
});

let connectedUsers = [];

const updateConnectedUsers = () => {
    socketio.emit('connectedUsers', connectedUsers);
};

socketio.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('join', (username, callback) => {
        socket.username = username;

        db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                callback({ success: false, message: 'Error en la base de datos' });
                throw err;
            }

            if (results.length > 0) {
                socket.userId = results[0].id;

                // Verificar si el usuario ya está en la lista de usuarios conectados
                const userExists = connectedUsers.some(user => user.userId === socket.userId);
                if (!userExists) {
                    connectedUsers.push({ username, userId: socket.userId, socketId: socket.id });
                } else {
                    // Actualizar el socketId si ya existe el usuario
                    connectedUsers = connectedUsers.map(user => user.userId === socket.userId ? { ...user, socketId: socket.id } : user);
                }

                updateConnectedUsers();
                callback({ success: true });
            } else {
                callback({ success: false, message: 'Usuario no encontrado' });
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
                    socketio.to(receiverSocket.socketId).emit('message', { to, from, text, timestamp });
                }

                // También enviar el mensaje de vuelta al remitente para actualizar su chat
                socket.emit('message', { from, to, text, timestamp });
            });
        });
    });

    socket.on('fetchMessages', (receiver, callback) => {
        db.query(`
            SELECT u1.username as sender, u2.username as receiver, m.message, m.timestamp
            FROM messages m
            JOIN users u1 ON m.sender_id = u1.id
            JOIN users u2 ON m.receiver_id = u2.id
            WHERE (u1.username = ? AND u2.username = ?)
            OR (u1.username = ? AND u2.username = ?)
            ORDER BY m.timestamp
        `, [socket.username, receiver, receiver, socket.username], (err, results) => {
            if (err) {
                callback({ success: false, message: 'Error en la base de datos' });
                throw err;
            }
            callback({ success: true, messages: results });
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.userId !== socket.userId);
        updateConnectedUsers();
        console.log('Usuario desconectado');

        // Emitir el evento de desconexión de usuario
        socketio.emit('userDisconnected', { username: socket.username, userId: socket.userId });
    });
    socket.on('manualDisconnect',()=>{
        connectedUsers = connectedUsers.filter(user => user.Id !== socket.userId)
        updateConnectedUsers();
        console.log('Usuario desconectado');
        socket.disconnect();
    });
});

server.listen(3001, () => {
    console.log('Servidor escuchando en el puerto 3001');
});
