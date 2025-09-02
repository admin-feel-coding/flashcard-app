import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Set cookie options for longer session
        cookieOptions: {
          lifetime: 30 * 24 * 60 * 60, // 30 days in seconds
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        }
      }
    }
  )
}
