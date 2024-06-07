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
            {currentReceiver && (
                <div className="chat-header">
                    <p className="chat-header-text">Chat con {currentReceiver.username}</p>
                </div>
            )}
            <MessageList messages={messages[currentReceiver?.username] || []} currentUser={currentUser} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chat;
