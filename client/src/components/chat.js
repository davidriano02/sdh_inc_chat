import React, { useContext } from 'react';
import ChatContext from '../context/chatContext';
import MessageInput from './messageInput';
import MessageList from './messageList';

const Chat = () => {
    const { currentUser, currentReceiver, sendMessage, messages } = useContext(ChatContext);

    const handleSendMessage = (text) => {
        sendMessage(text);
    };

    return (
        <div className="chat-container">
            <h2>Bienvenido, {currentUser}!</h2>
            {currentReceiver && <p>Chat con {currentReceiver.username}</p>}
            <MessageList messages={messages[currentReceiver?.username] || []} currentUser={currentUser} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chat;
