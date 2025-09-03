"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
    <Card 
      className={`group bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden flex flex-col cursor-pointer ${
        isSelectionMode
          ? isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.01]'
          : 'border-gray-200 dark:border-gray-700 hover:scale-[1.01]'
      }`}
      style={{ minHeight: '280px' }}
      onClick={handleCardClick}
    >
      <CardHeader className="p-4 flex-1">
        {/* Title Row */}
        <div className="flex items-center gap-2 mb-4">
          {isSelectionMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelectionChange}
              className="w-4 h-4 shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {deck.title}
          </h3>
        </div>

        {/* Description */}
        {deck.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {deck.description}
          </p>
        )}

        {/* Tags */}
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {deck.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {deck.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                +{deck.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1"></div>

        {/* Footer: Date and Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <span>Created {new Date(deck.created_at).toLocaleDateString()}</span>
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: deck.color }} />
            <span>{cardCount} cards</span>
          </div>
        </div>
      </CardHeader>
      {!isSelectionMode && (
        <CardContent className="p-4 pt-0">
          <div className="flex gap-2">
            {cardCount > 0 ? (
              <>
                <Link href={`/study/${deck.id}`} className="flex-1">
                  <Button className="w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Study Now
                  </Button>
                </Link>
                <Link href={`/deck/${deck.id}`}>
                  <Button variant="outline" className="h-10 w-10">
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href={`/deck/${deck.id}`} className="flex-1">
                <Button className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Cards
                </Button>
              </Link>
            )}
          </div>
          {cardCount === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Create your first flashcards to start learning
            </p>
          )}
        </CardContent>
      )}
      
      {isSelectionMode && (
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <div className="text-center py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isSelected ? 'Selected for deletion' : 'Click to select'}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
