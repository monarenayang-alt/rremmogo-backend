-- RE-MMOGO Database Setup
CREATE DATABASE IF NOT EXISTS remmogo;
USE remmogo;

-- 1. Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'member',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Motshelo Group Table
CREATE TABLE IF NOT EXISTS MotsheloGroup (
  group_id      INT AUTO_INCREMENT PRIMARY KEY,
  group_name    VARCHAR(100) NOT NULL,
  start_date    DATE NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Member Table
CREATE TABLE IF NOT EXISTS members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  group_id      INT NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  role          VARCHAR(20) NOT NULL DEFAULT 'member',
  joined_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES MotsheloGroup(group_id)
);

-- 4. Signatory Table (2 approvers per group)
CREATE TABLE IF NOT EXISTS Signatory (
  signatory_id  INT AUTO_INCREMENT PRIMARY KEY,
  group_id      INT NOT NULL,
  member_id     INT NOT NULL,
  FOREIGN KEY (group_id)  REFERENCES MotsheloGroup(group_id),
  FOREIGN KEY (member_id) REFERENCES members(id),
  UNIQUE (group_id, member_id)
);

-- 5. Contribution Table (P1000 monthly)
CREATE TABLE IF NOT EXISTS contributions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  member_id       INT NOT NULL,
  group_id        INT NOT NULL,
  amount          DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
  month           DATE NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  proof           VARCHAR(255),
  proof_of_payment VARCHAR(255),
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (group_id)  REFERENCES MotsheloGroup(group_id)
);

-- 6. Loan Table (20% interest per month)
CREATE TABLE IF NOT EXISTS loans (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  member_id     INT NOT NULL,
  group_id      INT NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  balance       DECIMAL(10,2) NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
  applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at   DATETIME,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (group_id)  REFERENCES MotsheloGroup(group_id)
);

-- 7. Loan Payment Table
CREATE TABLE IF NOT EXISTS LoanPayment (
  payment_id      INT AUTO_INCREMENT PRIMARY KEY,
  loan_id         INT NOT NULL,
  member_id       INT NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  proof_of_payment VARCHAR(255),
  paid_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id)   REFERENCES loans(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- 8. Approval Table (signatory approvals)
CREATE TABLE IF NOT EXISTS Approval (
  approval_id   INT AUTO_INCREMENT PRIMARY KEY,
  loan_id       INT NOT NULL,
  signatory_id  INT NOT NULL,
  type          VARCHAR(20) NOT NULL DEFAULT 'loan',
  decision      VARCHAR(20) NOT NULL DEFAULT 'pending',
  approved_at   DATETIME,
  FOREIGN KEY (loan_id) REFERENCES loans(id)
);