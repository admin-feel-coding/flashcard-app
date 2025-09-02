"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Mail, Sparkles } from "lucide-react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for auth errors from callback
  useEffect(() => {
    const authError = searchParams.get('error')
    if (authError) {
      switch (authError) {
        case 'auth_code_exchange_failed':
          setError('The magic link has expired or is invalid. Please request a new one.')
          break
        case 'auth_no_session':
          setError('Authentication failed. Please try again.')
          break
        case 'auth_callback_exception':
          setError('There was a technical issue with authentication. Please try again.')
          break
        case 'auth_no_code':
          setError('Invalid authentication link. Please request a new magic link.')
          break
        default:
          setError('There was an issue with authentication. Please try again.')
      }
    }
  }, [searchParams])

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Use Supabase's passwordless sign-in (magic link)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          shouldCreateUser: true, // Automatically create account if it doesn't exist
        },
      })
      
      if (error) throw error
      
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center px-4 py-8 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Main Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 p-6 sm:p-8 pb-4 sm:pb-6">
            {!isSuccess ? (
              <>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-gray-900 dark:text-white">
                  Access Your Flashcards
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2">
                  Enter your email address to get instant access
                </CardDescription>
              </>
            ) : (
              <>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-green-600 dark:text-green-400">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2">
                  We've sent a magic link to <strong className="text-gray-900 dark:text-white">{email}</strong>
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-2 sm:pt-4">
            {!isSuccess ? (
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending magic link...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get Instant Access
                    </div>
                  )}
                </Button>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>No password needed - we'll send you a secure link</span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">
                    Magic Link Sent! ✨
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                    Click the link in your email to access your dashboard. The link will expire in 1 hour.
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false)
                      setEmail("")
                    }}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm h-10"
                  >
                    Try a different email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
