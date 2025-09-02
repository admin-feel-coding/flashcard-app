"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  BookOpen,
  MessageCircle,
  CheckCircle,
  Search,
  X
} from "lucide-react"

const ALL_LANGUAGES = [
  // Popular first 6
  { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', flag: '🇮🇹', popular: true },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', popular: true },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: true },

  // Other languages
  { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: false },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', popular: false },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: false },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: false },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: false },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', popular: false },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', popular: false },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', popular: false },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', popular: false },
  { code: 'da', name: 'Danish', flag: '🇩🇰', popular: false },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', popular: false },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', popular: false },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', popular: false },
  { code: 'th', name: 'Thai', flag: '🇹🇭', popular: false },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', popular: false },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', popular: false },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', popular: false },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', popular: false },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', popular: false },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', popular: false },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', popular: false },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', popular: false },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', popular: false },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', popular: false },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', popular: false },
  { code: 'el', name: 'Greek', flag: '🇬🇷', popular: false },
]

const NATIVE_LANGUAGES = [
  // Popular first 6
  { code: 'en', name: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', flag: '🇮🇹', popular: true },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', popular: true },

  // Other languages
  { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: false },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', popular: false },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: false },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: false },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: false },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: false },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', popular: false },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', popular: false },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', popular: false },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', popular: false },
  { code: 'da', name: 'Danish', flag: '🇩🇰', popular: false },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', popular: false },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', popular: false },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', popular: false },
  { code: 'th', name: 'Thai', flag: '🇹🇭', popular: false },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', popular: false },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', popular: false },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', popular: false },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', popular: false },
  { code: 'el', name: 'Greek', flag: '🇬🇷', popular: false },
]

const PROFICIENCY_LEVELS = [
  {
    value: 'A1',
    label: 'A1 - Beginner',
    description: 'I know basic words and phrases',
    color: 'from-green-500 to-emerald-500',
  },
  {
    value: 'A2',
    label: 'A2 - Elementary',
    description: 'I can have simple conversations',
    color: 'from-lime-500 to-green-500',
  },
  {
    value: 'B1',
    label: 'B1 - Intermediate',
    description: 'I can express opinions and handle travel',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    value: 'B2',
    label: 'B2 - Upper-Intermediate',
    description: 'I understand complex texts',
    color: 'from-orange-500 to-red-500',
  },
  {
    value: 'C1',
    label: 'C1 - Advanced',
    description: 'I use the language flexibly',
    color: 'from-red-500 to-pink-500',
  },
  {
    value: 'C2',
    label: 'C2 - Proficient',
    description: 'I have near-native fluency',
    color: 'from-purple-500 to-indigo-500',
  },
]


