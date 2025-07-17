import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/env'
import { protectedRoutes, siteUrls } from '@/config/urls'
import { getAbsoluteUrl } from '@/lib/utils'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin")

  // Check if this is a protected route
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    // If path starts with /auth and user is authenticated, redirect to dashboard
    if (user && request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(getAbsoluteUrl(siteUrls.dashboard.home))
    }

    // If path doesn't start with /auth and user is not authenticated, redirect to login
    if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(getAbsoluteUrl(siteUrls.auth.login))
    }

    // For admin paths, check if user has admin role
    if (user && isAdminPath) {
      // Get user profile from database to check role
      // For now, we'll allow access - you can add role checking here later
      // const { data: profile } = await supabase
      //   .from('users')
      //   .select('role')
      //   .eq('id', user.id)
      //   .single()

      // if (!profile || (profile.role !== 'Admin' && profile.role !== 'Super Admin')) {
      //   return NextResponse.redirect(getAbsoluteUrl(siteUrls.dashboard.home))
      // }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object here instead of the supabaseResponse object

  return supabaseResponse
}
