import { createClient } from './server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import type { User } from '@supabase/supabase-js'

/**
 * Sync a Supabase Auth user with the application's users table
 */
export async function syncUserToDatabase(authUser: User) {
  try {
    // Extract user data from Supabase Auth user
    const userData = {
      id: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.name || 
            authUser.user_metadata?.full_name || 
            authUser.email?.split('@')[0] || 
            'User',
      emailVerified: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : new Date(),
      image: authUser.user_metadata?.avatar_url || null,
      role: 'User' as const,
      isNewUser: true,
      createdAt: new Date(authUser.created_at),
    }

    // Insert or update user in the application's users table
    await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          name: userData.name,
          emailVerified: userData.emailVerified,
          image: userData.image,
        },
      })

    console.log('User synced successfully:', userData.id)
    return userData
  } catch (error) {
    console.error('Error syncing user to database:', error)
    throw error
  }
}

/**
 * Get or create a user in the application's database from Supabase Auth
 */
export async function getOrCreateUser() {
  const supabase = createClient()
  
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      console.error('Error getting auth user:', error)
      return null
    }

    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, authUser.id),
    })

    if (existingUser) {
      return existingUser
    }

    // If user doesn't exist, sync them
    return await syncUserToDatabase(authUser)
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    return null
  }
}

/**
 * Ensure the current user exists in the application database
 * This should be called in protected routes to ensure user sync
 */
export async function ensureUserExists() {
  const user = await getOrCreateUser()
  
  if (!user) {
    throw new Error('User not found or could not be synced')
  }
  
  return user
}
