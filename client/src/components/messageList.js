import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUser }) => {
    const messageListRef = useRef(null);

    useEffect(() => {
        // Hacer scroll hacia abajo al cargar el componente y cada vez que se actualice la lista de mensajes
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        // Hacer scroll hacia abajo
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    return (
        <div className="message-list-container" ref={messageListRef}>
            <h3>Mensajes:</h3>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li
                        key={index}
                        className={`message ${message.sender === currentUser ? 'sent' : 'received'}`}
                    >
                        <p><strong>{message.sender}</strong>: {message.message}</p>
                        <small>{message.timestamp}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
