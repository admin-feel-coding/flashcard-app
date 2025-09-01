"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
}

interface DeckHeaderProps {
  deck: Deck
  cardCount: number
}

export function DeckHeader({ deck, cardCount }: DeckHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: deck.color }} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{deck.title}</h1>
              {deck.description && <p className="text-gray-600 dark:text-gray-300 mb-4">{deck.description}</p>}
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {cardCount} card{cardCount !== 1 ? "s" : ""}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(deck.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {cardCount > 0 && (
            <Link href={`/study/${deck.id}`}>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Start Studying
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
