"use client"

import { useState, useMemo } from "react"
import { DeckGrid } from "./deck-grid"
import { CreateDeckDialog } from "./create-deck-dialog"
import { TagsFilter } from "./tags-filter"
import { AILanguageGenerator } from "./ai-language-generator"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  cards: { count: number }[]
  card_count?: number
  tags?: string[] | null
}

interface DeckManagementProps {
  decks: Deck[]
}

export function DeckManagement({ decks }: DeckManagementProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter decks based on selected tags
  const filteredDecks = useMemo(() => {
    if (selectedTags.length === 0) {
      return decks
    }

    return decks.filter(deck => {
      if (!deck.tags || deck.tags.length === 0) {
        return false
      }
      
      // Check if deck has ANY of the selected tags (OR logic)
      // Change to selectedTags.every() for AND logic if preferred
      return selectedTags.some(tag => deck.tags!.includes(tag))
    })
  }, [decks, selectedTags])

  // Check if any decks have tags to show the filter
  const hasAnyTags = decks.some(deck => deck.tags && deck.tags.length > 0)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Flashcard Decks</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {selectedTags.length > 0 
              ? `${filteredDecks.length} of ${decks.length} deck${decks.length === 1 ? "" : "s"} matching filters`
              : decks.length 
                ? `${decks.length} deck${decks.length === 1 ? "" : "s"}` 
                : "No decks yet"
            }
          </p>
        </div>
        <div className="flex gap-3">
          <AILanguageGenerator />
          <CreateDeckDialog />
        </div>
      </div>

      {/* Tags Filter - only show if there are tags */}
      {hasAnyTags && (
        <div className="mb-6">
          <TagsFilter
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            className="flex items-center gap-2"
          />
        </div>
      )}

      {/* Show message when no decks match the filter */}
      {selectedTags.length > 0 && filteredDecks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No decks match your filter</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try removing some tags or create a new deck with the selected tags.
          </p>
          <button
            onClick={() => setSelectedTags([])}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <DeckGrid decks={filteredDecks} />
      )}
    </div>
  )
}
