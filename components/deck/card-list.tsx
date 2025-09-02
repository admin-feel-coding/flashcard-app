"use client"

import { Card, CardContent } from "@/components/ui/card"
import { EditCardDialog } from "./edit-card-dialog"
import { DeleteCardDialog } from "./delete-card-dialog"

interface FlashCard {
  id: string
  front: string
  back: string
  created_at: string
}

interface CardListProps {
  cards: FlashCard[]
  deckId: string
}

export function CardList({ cards, deckId }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No flashcards yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Add your first flashcard to start learning!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Front</h4>
                <p className="text-gray-900 dark:text-white">{card.front}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Back</h4>
                <div 
                  className="text-gray-900 dark:text-white text-sm"
                  dangerouslySetInnerHTML={{ __html: card.back }} 
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Created {new Date(card.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <EditCardDialog card={card} deckId={deckId} />
                <DeleteCardDialog card={card} deckId={deckId} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
