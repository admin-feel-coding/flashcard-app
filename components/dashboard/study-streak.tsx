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
    <Card className="group border-0 shadow-xl bg-gradient-to-br from-orange-50/90 via-red-50/80 to-pink-50/70 dark:from-orange-900/20 dark:via-red-900/15 dark:to-pink-900/10 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-orange-200/30 dark:border-orange-700/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">🔥</span>
            </div>
            {currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        <div className="text-center relative">
          <div className="relative inline-block">
            <div className="text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">{currentStreak}</div>
            {currentStreak > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 blur-xl opacity-20 animate-pulse"></div>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {currentStreak === 1 ? "day" : "days"} in a row
          </div>
        </div>

        <div className="relative overflow-hidden p-4 bg-gradient-to-r from-orange-100/80 via-red-100/80 to-pink-100/80 dark:from-orange-800/30 dark:via-red-800/30 dark:to-pink-800/30 rounded-2xl backdrop-blur-sm border border-orange-200/50 dark:border-orange-700/30 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 opacity-50"></div>
          <div className="relative flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Best Streak
            </span>
            <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">
              {longestStreak} {longestStreak === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        {currentStreak === 0 ? (
          <div className="text-center p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Start studying today to ignite your streak!</p>
          </div>
        ) : (
          <div className="text-center p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl backdrop-blur-sm border border-green-200/50 dark:border-green-700/30">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Keep it up! You're on fire! 
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
