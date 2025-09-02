"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Edit3, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      className={`group bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full cursor-pointer ${
        isSelectionMode
          ? isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.01]'
          : 'border-gray-200 dark:border-gray-700 hover:scale-[1.01]'
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 flex-1">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {isSelectionMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleSelectionChange}
                className="w-5 h-5"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: deck.color }} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {cardCount} card{cardCount !== 1 ? "s" : ""}
            </Badge>
            {!isSelectionMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onEdit(deck)}
                    className="cursor-pointer"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Deck
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete({ ...deck, card_count: cardCount })}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Deck
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 sm:mb-3">
          {deck.title}
        </CardTitle>
        <div className="flex-1 space-y-3 sm:space-y-4">
          {deck.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{deck.description}</p>
          )}
          {deck.tags && deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {deck.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                >
                  {tag}
                </Badge>
              ))}
              {deck.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                >
                  +{deck.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      {!isSelectionMode && (
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <div className="flex gap-2 sm:gap-3">
            {cardCount > 0 ? (
              <>
                <Link href={`/study/${deck.id}`} className="flex-1">
                  <Button className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                    <Play className="w-4 h-4 mr-1 sm:mr-2" />
                    Study Now
                  </Button>
                </Link>
                <Link href={`/deck/${deck.id}`}>
                  <Button variant="outline" className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/deck/${deck.id}`} className="flex-1">
                  <Button className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                    <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                    Add Cards
                  </Button>
                </Link>
              </>
            )}
          </div>
          {cardCount === 0 && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 text-center">
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
