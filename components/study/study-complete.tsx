"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react"

interface Deck {
  id: string
  title: string
  color: string
}

interface StudyStats {
  total: number
  completed: number
  again: number
  hard: number
  good: number
  easy: number
}

interface StudyCompleteProps {
  deck: Deck
  stats: StudyStats
  onReturnToDeck: () => void
  onStudyAgain: () => void
}

export function StudyComplete({ deck, stats, onReturnToDeck, onStudyAgain }: StudyCompleteProps) {
  const accuracy = stats.completed > 0 ? Math.round(((stats.good + stats.easy) / stats.completed) * 100) : 0

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding! You've mastered these cards!", emoji: "🏆" }
    if (accuracy >= 75) return { message: "Great job! You're making excellent progress!", emoji: "🎉" }
    if (accuracy >= 60) return { message: "Good work! Keep practicing to improve!", emoji: "👍" }
    return { message: "Keep going! Practice makes perfect!", emoji: "💪" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-subtle">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Study Session Complete!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Great job studying <span className="font-semibold">{deck.title}</span>
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">{performance.emoji}</span>
            <p className="text-lg text-gray-700 dark:text-gray-300">{performance.message}</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Cards</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.good}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Good</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.easy}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Easy</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.hard}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Hard</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.again}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Again</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Next Review:</span> Cards you marked as "Good" will appear in 1-6 days,
                "Easy" cards in 6+ days, and "Again/Hard" cards will appear sooner for more practice.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStudyAgain}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Study Again
          </Button>
          <Button
            onClick={onReturnToDeck}
            variant="outline"
            className="px-8 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deck
          </Button>
        </div>
      </div>
    </div>
  )
}
