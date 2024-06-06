import React, { useContext } from 'react';
import ChatContext from '../context/chatContext';

const UserList = () => {
    const { users, setCurrentReceiver, currentUser, fetchMessages } = useContext(ChatContext);

    const handleUserClick = (user) => {
        setCurrentReceiver(user);
        fetchMessages(user);
    };

    return (
        <div className="user-list-container">
            <h3>Connected Users:</h3>
            <ul className="user-list">
                {users
                    .filter((user) => user.username !== currentUser) // Filtrar el usuario actual
                    .map((user) => (
                        <li key={user.userId} onClick={() => handleUserClick(user)}>
                            {user.username} (ID: {user.userId})
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default UserList;
