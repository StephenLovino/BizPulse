import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://bmjmmnywxhoygqciyssy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtam1tbnl3eGhveWdxY2l5c3N5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY5NDkwNywiZXhwIjoyMDY4MjcwOTA3fQ.b7DVWeMxaXNadZMaVsZwATnHzMYtJmQk3k-TEj6jDZk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up NextAuth.js tables in Supabase...');
    
    // Read the SQL file
    const sql = readFileSync('./setup-auth-tables.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        console.log('Executing:', trimmedStatement.substring(0, 50) + '...');
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: trimmedStatement
        });
        
        if (error) {
          console.error('Error executing statement:', error);
          console.error('Statement was:', trimmedStatement);
        } else {
          console.log('✓ Statement executed successfully');
        }
      }
    }
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
