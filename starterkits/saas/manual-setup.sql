-- Manual Database Setup for BizPulse SaaS Platform
-- Run this in your Supabase SQL Editor

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

-- Organizations table
CREATE TABLE IF NOT EXISTS bizpulse_organization (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Organization memberships
CREATE TABLE IF NOT EXISTS bizpulse_membersToOrganizations (
    "userId" VARCHAR(255) NOT NULL REFERENCES bizpulse_user(id) ON DELETE CASCADE,
    "organizationId" VARCHAR(255) NOT NULL REFERENCES bizpulse_organization(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    "joinedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY ("userId", "organizationId")
);

-- Businesses table
CREATE TABLE IF NOT EXISTS bizpulse_business (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(255),
    "ownerId" VARCHAR(255) NOT NULL REFERENCES bizpulse_user(id) ON DELETE CASCADE,
    "organizationId" VARCHAR(255) REFERENCES bizpulse_organization(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Feedback table
CREATE TABLE IF NOT EXISTS bizpulse_feedback (
    id VARCHAR(255) PRIMARY KEY,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    "userId" VARCHAR(255) REFERENCES bizpulse_user(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Accounts table (for OAuth providers)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON bizpulse_account("userId");
CREATE INDEX IF NOT EXISTS "organization_slug_idx" ON bizpulse_organization(slug);
CREATE INDEX IF NOT EXISTS "business_ownerId_idx" ON bizpulse_business("ownerId");
CREATE INDEX IF NOT EXISTS "business_organizationId_idx" ON bizpulse_business("organizationId");
CREATE INDEX IF NOT EXISTS "feedback_userId_idx" ON bizpulse_feedback("userId");

-- Enable Row Level Security (RLS) for security
ALTER TABLE bizpulse_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_membersToOrganizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE bizpulse_account ENABLE ROW LEVEL SECURITY;

-- Create policies for Supabase Auth integration
-- Users policies
CREATE POLICY "Users can view own profile" ON bizpulse_user
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON bizpulse_user
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Service role can manage users" ON bizpulse_user
    FOR ALL USING (auth.role() = 'service_role');

-- Organization policies
CREATE POLICY "Users can view organizations they belong to" ON bizpulse_organization
    FOR SELECT USING (
        id IN (
            SELECT "organizationId" FROM bizpulse_membersToOrganizations
            WHERE "userId" = auth.uid()::text
        )
    );

CREATE POLICY "Organization owners can manage organizations" ON bizpulse_organization
    FOR ALL USING (
        id IN (
            SELECT "organizationId" FROM bizpulse_membersToOrganizations
            WHERE "userId" = auth.uid()::text AND role = 'owner'
        )
    );

-- Membership policies
CREATE POLICY "Users can view memberships they belong to" ON bizpulse_membersToOrganizations
    FOR SELECT USING ("userId" = auth.uid()::text);

-- Business policies
CREATE POLICY "Users can view businesses they own or belong to organization" ON bizpulse_business
    FOR SELECT USING (
        "ownerId" = auth.uid()::text OR
        "organizationId" IN (
            SELECT "organizationId" FROM bizpulse_membersToOrganizations
            WHERE "userId" = auth.uid()::text
        )
    );

CREATE POLICY "Business owners can manage their businesses" ON bizpulse_business
    FOR ALL USING ("ownerId" = auth.uid()::text);

-- Feedback policies
CREATE POLICY "Users can view own feedback" ON bizpulse_feedback
    FOR SELECT USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can create feedback" ON bizpulse_feedback
    FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

-- Accounts policies
CREATE POLICY "Users can view own accounts" ON bizpulse_account
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own accounts" ON bizpulse_account
    FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "Service role can manage accounts" ON bizpulse_account
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_user TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_organization TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_membersToOrganizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_business TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bizpulse_account TO authenticated;

-- Grant permissions to service role (for server-side operations)
GRANT ALL ON bizpulse_user TO service_role;
GRANT ALL ON bizpulse_organization TO service_role;
GRANT ALL ON bizpulse_membersToOrganizations TO service_role;
GRANT ALL ON bizpulse_business TO service_role;
GRANT ALL ON bizpulse_feedback TO service_role;
GRANT ALL ON bizpulse_account TO service_role;

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
