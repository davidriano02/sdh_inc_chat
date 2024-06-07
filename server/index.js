import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createConnection } from 'mysql2';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

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
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_DATABASE 
});


db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
    console.log('Conectado a la base de datos');
});

let connectedUsers = [];

const updateConnectedUsers = () => {
    socketio.emit('connectedUsers', connectedUsers);
};

socketio.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('join', (username, callback) => {
        if (!username) {
            callback({ success: false, message: 'El nombre de usuario es requerido' });
            return;
        }

        socket.username = username;

        db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback({ success: false, message: 'Error en la base de datos' });
                return;
            }

            if (results.length > 0) {
                socket.userId = results[0].id;

                const userExists = connectedUsers.some(user => user.userId === socket.userId);
                if (!userExists) {
                    connectedUsers.push({ username, userId: socket.userId, socketId: socket.id });
                } else {
                    connectedUsers = connectedUsers.map(user => 
                        user.userId === socket.userId ? { ...user, socketId: socket.id } : user
                    );
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

        if (!to || !text || !from) {
            console.error('Mensaje inválido:', message);
            return;
        }

        db.query('SELECT id FROM users WHERE username = ?', [to], (err, results) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                return;
            }

            if (results.length === 0) {
                console.error('Usuario receptor no encontrado:', to);
                return;
            }

            const receiverId = results[0].id;

            db.query('INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)', 
                [socket.userId, receiverId, text, timestamp], (err) => {
                if (err) {
                    console.error('Error al insertar mensaje en la base de datos:', err);
                    return;
                }

                const receiverSocket = connectedUsers.find(user => user.userId === receiverId);
                if (receiverSocket) {
                    socketio.to(receiverSocket.socketId).emit('message', { to, from, text, timestamp });
                }

                socket.emit('message', { from, to, text, timestamp });
            });
        });
    });

    socket.on('fetchMessages', (receiver, callback) => {
        if (!receiver) {
            callback({ success: false, message: 'El receptor es requerido' });
            return;
        }

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
                console.error('Error en la base de datos:', err);
                callback({ success: false, message: 'Error en la base de datos' });
                return;
            }
            callback({ success: true, messages: results });
        });
    });

    const handleDisconnect = () => {
        connectedUsers = connectedUsers.filter(user => user.userId !== socket.userId);
        updateConnectedUsers();
        console.log('Usuario desconectado:', socket.username);

        socketio.emit('userDisconnected', { username: socket.username, userId: socket.userId });
    };

    socket.on('disconnect', handleDisconnect);

    socket.on('manualDisconnect', () => {
        handleDisconnect();
        socket.disconnect();
    });
});

server.listen(3001, () => {
    console.log('Servidor escuchando en el puerto 3001');
});
