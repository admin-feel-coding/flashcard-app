"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Edit3, Trash2, MoreVertical, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditDeckDialog } from "./edit-deck-dialog"
import { DeleteDeckDialog } from "./delete-deck-dialog"

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

interface DeckGridProps {
  decks: Deck[]
}

export function DeckGrid({ decks }: DeckGridProps) {
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null)
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null)
  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to start learning?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first deck to begin your learning journey!</p>
        
        {/* AI Language Learning Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 mx-auto max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">AI Language Learning</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Generate personalized flashcards for any language with pronunciation guides, grammar notes, and cultural context.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <p>🗣️ Pronunciation guides included</p>
            <p>📚 Grammar explanations & examples</p>
            <p>🌍 Cultural context & practical usage</p>
            <p>🎯 CEFR levels (A1-C2) supported</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Tip: Start with A1-A2 level for beginners, B1-B2 for intermediate learners</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => {
          const cardCount = deck.cards?.[0]?.count || 0

          return (
            <Card
              key={deck.id}
              className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-[1.02]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: deck.color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {cardCount} card{cardCount !== 1 ? "s" : ""}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => setEditingDeck(deck)}
                          className="cursor-pointer"
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Deck
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingDeck({ ...deck, card_count: cardCount })}
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deck
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {deck.title}
                </CardTitle>
                {deck.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{deck.description}</p>
                )}
                {deck.tags && deck.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {deck.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {deck.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                      >
                        +{deck.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Link href={`/deck/${deck.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                  {cardCount > 0 && (
                    <Link href={`/study/${deck.id}`}>
                      <Button variant="outline" className="border-gray-300 dark:border-gray-600 bg-transparent">
                        <Play className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
                {cardCount === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Add cards to start studying</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      {editingDeck && (
        <EditDeckDialog
          deck={editingDeck}
          open={!!editingDeck}
          onOpenChange={(open) => !open && setEditingDeck(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingDeck && (
        <DeleteDeckDialog
          deck={deletingDeck}
          open={!!deletingDeck}
          onOpenChange={(open) => !open && setDeletingDeck(null)}
        />
      )}
    </>
  )
}
