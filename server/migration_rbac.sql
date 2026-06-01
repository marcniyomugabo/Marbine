-- RBAC Migration: Add role column to users
SET @dbname = 'marbine_memories';
SET @exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role');

SET @sql = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN role ENUM(\'admin\', \'user\') DEFAULT \'user\'', 'SELECT \'role column already exists\'');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing admin accounts based on ADMIN_EMAILS
UPDATE users SET role = 'admin' WHERE email IN (
  'marc@marbine.com',
  'blandine@marbine.com',
  'marcniyomugabo1@gmail.com',
  'blandineingabire050@gmail.com'
);

-- Update any remaining accounts to 'user'
UPDATE users SET role = 'user' WHERE role IS NULL OR role = '';
