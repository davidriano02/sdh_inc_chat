import React, { useContext } from 'react';
import ChatContext from '../context/chatContext';

const MessageList = () => {
    const { messages, currentUser } = useContext(ChatContext);

    return (
        <div className="message-list-container">
            <h3>Messages:</h3>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li
                        key={index}
                        className={`message ${message.from === currentUser ? 'sent' : 'received'}`}
                    >
                        <p><strong>{message.from}</strong>: {message.text}</p>
                        <small>{message.timestamp}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
