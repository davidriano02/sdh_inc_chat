import React, { useContext } from 'react';
import ChatContext from '../context/chatContext';
import MessageInput from './messageInput';
import MessageList from './messageList';

const Chat = () => {
    const { currentUser, currentReceiver, sendMessage } = useContext(ChatContext);

    const handleSendMessage = (text) => {
        sendMessage(text);
    };

    return (
        <div className="chat-container">
            <h2>Welcome, {currentUser}!</h2>
            <div>
                <MessageList />
                <MessageInput onSendMessage={handleSendMessage} />
            </div>
            {currentReceiver && <p>Sending message to: {currentReceiver.username}</p>}
        </div>
    );
};

export default Chat;



