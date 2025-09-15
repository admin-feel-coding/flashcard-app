"use client"

import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Play } from "lucide-react"

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

interface DeckCardProps {
  deck: Deck
  onEdit: (deck: Deck) => void
  onDelete: (deck: Deck & { card_count: number }) => void
  isSelectionMode?: boolean
  isSelected?: boolean
  onSelectionChange?: (deckId: string, selected: boolean) => void
}

export function DeckCard({
  deck,
  onEdit,
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onSelectionChange
}: DeckCardProps) {
  const cardCount = deck.cards?.[0]?.count || 0

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange?.(deck.id, checked)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode && e.target === e.currentTarget) {
      handleSelectionChange(!isSelected)
    }
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ${
        isSelectionMode
          ? isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'hover:border-blue-300 dark:hover:border-blue-600'
          : 'hover:shadow-md active:scale-[0.99]'
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelectionChange}
            className="mt-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: deck.color }}>
              {deck.title.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
              {deck.title}
            </h3>
          </div>
          {deck.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
              {deck.description}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {deck.tags && deck.tags.length > 0 && (
        <div className="flex gap-1 mb-4 overflow-hidden">
          {deck.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md truncate max-w-16">
              {tag}
            </span>
          ))}
          {deck.tags.length > 2 && (
            <span className="text-xs text-gray-500 px-1">+{deck.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span>{cardCount} cards</span>
        <span>{new Date(deck.created_at).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      {!isSelectionMode && (
        <div className="space-y-2">
          {cardCount > 0 ? (
            <div className="flex gap-2">
              <Link href={`/study/${deck.id}`} className="flex-1">
                <button className="w-full h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Study
                </button>
              </Link>
              <Link href={`/deck/${deck.id}`}>
                <button className="h-9 w-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <Link href={`/deck/${deck.id}`} className="block">
              <button className="w-full h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                Add Cards
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Selection Mode */}
      {isSelectionMode && (
        <div className="text-center py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isSelected ? 'Selected' : 'Tap to select'}
          </p>
        </div>
      )}
    </div>
  )
}
