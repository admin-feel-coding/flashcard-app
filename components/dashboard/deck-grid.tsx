"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
}

interface DeckGridProps {
  decks: Deck[]
}

export function DeckGrid({ decks }: DeckGridProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No flashcard decks yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first deck to start learning!</p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Tip: Start with a small deck of 10-20 cards for best results</p>
        </div>
      </div>
    )
  }

  return (
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
                <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: deck.color }} />
                <Badge variant="secondary" className="text-xs">
                  {cardCount} card{cardCount !== 1 ? "s" : ""}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {deck.title}
              </CardTitle>
              {deck.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{deck.description}</p>
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
  )
}
