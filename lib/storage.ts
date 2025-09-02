const STORAGE_KEYS = {
  REMEMBER_ME: 'flashmind_remember_me',
  SESSION_EXPIRY: 'flashmind_session_expiry',
  SESSION_FINGERPRINT: 'flashmind_session_fp',
} as const

const generateSessionFingerprint = (): string => {
  if (typeof window === 'undefined') return ''
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('FlashMind Security', 2, 2)
  }
  
  return btoa([
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')).substring(0, 32)
}

const isValidFingerprint = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSION_FINGERPRINT)
  const current = generateSessionFingerprint()
  return stored === current
}

export const storage = {
  setRememberMe: (value: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(value))
      if (value) {
        localStorage.setItem(STORAGE_KEYS.SESSION_FINGERPRINT, generateSessionFingerprint())
      }
    }
  },

  getRememberMe: (): boolean => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
      if (!stored) return false
      
      const value = JSON.parse(stored)
      if (value && !isValidFingerprint()) {
        storage.clearRememberMeData()
        return false
      }
      
      return value
    }
    return false
  },

  setSessionExpiry: (expiryDate: Date) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryDate.toISOString())
    }
  },

  getSessionExpiry: (): Date | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
      return stored ? new Date(stored) : null
    }
    return null
  },

  clearRememberMeData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY)
      localStorage.removeItem(STORAGE_KEYS.SESSION_FINGERPRINT)
    }
  },

  isSessionValid: (): boolean => {
    const expiry = storage.getSessionExpiry()
    if (!expiry) return false
    return new Date() < expiry
  }
}