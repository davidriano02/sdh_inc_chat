import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <div className="message-input-container">
            <input
                type="text"
                placeholder="Enter your message"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default MessageInput;



