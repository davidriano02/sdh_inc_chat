-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.28-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE DATABASE IF NOT EXISTS sdh_inc_chat;

USE sdh_inc_chat;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Use the database
USE sdh_inc_chat;

-- Insert 5 random users
INSERT INTO users (username) VALUES 
('user1'),
('user2'),
('user3'),
('user4'),
('user5');

-- Insert 2 random messages for each user (assuming they send messages to each other)
INSERT INTO messages (sender_id, receiver_id, message) VALUES
(1, 2, 'Hello from user1 to user2'),
(1, 3, 'Hello from user1 to user3'),
(2, 1, 'Hello from user2 to user1'),
(2, 4, 'Hello from user2 to user4'),
(3, 1, 'Hello from user3 to user1'),
(3, 5, 'Hello from user3 to user5'),
(4, 1, 'Hello from user4 to user1'),
(4, 2, 'Hello from user4 to user2'),
(5, 1, 'Hello from user5 to user1'),
(5, 3, 'Hello from user5 to user3');

-- Verify the data
SELECT * FROM users;
SELECT * FROM messages;