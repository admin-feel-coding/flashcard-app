import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token = searchParams.get('token')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  // Get the correct base URL for redirects
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const baseUrl = forwardedHost && forwardedProto 
    ? `${forwardedProto}://${forwardedHost}` 
    : origin

  console.log('Auth callback - Code:', code ? 'present' : 'missing')
  console.log('Auth callback - Token:', token ? 'present' : 'missing')
  console.log('Auth callback - Token Hash:', tokenHash ? 'present' : 'missing')
  console.log('Auth callback - Type:', type)
  console.log('Auth callback - Origin:', origin)
  console.log('Auth callback - Base URL:', baseUrl)
  console.log('Auth callback - Next:', next)

  const supabase = await createClient()

  // Handle OAuth code exchange (for OAuth providers)
  if (code) {
    try {
      console.log('Attempting to exchange OAuth code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth code exchange error:', error)
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_code_exchange_failed`)
      }

      if (data.session) {
        console.log('OAuth session created successfully, redirecting to:', `${baseUrl}${next}`)
        return NextResponse.redirect(`${baseUrl}${next}`)
      } else {
        console.error('No session created after OAuth code exchange')
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_no_session`)
      }
    } catch (error) {
      console.error('OAuth callback exception:', error)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_callback_exception`)
    }
  }

  // Handle magic link verification (for email magic links)
  if (token || tokenHash) {
    try {
      console.log('Attempting to verify magic link token...')
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'magiclink',
        token_hash: tokenHash || token || '',
      })
      
      if (error) {
        console.error('Magic link verification error:', error)
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_code_exchange_failed`)
      }

      if (data.session) {
        console.log('Magic link session created successfully, redirecting to:', `${baseUrl}${next}`)
        return NextResponse.redirect(`${baseUrl}${next}`)
      } else {
        console.error('No session created after magic link verification')
        return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_no_session`)
      }
    } catch (error) {
      console.error('Magic link callback exception:', error)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_callback_exception`)
    }
  }

  // No authentication parameters provided
  console.error('No auth code or token provided in callback')
  return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_no_code`)
}
