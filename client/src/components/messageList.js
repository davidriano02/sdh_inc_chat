import React from 'react';

const MessageList = ({ messages, currentUser, currentReceiver }) => {
    console.log(messages)
    console.log(currentReceiver)
    console.log(currentUser)
    return (
        <div className="message-list-container">
            <h3>Messages:</h3>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li
                        key={index}
                        className={`message ${message.from === currentUser ? 'sent' : 'received'}`}
                    >
                        <p><strong>{message.from}</strong>: {message.message}</p>
                        <small>{message.timestamp}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
