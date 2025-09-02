"use client"

import { useState, useMemo } from "react"
import { DeckGrid } from "./deck-grid"
import { CreateDeckDialog } from "./create-deck-dialog"
import { TagsFilter } from "./tags-filter"
import { AILanguageGenerator } from "./ai-language-generator"
import { BulkActionToolbar } from "./bulk-action-toolbar"
import { BulkDeleteDialog } from "./bulk-delete-dialog"
import { BaseCard } from "@/components/ui/base-card"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"

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
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedDeckIds, setSelectedDeckIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

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

  // Get selected decks
  const selectedDecks = filteredDecks.filter(deck => selectedDeckIds.has(deck.id))

  // Bulk selection handlers
  const handleSelectionChange = (deckId: string, selected: boolean) => {
    setSelectedDeckIds(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(deckId)
      } else {
        newSet.delete(deckId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    setSelectedDeckIds(new Set(filteredDecks.map(deck => deck.id)))
  }

  const handleDeselectAll = () => {
    setSelectedDeckIds(new Set())
  }

  const handleCancelSelection = () => {
    setIsSelectionMode(false)
    setSelectedDeckIds(new Set())
  }

  const handleDeleteSelected = () => {
    setBulkDeleteDialogOpen(true)
  }

  const handleBulkDeleteSuccess = () => {
    setSelectedDeckIds(new Set())
    setIsSelectionMode(false)
  }

  return (
    <BaseCard variant="minimal" className="hover:shadow-xl transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent break-words">
              Your Flashcard Decks
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pl-11">
            {selectedTags.length > 0
              ? `${filteredDecks.length} of ${decks.length} deck${decks.length === 1 ? "" : "s"} matching filters`
              : decks.length
                ? `${decks.length} deck${decks.length === 1 ? "" : "s"}`
                : "No decks yet"
            }
          </p>
        </div>

        {/* Action Buttons - Only show when there are decks */}
        {decks.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <AILanguageGenerator />
            <CreateDeckDialog />
            {!isSelectionMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSelectionMode(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-xs sm:text-sm"
              >
                <CheckSquare className="w-3 h-3 mr-1" />
                Select
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 dark:from-blue-900/10 dark:to-indigo-900/5 rounded-xl opacity-50"></div>
        <div className="relative">
          {/* Show appropriate empty state message */}
          {filteredDecks.length === 0 ? (
            <div className="text-center py-16">
              {decks.length === 0 ? (
                // No decks at all - show welcome message
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100/80 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/30 border-2 border-dashed border-blue-300/50 dark:border-blue-700/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm backdrop-blur-sm">
                    <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Welcome to FlashMind!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    Create your first flashcard deck to start learning. Use AI to generate cards instantly or build them manually.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <AILanguageGenerator />
                    <CreateDeckDialog />
                  </div>
                </>
              ) : (
                // Decks exist but filtered out
                <>
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:from-gray-800/80 dark:to-blue-900/40 border border-gray-200/50 dark:border-gray-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm backdrop-blur-sm">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No decks match your filter</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Try removing some tags or create a new deck with the selected tags.
                  </p>
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <DeckGrid 
                decks={filteredDecks} 
                isSelectionMode={isSelectionMode}
                selectedDeckIds={selectedDeckIds}
                onSelectionChange={handleSelectionChange}
              />
              
              {/* Bulk Action Toolbar - Moved to bottom for better UX */}
              {isSelectionMode && (
                <div className="mt-6">
                  <BulkActionToolbar
                    selectedCount={selectedDeckIds.size}
                    totalCount={filteredDecks.length}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onDeleteSelected={handleDeleteSelected}
                    onCancel={handleCancelSelection}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Delete Dialog */}
      {bulkDeleteDialogOpen && selectedDecks.length > 0 && (
        <BulkDeleteDialog
          selectedDecks={selectedDecks}
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
    </BaseCard>
  )
}
