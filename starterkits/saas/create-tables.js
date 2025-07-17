import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmjmmnywxhoygqciyssy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtam1tbnl3eGhveWdxY2l5c3N5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY5NDkwNywiZXhwIjoyMDY4MjcwOTA3fQ.b7DVWeMxaXNadZMaVsZwATnHzMYtJmQk3k-TEj6jDZk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('Creating NextAuth.js tables in Supabase...');
    
    // Test if we can create a simple table first
    console.log('Testing table creation...');
    
    // Try to create a test user
    const { data: testUser, error: testError } = await supabase
      .from('users')
      .insert({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      })
      .select()
      .single();
    
    if (testError) {
      console.error('Error creating test user:', testError);
      console.log('This likely means the users table does not exist yet.');
    } else {
      console.log('✓ Test user created successfully:', testUser);
      
      // Clean up test user
      await supabase.from('users').delete().eq('id', 'test-user-id');
      console.log('✓ Test user cleaned up');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();