export function AILanguageGenerator() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Form state
  const [targetLanguage, setTargetLanguage] = useState("")
  const [targetLanguageSearch, setTargetLanguageSearch] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState("English")
  const [nativeLanguageSearch, setNativeLanguageSearch] = useState("")
  const [proficiencyLevel, setProficiencyLevel] = useState("")
  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [customFocus, setCustomFocus] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const router = useRouter()

  // Filter languages based on search
  const filteredTargetLanguages = useMemo(() => {
    if (!targetLanguageSearch.trim()) {
      return ALL_LANGUAGES.filter(lang => lang.popular)
    }
    return ALL_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(targetLanguageSearch.toLowerCase())
    )
  }, [targetLanguageSearch])

  const filteredNativeLanguages = useMemo(() => {
    if (!nativeLanguageSearch.trim()) {
      return NATIVE_LANGUAGES.filter(lang => lang.popular)
    }
    return NATIVE_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(nativeLanguageSearch.toLowerCase())
    )
  }, [nativeLanguageSearch])

  const resetForm = () => {
    setStep(1)
    setTargetLanguage("")
    setTargetLanguageSearch("")
    setNativeLanguage("English")
    setNativeLanguageSearch("")
    setProficiencyLevel("")
    setDeckTitle("")
    setDeckDescription("")
    setCustomFocus("")
    setSelectedCategory("")
    setProgress(0)
    setIsGenerating(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceedFromStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return nativeLanguage !== ""
      case 2:
        return targetLanguage !== ""
      case 3:
        return proficiencyLevel !== ""
      case 4:
        return deckDescription.trim() !== "" || customFocus.trim() !== ""
      default:
        return true
    }
  }



  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)

    try {
      const response = await fetch('/api/ai/generate-language-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
          nativeLanguage,
          proficiencyLevel,
          deckTitle: deckTitle || `${targetLanguage} Learning Deck`,
          deckDescription: deckDescription || `Personalized ${targetLanguage} flashcards for ${proficiencyLevel} level`,
          customFocus: customFocus || ""
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate deck')
      }

      setTimeout(() => {
        setOpen(false)
        resetForm()
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Generation error:', error)
    }
  }

  const selectLanguage = (language: string, isTarget: boolean) => {
    if (isTarget) {
      setTargetLanguage(language)
      setTargetLanguageSearch("")
    } else {
      setNativeLanguage(language)
      setNativeLanguageSearch("")
    }
  }

  // Helper function to get language flag
  const getLanguageFlag = (languageName: string) => {
    const allLanguages = [...ALL_LANGUAGES, ...NATIVE_LANGUAGES]
    const language = allLanguages.find(lang => lang.name === languageName)
    return language?.flag || '🌐'
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Create with AI
          </Button>
        </DialogTrigger>

      <DialogContent className="!fixed !inset-0 !w-screen !h-screen !max-w-none !m-0 !p-0 !border-0 !rounded-none !top-0 !left-0 !transform-none !translate-x-0 !translate-y-0 flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">

        {/* Accessibility title - visually hidden */}
        <DialogTitle className="sr-only">AI Language Learning Generator Wizard</DialogTitle>

        {/* Close button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto min-h-0 pt-16 sm:pt-4">

          {/* Step 1: Native Language */}
          {step === 1 && !isGenerating && (
            <div className="text-center space-y-4">
              <div>
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  What's your native language?
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This helps us provide better explanations and translations
                </p>
              </div>

              {/* Popular Languages */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {filteredNativeLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.name, false)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
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

              {/* Search Input */}
              <div className="max-w-sm mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for other languages..."
                    value={nativeLanguageSearch}
                    onChange={(e) => setNativeLanguageSearch(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Custom selection results */}
              {nativeLanguageSearch && filteredNativeLanguages.length > 0 && (
                <div className="max-w-sm mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg max-h-48 overflow-y-auto">
                    {filteredNativeLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.name, false)}
                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Target Language */}
          {step === 2 && !isGenerating && (
            <div className="text-center space-y-4">
              <div>
                <Globe className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  What language do you want to learn?
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose your target language or search for more options
                </p>
              </div>

              {/* Popular Languages */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {filteredTargetLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.name, true)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
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

              {/* Search Input */}
              <div className="max-w-sm mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for other languages..."
                    value={targetLanguageSearch}
                    onChange={(e) => setTargetLanguageSearch(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Custom selection results */}
              {targetLanguageSearch && filteredTargetLanguages.length > 0 && (
                <div className="max-w-sm mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg max-h-48 overflow-y-auto">
                    {filteredTargetLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.name, true)}
                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Proficiency Level */}
          {step === 3 && !isGenerating && (
            <div className="text-center space-y-4">
              <div>
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  What's your current level?
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Be honest - this helps us create better content
                </p>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                {PROFICIENCY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setProficiencyLevel(level.value)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                      proficiencyLevel === level.value
                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${level.color} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{level.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{level.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Focus */}
          {step === 4 && !isGenerating && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl">{getLanguageFlag(nativeLanguage)}</span>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                  <span className="text-4xl">{getLanguageFlag(targetLanguage)}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What's your {targetLanguage} goal?
                </h1>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setDeckDescription(`Essential ${targetLanguage} for travelers! Master hotel bookings, restaurant orders, directions, emergency phrases, cultural etiquette, and tourist interactions.`)
                      setDeckTitle(`${targetLanguage} Travel`)
                      setSelectedCategory("travel")
                      setCustomFocus("")
                    }}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedCategory === "travel"
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✈️</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Travel & Adventure</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Essential phrases for travelers</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDeckDescription(`Professional ${targetLanguage} for workplace excellence. Master business meetings, email communication, presentations, networking, and formal correspondence.`)
                      setDeckTitle(`${targetLanguage} Business`)
                      setSelectedCategory("business")
                      setCustomFocus("")
                    }}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedCategory === "business"
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💼</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Professional Success</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Advance your career</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDeckDescription(`Perfect ${targetLanguage} for social interactions! Master casual conversations, making friends, dating, family discussions, and building relationships.`)
                      setDeckTitle(`${targetLanguage} Social`)
                      setSelectedCategory("social")
                      setCustomFocus("")
                    }}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedCategory === "social"
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Social Connections</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Build meaningful relationships</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDeckDescription(`Academic ${targetLanguage} for serious learners. Master university vocabulary, research terminology, presentation skills, and academic writing.`)
                      setDeckTitle(`${targetLanguage} Academic`)
                      setSelectedCategory("academic")
                      setCustomFocus("")
                    }}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedCategory === "academic"
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Academic Excellence</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Excel in your studies</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-center font-medium text-gray-900 dark:text-white">
                    ✨ Or describe your specific needs
                  </h3>
                  <Textarea
                    placeholder={`Example: "I'm a chef and want to learn culinary terms in ${targetLanguage}"`}
                    value={customFocus}
                    onChange={(e) => {
                      setCustomFocus(e.target.value)
                      if (e.target.value.trim()) {
                        setDeckDescription(`Custom ${targetLanguage} learning focus: ${e.target.value}. Personalized content tailored to your specific needs.`)
                        setDeckTitle(`Custom ${targetLanguage} Learning`)
                        setSelectedCategory("custom")
                      } else {
                        setDeckDescription("")
                        setDeckTitle("")
                        setSelectedCategory("")
                      }
                    }}
                    className="w-full h-20 p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 resize-none bg-white dark:bg-gray-800"
                  />
                </div>

                {(deckDescription || customFocus) && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">Ready to create your deck!</span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {customFocus || deckDescription.split('.')[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Creating your personalized deck...
                </h1>
                <Progress value={progress} className="h-3 mb-4 max-w-sm mx-auto" />
                <p className="text-gray-600 dark:text-gray-300">
                  This may take a moment while we craft the perfect content for you
                </p>
              </div>
              {progress === 100 && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Deck created successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isGenerating && (
          <div className="p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <div className="flex items-center justify-between max-w-xs sm:max-w-sm mx-auto">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2 h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-white/80 hover:bg-white text-xs sm:text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {/* Progress indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Progress value={(step / 4) * 100} className="w-12 sm:w-16 h-1" />
                <span className="text-xs text-gray-500 font-medium">{step}/4</span>
              </div>

              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedFromStep(step)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={!canProceedFromStep(step)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Create
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
      </Dialog>
    </>
  )
}
