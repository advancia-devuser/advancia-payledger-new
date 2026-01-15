-- ====================================
-- ADVANCIA PAY LEDGER - DATABASE USER SETUP
-- ====================================
-- Purpose: Create application-specific database user with limited privileges
-- Run this as: doadmin (super user)
-- Date: January 14, 2026
-- ====================================

-- 1. CREATE APPLICATION USER
-- Replace 'your_secure_password' with a strong password
CREATE USER advancia_app WITH PASSWORD 'your_secure_password_here';

-- 2. GRANT CONNECTION TO DATABASE
GRANT CONNECT ON DATABASE defaultdb TO advancia_app;

-- 3. GRANT SCHEMA USAGE
GRANT USAGE ON SCHEMA public TO advancia_app;

-- 4. GRANT TABLE PRIVILEGES
-- Grant all privileges on existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO advancia_app;

-- Grant privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO advancia_app;

-- 5. GRANT SEQUENCE PRIVILEGES (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO advancia_app;

-- Grant privileges on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO advancia_app;

-- 6. GRANT FUNCTION EXECUTION (if needed)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO advancia_app;

-- 7. VERIFY USER CREATION
SELECT usename, usecreatedb, usesuper 
FROM pg_user 
WHERE usename = 'advancia_app';

-- 8. CHECK GRANTED PRIVILEGES
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'advancia_app'
ORDER BY table_name;

-- ====================================
-- ADDITIONAL SECURITY SETTINGS
-- ====================================

-- Set connection limit for app user (optional)
ALTER USER advancia_app CONNECTION LIMIT 15;

-- Set statement timeout to prevent long-running queries (30 seconds)
ALTER USER advancia_app SET statement_timeout = '30s';

-- Set idle in transaction timeout (5 minutes)
ALTER USER advancia_app SET idle_in_transaction_session_timeout = '5min';

-- ====================================
-- AFTER RUNNING THIS SCRIPT
-- ====================================
-- Update your .env.production file:
-- DATABASE_URL="postgresql://advancia_app:your_secure_password@db-postgresql-nyc3-69155-do-user-28773801-0.h.db.ondigitalocean.com:25060/defaultdb?sslmode=require"

-- Test connection:
-- psql "postgresql://advancia_app:your_secure_password@db-postgresql-nyc3-69155-do-user-28773801-0.h.db.ondigitalocean.com:25060/defaultdb?sslmode=require"

-- ====================================
-- REVOKE PRIVILEGES (if needed)
-- ====================================
-- REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM advancia_app;
-- REVOKE ALL PRIVILEGES ON DATABASE defaultdb FROM advancia_app;
-- DROP USER advancia_app;
