-- Create Database
CREATE DATABASE IF NOT EXISTS epintwali_db;
USE epintwali_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    regNumber VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'teacher', 'student') NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Marks Table
CREATE TABLE IF NOT EXISTS Marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    teacherId INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    marks FLOAT DEFAULT 0,
    term VARCHAR(255) DEFAULT 'Term 1',
    academicYear VARCHAR(255) DEFAULT '2026',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Initial Administrator (Password: admin - Remember to hash it if inserting manually, 
-- but the backend server.js will auto-seed this on first run with hashing)
-- INSERT INTO Users (name, email, password, role) 
-- VALUES ('System Admin', 'admin@epintwali.edu.rw', '$2a$10$YourHashedPasswordHere', 'admin');
