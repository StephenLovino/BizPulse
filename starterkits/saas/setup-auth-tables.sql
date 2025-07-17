-- Supabase Auth integration tables for BizPulse application
-- Run this in your Supabase SQL editor

-- Application users table (synced with auth.users)
CREATE TABLE IF NOT EXISTS bizpulse_user (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    "emailVerified" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255),
    role TEXT DEFAULT 'User' NOT NULL CHECK (role IN ('User', 'Admin', 'Super Admin', 'saas_owner', 'business_owner', 'manager', 'staff')),
    "isNewUser" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Accounts table (for OAuth providers if needed)
CREATE TABLE IF NOT EXISTS bizpulse_account (
    "userId" VARCHAR(255) NOT NULL REFERENCES bizpulse_user(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    PRIMARY KEY (provider, "providerAccountId")
);

-- Sessions table (for session management)
CREATE TABLE IF NOT EXISTS bizpulse_session (
    "sessionToken" VARCHAR(255) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES bizpulse_user(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON bizpulse_account("userId");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON bizpulse_session("userId");

-- Enable Row Level Security (RLS) for security
ALTER TABLE bizpulse_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_session ENABLE ROW LEVEL SECURITY;

-- Create policies for Supabase Auth integration (drop existing ones first)
-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON bizpulse_user;
CREATE POLICY "Users can view own profile" ON bizpulse_user
    FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON bizpulse_user;
CREATE POLICY "Users can update own profile" ON bizpulse_user
    FOR UPDATE USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Service role can manage users" ON bizpulse_user;
CREATE POLICY "Service role can manage users" ON bizpulse_user
    FOR ALL USING (auth.role() = 'service_role');

-- Accounts policies
DROP POLICY IF EXISTS "Users can view own accounts" ON bizpulse_account;
CREATE POLICY "Users can view own accounts" ON bizpulse_account
    FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can manage own accounts" ON bizpulse_account;
CREATE POLICY "Users can manage own accounts" ON bizpulse_account
    FOR ALL USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Service role can manage accounts" ON bizpulse_account;
CREATE POLICY "Service role can manage accounts" ON bizpulse_account
    FOR ALL USING (auth.role() = 'service_role');

-- Sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON bizpulse_session;
CREATE POLICY "Users can view own sessions" ON bizpulse_session
    FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can manage own sessions" ON bizpulse_session;
CREATE POLICY "Users can manage own sessions" ON bizpulse_session
    FOR ALL USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Service role can manage sessions" ON bizpulse_session;
CREATE POLICY "Service role can manage sessions" ON bizpulse_session
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_user TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_account TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_session TO authenticated;

-- Grant permissions to service role (for server-side operations)
GRANT ALL ON bizpulse_user TO service_role;
GRANT ALL ON bizpulse_account TO service_role;
GRANT ALL ON bizpulse_session TO service_role;

-- Function to sync Supabase Auth users with application users table
CREATE OR REPLACE FUNCTION sync_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO bizpulse_user (id, email, name, "emailVerified", "createdAt")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email_confirmed_at,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, bizpulse_user.name),
    "emailVerified" = EXCLUDED."emailVerified";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically sync users when they sign up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_auth_user();
