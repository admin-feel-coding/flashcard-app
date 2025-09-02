"use client"

import { createClient } from "@/lib/supabase/client"
import { checkSessionValidity, logout } from "@/lib/auth"
import { storage } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const rememberMe = storage.getRememberMe()
          
          if (rememberMe && !checkSessionValidity()) {
            await logout()
            setUser(null)
            router.push("/auth/login")
          } else {
            setUser(session.user)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          storage.clearRememberMeData()
        } else if (event === 'TOKEN_REFRESHED') {
          const rememberMe = storage.getRememberMe()
          if (rememberMe && session) {
            const expiryDate = new Date()
            expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
            storage.setSessionExpiry(expiryDate)
          }
          setUser(session?.user ?? null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}