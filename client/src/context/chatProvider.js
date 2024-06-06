import React, { useState, useEffect } from 'react';
import ChatContext from './chatContext';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const ChatProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [currentReceiver, setCurrentReceiver] = useState(null);

    useEffect(() => {
        socket.on('userConnected', (user) => {
            setUsers((prevUsers) => [...prevUsers, user]);
        });

        socket.on('userDisconnected', (user) => {
            setUsers((prevUsers) => prevUsers.filter(u => u.userId !== user.userId));
        });

        socket.on('connectedUsers', (connectedUsers) => {
            setUsers(connectedUsers);
        });

        socket.on('message', (message) => {
            console.log(message)
            setMessages((prevMessages) => {
                const updatedMessages = { ...prevMessages };
                const chatId = message.from === currentUser ? message.to : message.from;
                if (!updatedMessages[chatId]) {
                    updatedMessages[chatId] = [];
                }else{
                updatedMessages[chatId].push({
                    sender: message.from,
                    receiver: message.to,
                    message: message.text,
                    timestamp: message.timestamp
                }); 
            }
                return updatedMessages;
            });
        });

        return () => {
            socket.off('userConnected');
            socket.off('userDisconnected');
            socket.off('connectedUsers');
            socket.off('message');
        };
    }, [currentUser]);

    const joinChat = (username, callback) => {
        socket.emit('join', username, callback);
    };

    const sendMessage = (text) => {
        if (currentReceiver) {
            const message = { to: currentReceiver.username, text, from: currentUser };
            socket.emit('message', message);
        }
    };

    const fetchMessages = (receiver) => {
        if (receiver) {
            socket.emit('fetchMessages', receiver.username, ({ success, messages }) => {
                if (success) {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [receiver.username]: messages,
                    }));
                }
            });
        }
    };

    return (
        <ChatContext.Provider value={{
            users,
            messages,
            currentUser,
            currentReceiver,
            setCurrentReceiver,
            joinChat,
            sendMessage,
            setCurrentUser,
            fetchMessages
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
