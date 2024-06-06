import React, { useContext } from 'react';
import ChatProvider from './context/chatProvider';
import ChatContext from './context/chatContext';
import UserList from './components/userList';
import Chat from './components/chat';
import Login from './components/login';
import './App.css';

const App = () => {
    return (
        <ChatProvider>
            <AppContent />
        </ChatProvider>
    );
};

const AppContent = () => {
    const { currentUser } = useContext(ChatContext);

    return (
        <div className="app-container">
            <header className="header">
                    <h1>SDH Inc Chat</h1>
                </header>
            {!currentUser ? (
                <Login />
            ) : (
                <><div className="chat-content">
                    <UserList />
                    <Chat />
                    </div>
                </>
            )}
        </div>
    );
};

export default App;

