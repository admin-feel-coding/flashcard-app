"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudySession {
  id: string
  created_at: string
}

interface StudyStreakProps {
  studySessions: StudySession[]
}

export function StudyStreak({ studySessions }: StudyStreakProps) {
  // Calculate current streak
  const calculateStreak = () => {
    if (studySessions.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = 0
    const currentDate = new Date(today)

    // Group sessions by date
    const sessionsByDate = studySessions.reduce(
      (acc, session) => {
        const date = new Date(session.created_at)
        date.setHours(0, 0, 0, 0)
        const dateKey = date.toISOString().split("T")[0]

        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
      },
      {} as Record<string, StudySession[]>,
    )

    // Check for consecutive days
    while (true) {
      const dateKey = currentDate.toISOString().split("T")[0]
      if (sessionsByDate[dateKey] && sessionsByDate[dateKey].length > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()
  const longestStreak = Math.max(currentStreak, 0) // Could be calculated more accurately with historical data

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">🔥 Study Streak</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">{currentStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {currentStreak === 1 ? "day" : "days"} in a row
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-300">Best Streak</span>
          <span className="font-semibold text-orange-600 dark:text-orange-400">
            {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </span>
        </div>

        {currentStreak === 0 && (
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Start studying today to begin your streak!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
