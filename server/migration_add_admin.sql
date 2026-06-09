-- Migration: Add marbine@gmail.com admin user
-- Password: Marbine@18 (bcrypt hash below)
-- This SQL is a reference; use the Node script (scripts/create-admin.js) to run it,
-- or run directly if you have the bcrypt hash.

-- Ensure role column exists
SET @dbname = 'marbine_memories';
SET @exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role');
SET @sql = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN role ENUM(\'admin\', \'user\') DEFAULT \'user\'', 'SELECT \'role column already exists\'');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert or update admin user
INSERT INTO users (fullname, email, password, role)
SELECT 'Marbine Admin', 'marbine@gmail.com', '$2a$10$YourBcryptHashHere', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'marbine@gmail.com');

-- If user exists, ensure role is admin
UPDATE users SET role = 'admin' WHERE email = 'marbine@gmail.com';
