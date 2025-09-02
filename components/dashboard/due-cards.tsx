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
    <Card className="group border-0 shadow-xl bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-blue-50/70 dark:from-purple-900/20 dark:via-indigo-900/15 dark:to-blue-900/10 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-purple-200/30 dark:border-purple-700/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">⏰</span>
            </div>
            {dueCards.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                {dueCards.length > 9 ? '9+' : dueCards.length}
              </div>
            )}
          </div>
          Due for Review
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {dueCards.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl filter drop-shadow-sm">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">No cards due for review right now.</p>
            <div className="mt-4 p-3 bg-green-50/80 dark:bg-green-900/20 rounded-2xl backdrop-blur-sm border border-green-200/50 dark:border-green-700/30">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">Come back later or practice existing cards!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center relative">
              <div className="relative inline-block">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">{dueCards.length}</div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 blur-xl opacity-20 animate-pulse"></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {dueCards.length === 1 ? "card" : "cards"} due today
              </div>
            </div>

            <div className="relative overflow-hidden p-4 bg-gradient-to-r from-purple-100/80 via-blue-100/80 to-indigo-100/80 dark:from-purple-800/30 dark:via-blue-800/30 dark:to-indigo-800/30 rounded-2xl backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/30 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 opacity-50"></div>
              <div className="relative flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium text-center">
                  Across {uniqueDecks.length} {uniqueDecks.length === 1 ? "deck" : "decks"}
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            {uniqueDecks.length > 0 && (
              <div className="space-y-3">
                {uniqueDecks.slice(0, 2).map((deckId, index) => {
                  const deckCards = dueCards.filter((card) => card.cards.deck_id === deckId)
                  return (
                    <Link key={deckId} href={`/study/${deckId}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-between bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 border-2 border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400/70 dark:hover:border-purple-500/70 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm group/button"
                      >
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 group-hover/button:text-purple-800 dark:group-hover/button:text-purple-200 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Study Now
                        </span>
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-800/50 px-2 py-1 rounded-full">
                          {deckCards.length} cards
                        </span>
                      </Button>
                    </Link>
                  )
                })}
                {uniqueDecks.length > 2 && (
                  <div className="text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                      +{uniqueDecks.length - 2} more deck{uniqueDecks.length - 2 === 1 ? '' : 's'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
