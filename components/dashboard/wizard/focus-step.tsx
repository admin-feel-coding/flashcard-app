"use client"

import React, { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, CheckCircle, Search } from "lucide-react"
import { LEARNING_FOCUS_OPTIONS, getLanguageFlag } from "./constants"

interface FocusStepProps {
  nativeLanguage: string
  targetLanguage: string
  proficiencyLevel: string
  selectedCategory: string
  focusSearch: string
  setFocusSearch: (search: string) => void
  customFocus: string
  setCustomFocus: (focus: string) => void
  deckDescription: string
  selectFocus: (focusOption: any) => void
  setDeckDescription: (description: string) => void
  setDeckTitle: (title: string) => void
  setSelectedCategory: (category: string) => void
}

export function FocusStep({
  nativeLanguage,
  targetLanguage,
  proficiencyLevel,
  selectedCategory,
  focusSearch,
  setFocusSearch,
  customFocus,
  setCustomFocus,
  deckDescription,
  selectFocus,
  setDeckDescription,
  setDeckTitle,
  setSelectedCategory
}: FocusStepProps) {
  const filteredFocusOptions = useMemo(() => {
    if (!focusSearch.trim()) {
      const popularOptions = LEARNING_FOCUS_OPTIONS.filter(option => option.popular)
      const selectedOption = LEARNING_FOCUS_OPTIONS.find(option => option.id === selectedCategory)

      if (selectedOption && !selectedOption.popular) {
        const uniqueOptions = new Map()
        popularOptions.forEach(option => uniqueOptions.set(option.id, option))
        uniqueOptions.set(selectedOption.id, selectedOption)
        return Array.from(uniqueOptions.values())
      }
      return popularOptions
    }

    return LEARNING_FOCUS_OPTIONS.filter(option =>
      option.name.toLowerCase().includes(focusSearch.toLowerCase()) ||
      option.description.toLowerCase().includes(focusSearch.toLowerCase())
    )
  }, [focusSearch, selectedCategory])

  return (
    <div className="max-w-lg mx-auto space-y-6 px-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{getLanguageFlag(nativeLanguage)}</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <span className="text-3xl">{getLanguageFlag(targetLanguage)}</span>
        </div>
        <div className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
          {proficiencyLevel} Level
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Choose your learning focus
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          We'll create simple, effective cards that target what's genuinely hard to remember
        </p>
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="max-w-xs mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search focus areas..."
              value={focusSearch}
              onChange={(e) => setFocusSearch(e.target.value)}
              className="pl-10 h-10 rounded-lg border-2 border-gray-200 focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Popular Focus Options */}
        <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
          {filteredFocusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                if (selectedCategory === option.id) {
                  // Unselect if already selected
                  setSelectedCategory("")
                  setDeckTitle("")
                  setDeckDescription("")
                } else {
                  // Select new option
                  selectFocus(option)
                  setCustomFocus("")
                }
              }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedCategory === option.id
                  ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{option.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{option.description}</p>
                </div>
                {selectedCategory === option.id && (
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Extended search results */}
        {focusSearch && filteredFocusOptions.length > 4 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg max-h-48 overflow-y-auto">
              {filteredFocusOptions.slice(4).map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                if (selectedCategory === option.id) {
                  // Unselect if already selected
                  setSelectedCategory("")
                  setDeckTitle("")
                  setDeckDescription("")
                } else {
                  // Select new option
                  selectFocus(option)
                  setCustomFocus("")
                }
              }}
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                    selectedCategory === option.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-l-purple-500'
                      : ''
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{option.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{option.name}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">{option.description}</p>
                  </div>
                  {selectedCategory === option.id && (
                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white text-center">
          Or tell us what you want to learn
        </h3>
        <Textarea
          placeholder={`Example: "German cases - I always confuse accusative/dative" or "Spanish ser vs estar - the tricky situations"`}
          value={customFocus}
          onChange={(e) => {
            setCustomFocus(e.target.value)
            if (e.target.value.trim()) {
              setDeckDescription(`Custom ${targetLanguage} Anki cards targeting: ${e.target.value}. Focus on specific memory challenges and difficult concepts.`)
              setDeckTitle(`${targetLanguage} Memory Challenges`)
              setSelectedCategory("custom")
            } else {
              setDeckDescription("")
              setDeckTitle("")
              setSelectedCategory("")
            }
          }}
          disabled={selectedCategory !== "" && selectedCategory !== "custom"}
          className={`w-full h-24 p-3 rounded-lg border resize-none text-sm transition-colors ${
            selectedCategory !== "" && selectedCategory !== "custom"
              ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800"
          }`}
        />
      </div>
    </div>
  )
}
