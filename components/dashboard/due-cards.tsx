"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DueCard {
  id: string
  cards: {
    id: string
    front: string
    deck_id: string
  }
}

interface DueCardsProps {
  dueCards: DueCard[]
}

export function DueCards({ dueCards }: DueCardsProps) {
  const uniqueDecks = Array.from(new Set(dueCards.map((card) => card.cards.deck_id)))

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          ⏰ Due for Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dueCards.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">All caught up! No cards due for review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{dueCards.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {dueCards.length === 1 ? "card" : "cards"} due today
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Across {uniqueDecks.length} {uniqueDecks.length === 1 ? "deck" : "decks"}
                </span>
              </div>
            </div>

            {uniqueDecks.length > 0 && (
              <div className="space-y-2">
                {uniqueDecks.slice(0, 2).map((deckId) => {
                  const deckCards = dueCards.filter((card) => card.cards.deck_id === deckId)
                  return (
                    <Link key={deckId} href={`/study/${deckId}`}>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <span className="text-sm">Study Now</span>
                        <span className="text-xs text-gray-500">{deckCards.length} cards</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
