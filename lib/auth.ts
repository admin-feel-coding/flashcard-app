import { createClient } from "./supabase/client"
import { storage } from "./storage"

export interface LoginOptions {
  email: string
  password: string
  rememberMe: boolean
}

export interface SessionConfig {
  accessTokenLifetime: number
  refreshTokenLifetime: number
}

export const getSessionConfig = (rememberMe: boolean): SessionConfig => {
  if (rememberMe) {
    return {
      accessTokenLifetime: 60 * 60, // 1 hour
      refreshTokenLifetime: 30 * 24 * 60 * 60, // 30 days
    }
  }
  
  return {
    accessTokenLifetime: 60 * 60, // 1 hour
    refreshTokenLifetime: 7 * 24 * 60 * 60, // 7 days (default)
  }
}

export const loginWithRememberMe = async ({ email, password, rememberMe }: LoginOptions) => {
  const supabase = createClient()
  const config = getSessionConfig(rememberMe)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (error) throw error

    storage.setRememberMe(rememberMe)
    
    if (rememberMe && data.session) {
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (config.refreshTokenLifetime * 1000))
      storage.setSessionExpiry(expiryDate)
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const logout = async () => {
  const supabase = createClient()
  storage.clearRememberMeData()
  return await supabase.auth.signOut()
}

export const checkSessionValidity = (): boolean => {
  const rememberMe = storage.getRememberMe()
  if (!rememberMe) return true
  
  return storage.isSessionValid()
}

export const refreshSessionIfNeeded = async () => {
  const supabase = createClient()
  const rememberMe = storage.getRememberMe()
  
  if (!rememberMe) return
  
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      storage.clearRememberMeData()
      throw error
    }
    
    if (data.session) {
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000))
      storage.setSessionExpiry(expiryDate)
    }
    
    return data.session
  } catch (error) {
    console.error('Session refresh failed:', error)
    await logout()
    throw error
  }
}

export const isSecureContext = (): boolean => {
  return typeof window !== 'undefined' && 
         (window.location.protocol === 'https:' || 
          window.location.hostname === 'localhost')
}
