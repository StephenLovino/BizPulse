import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read environment variables from .env.local
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/"/g, '');
  }
});

// Create Supabase client with service role key
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function createUsersTable() {
  try {
    console.log('Creating users table...');

    // Create the users table with the exact schema from our Drizzle definition
    const { error: userTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "launchmvpfast-saas-starterkit_user" (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          "emailVerified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          image VARCHAR(255),
          role TEXT DEFAULT 'User' NOT NULL CHECK (role IN ('User', 'Admin', 'Super Admin', 'saas_owner', 'business_owner', 'manager', 'staff')),
          "isNewUser" BOOLEAN DEFAULT true NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `
    });

    if (userTableError) {
      console.error('Error creating users table:', userTableError);
    } else {
      console.log('✓ Users table created successfully');
    }

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createUsersTable();
