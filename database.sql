
CREATE DATABASE IF NOT EXISTS remmogo_db;
USE remmogo_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  group_id INT,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT,
  amount INT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT,
  amount INT,
  balance INT,
  status VARCHAR(20),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE approvals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT,
  approver VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES loans(id)
);
