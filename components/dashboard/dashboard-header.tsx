"use client"

import { logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Globe, LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

const COMMON_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
]

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [nativeLanguage, setNativeLanguage] = useState('English')

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('flashmind-native-language')
    if (saved) {
      setNativeLanguage(saved)
    }
  }, [])

  // Save language preference
  const handleLanguageChange = (language: string) => {
    setNativeLanguage(language)
    localStorage.setItem('flashmind-native-language', language)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('nativeLanguageChange', { 
      detail: { language } 
    }))
  }

  const handleSignOut = async () => {
    await logout()
    router.push("/")
  }

  const getNativeLanguageFlag = () => {
    const lang = COMMON_LANGUAGES.find(l => l.name === nativeLanguage)
    return lang?.flag || '🌐'
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="flex sm:hidden flex-col gap-4 mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Top row: Logo and Actions */}
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">FlashMind</h1>
            </div>
          </a>

          <div className="flex items-center gap-2">
            {/* Mobile Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-lg"
                >
                  <span className="text-lg">{getNativeLanguageFlag()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 pb-2">
                  Native Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {COMMON_LANGUAGES.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.name)}
                      className={`flex items-center gap-2 cursor-pointer px-2 py-2 rounded-md text-sm ${
                        nativeLanguage === language.name
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{language.flag}</span>
                      <span className="flex-1">{language.name}</span>
                      {nativeLanguage === language.name && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Sign Out */}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Welcome message and Language info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            Welcome back, {user.email?.split("@")[0]}
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {nativeLanguage}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:flex items-center justify-between gap-4 mb-6 lg:mb-8 p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Left: Logo with redirect to root */}
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <a 
            href="/" 
            className="flex items-center gap-3 lg:gap-4 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">FlashMind</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">Welcome back, {user.email?.split("@")[0]}</p>
            </div>
          </a>
        </div>

        {/* Center: Native Language Selector */}
        <div className="flex items-center justify-center flex-1 max-w-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getNativeLanguageFlag()}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                      {nativeLanguage}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 leading-none mt-0.5">
                      Native Language
                    </div>
                  </div>
                  <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 p-2">
              <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 px-2 pb-2">
                <Globe className="w-4 h-4" />
                Choose Native Language
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {COMMON_LANGUAGES.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.name)}
                    className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                      nativeLanguage === language.name
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium flex-1">{language.name}</span>
                    {nativeLanguage === language.name && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Sign Out Button */}
        <div className="flex items-center min-w-0">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-4 py-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  )
}
