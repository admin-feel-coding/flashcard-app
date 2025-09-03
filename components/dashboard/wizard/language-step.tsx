"use client"

import React, { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { MessageCircle, Search, CheckCircle, Globe } from "lucide-react"
import { ALL_LANGUAGES, NATIVE_LANGUAGES } from "./constants"

interface LanguageStepProps {
  step: number
  nativeLanguage: string
  nativeLanguageSearch: string
  setNativeLanguageSearch: (search: string) => void
  targetLanguage: string
  targetLanguageSearch: string
  setTargetLanguageSearch: (search: string) => void
  selectLanguage: (language: string, isTarget: boolean) => void
}

export function LanguageStep({
  step,
  nativeLanguage,
  nativeLanguageSearch,
  setNativeLanguageSearch,
  targetLanguage,
  targetLanguageSearch,
  setTargetLanguageSearch,
  selectLanguage
}: LanguageStepProps) {
  // Filter languages based on search
  const filteredTargetLanguages = useMemo(() => {
    if (!targetLanguageSearch.trim()) {
      const popularLanguages = ALL_LANGUAGES.filter(lang => lang.popular)
      const selectedLang = ALL_LANGUAGES.find(lang => lang.name === targetLanguage)

      if (selectedLang && !selectedLang.popular) {
        const uniqueLanguages = new Map()
        popularLanguages.forEach(lang => uniqueLanguages.set(lang.name, lang))
        uniqueLanguages.set(selectedLang.name, selectedLang)
        return Array.from(uniqueLanguages.values())
      }
      return popularLanguages
    }

    const searchResults = ALL_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(targetLanguageSearch.toLowerCase())
    )

    const uniqueResults = new Map()
    searchResults.forEach(lang => {
      const existing = uniqueResults.get(lang.name)
      if (!existing || (!existing.popular && lang.popular)) {
        uniqueResults.set(lang.name, lang)
      }
    })

    return Array.from(uniqueResults.values())
  }, [targetLanguageSearch, targetLanguage])

  const filteredNativeLanguages = useMemo(() => {
    if (!nativeLanguageSearch.trim()) {
      const popularLanguages = NATIVE_LANGUAGES.filter(lang => lang.popular)
      const selectedLang = NATIVE_LANGUAGES.find(lang => lang.name === nativeLanguage)

      if (selectedLang && !selectedLang.popular) {
        const uniqueLanguages = new Map()
        popularLanguages.forEach(lang => uniqueLanguages.set(lang.name, lang))
        uniqueLanguages.set(selectedLang.name, selectedLang)
        return Array.from(uniqueLanguages.values())
      }
      return popularLanguages
    }

    const searchResults = NATIVE_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(nativeLanguageSearch.toLowerCase())
    )

    const uniqueResults = new Map()
    searchResults.forEach(lang => {
      const existing = uniqueResults.get(lang.name)
      if (!existing || (!existing.popular && lang.popular)) {
        uniqueResults.set(lang.name, lang)
      }
    })

    return Array.from(uniqueResults.values())
  }, [nativeLanguageSearch, nativeLanguage])

  if (step === 1) {
    return (
      <div className="text-center space-y-3">
        <div>
          <MessageCircle className="w-10 h-10 mx-auto mb-3 text-purple-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            What's your native language?
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 px-4">
            This helps us provide better explanations and translations
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xs mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search languages..."
              value={nativeLanguageSearch}
              onChange={(e) => setNativeLanguageSearch(e.target.value)}
              className="pl-10 h-10 rounded-lg border-2 border-gray-200 focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Popular Languages */}
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
          {filteredNativeLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.name, false)}
              className={`p-2.5 rounded-lg border-2 transition-all duration-200 text-center ${
                nativeLanguage === lang.name
                  ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="font-semibold text-xs">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="text-center space-y-3">
        <div>
          <Globe className="w-10 h-10 mx-auto mb-3 text-purple-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            What language do you want to learn?
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 px-4">
            Choose your target language or search for more options
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xs mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search languages..."
              value={targetLanguageSearch}
              onChange={(e) => setTargetLanguageSearch(e.target.value)}
              className="pl-10 h-10 rounded-lg border-2 border-gray-200 focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Popular Languages */}
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
          {filteredTargetLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.name, true)}
              className={`p-2.5 rounded-lg border-2 transition-all duration-200 text-center ${
                targetLanguage === lang.name
                  ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="font-semibold text-xs">{lang.name}</div>
            </button>
          ))}
        </div>

        {/* Custom selection results */}
        {targetLanguageSearch && filteredTargetLanguages.length > 0 && (
          <div className="max-w-sm mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg max-h-48 overflow-y-auto">
              {filteredTargetLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.name, true)}
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                    targetLanguage === lang.name
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-l-purple-500'
                      : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {targetLanguage === lang.name && (
                    <CheckCircle className="w-4 h-4 text-purple-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}