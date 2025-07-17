-- Migration script to rename tables from launchmvpfast-saas-starterkit_ to bizpulse_
-- Run this in your Supabase SQL Editor AFTER creating the new BizPulse tables

-- Step 1: Create new BizPulse tables with the new naming convention
-- (You should run the manual-setup.sql first, but with bizpulse_ prefix)

-- Step 2: Migrate data from old tables to new tables (if they exist)
-- Only run these if you have existing data in the old tables

-- Migrate users
INSERT INTO bizpulse_user (id, name, email, "emailVerified", image, role, "isNewUser", "createdAt")
SELECT id, name, email, "emailVerified", image, role, "isNewUser", "createdAt"
FROM "launchmvpfast-saas-starterkit_user"
ON CONFLICT (id) DO NOTHING;

-- Migrate accounts
INSERT INTO bizpulse_account ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
SELECT "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
FROM "launchmvpfast-saas-starterkit_account"
ON CONFLICT (provider, "providerAccountId") DO NOTHING;

-- Migrate organizations (if exists)
INSERT INTO bizpulse_organization (id, name, slug, description, image, "createdAt", "updatedAt")
SELECT id, name, slug, description, image, "createdAt", "updatedAt"
FROM "launchmvpfast-saas-starterkit_organization"
ON CONFLICT (id) DO NOTHING;

-- Migrate memberships (if exists)
INSERT INTO bizpulse_membersToOrganizations ("userId", "organizationId", role, "joinedAt")
SELECT "userId", "organizationId", role, "joinedAt"
FROM "launchmvpfast-saas-starterkit_membersToOrganizations"
ON CONFLICT ("userId", "organizationId") DO NOTHING;

-- Migrate businesses (if exists)
INSERT INTO bizpulse_business (id, name, description, industry, "ownerId", "organizationId", "createdAt", "updatedAt")
SELECT id, name, description, industry, "ownerId", "organizationId", "createdAt", "updatedAt"
FROM "launchmvpfast-saas-starterkit_business"
ON CONFLICT (id) DO NOTHING;

-- Migrate feedback (if exists)
INSERT INTO bizpulse_feedback (id, message, rating, "userId", "createdAt")
SELECT id, message, rating, "userId", "createdAt"
FROM "launchmvpfast-saas-starterkit_feedback"
ON CONFLICT (id) DO NOTHING;

-- Step 3: Update the sync function to use new table name
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

-- Step 4: Drop old tables (ONLY after confirming data migration was successful)
-- UNCOMMENT THESE LINES ONLY AFTER VERIFYING YOUR DATA IS SAFELY MIGRATED

-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_account" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_session" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_feedback" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_business" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_membersToOrganizations" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_organization" CASCADE;
-- DROP TABLE IF EXISTS "launchmvpfast-saas-starterkit_user" CASCADE;

-- Verification queries (run these to check your migration)
-- SELECT COUNT(*) as old_users FROM "launchmvpfast-saas-starterkit_user";
-- SELECT COUNT(*) as new_users FROM bizpulse_user;
-- SELECT COUNT(*) as old_accounts FROM "launchmvpfast-saas-starterkit_account";
-- SELECT COUNT(*) as new_accounts FROM bizpulse_account;
