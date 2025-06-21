-- Add role column to account table for Role-Based Access Control (RBAC)
-- This SQL should be executed against the existing database

-- Add the role column with default value 'user'
ALTER TABLE account 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' 
CHECK (role IN ('user', 'admin', 'dietitian'));

-- Update existing admin account to have admin role
UPDATE account 
SET role = 'admin' 
WHERE email = 'admin@gmail.com';

-- Create index for role column for better performance on role-based queries
CREATE INDEX idx_account_role ON account(role);

-- Verify the changes
SELECT email, role FROM account;


-- psql -h localhost -U postgres -d Bumba_fresh -f add-role-column.sql