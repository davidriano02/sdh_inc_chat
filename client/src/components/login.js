// Login.js
import React, { useState, useContext } from 'react';
import ChatContext from '../context/chatContext';

const Login = () => {
    const { joinChat, setCurrentUser } = useContext(ChatContext);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleJoinChat = () => {
        setError('');
        joinChat(username, (response) => {
            if (response.success) {
                setCurrentUser(username);
            } else {
                setError(response.message);
            }
        });
    };

    return (
        <div className="join-chat">
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleJoinChat}>Join Chat</button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
