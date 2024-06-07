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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    
        // Agrega un cero inicial si el número es menor que 10
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
        return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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
                        <small>{formatTime(message.timestamp)}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;


