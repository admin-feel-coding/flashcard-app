"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"

interface Deck {
  id: string
  title: string
  color: string
}

interface StudyProgressProps {
  deck: Deck
  currentCard: number
  totalCards: number
  onExit: () => void
}

export function StudyProgress({ deck, currentCard, totalCards, onExit }: StudyProgressProps) {
  const progress = (currentCard / totalCards) * 100

  return (
    <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="border-gray-300 dark:border-gray-600 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Study
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: deck.color }} />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{deck.title}</h1>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Card {currentCard} of {totalCards}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
