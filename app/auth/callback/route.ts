import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Get the correct base URL for redirects
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const baseUrl = forwardedHost && forwardedProto 
    ? `${forwardedProto}://${forwardedHost}` 
    : origin

  console.log('Auth callback - Code:', code ? 'present' : 'missing')
  console.log('Auth callback - Origin:', origin)
  console.log('Auth callback - Base URL:', baseUrl)
  console.log('Auth callback - Next:', next)

  if (code) {
    const supabase = await createClient()
    
    try {
      console.log('Attempting to exchange code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Code exchange error:', error)
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_code_exchange_failed`)
      }

      if (data.session) {
        console.log('Session created successfully, redirecting to:', `${baseUrl}${next}`)
        return NextResponse.redirect(`${baseUrl}${next}`)
      } else {
        console.error('No session created after code exchange')
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_no_session`)
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_callback_exception`)
    }
  }

  // No code provided
  console.error('No auth code provided in callback')
  return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_no_code`)
}
