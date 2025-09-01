"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StudySession {
  id: string
  difficulty: number
  created_at: string
}

interface RecentActivityProps {
  recentSessions: StudySession[]
}

export function RecentActivity({ recentSessions }: RecentActivityProps) {
  // Group sessions by date
  const sessionsByDate = recentSessions.reduce(
    (acc, session) => {
      const date = new Date(session.created_at).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    },
    {} as Record<string, StudySession[]>,
  )

  const sortedDates = Object.keys(sessionsByDate)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7)

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case 1:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case 2:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case 3:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return "Again"
      case 1:
        return "Hard"
      case 2:
        return "Good"
      case 3:
        return "Easy"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">No recent study activity</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start studying to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => {
              const sessions = sessionsByDate[date]
              const accuracy = Math.round((sessions.filter((s) => s.difficulty >= 2).length / sessions.length) * 100)

              return (
                <div key={date} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {sessions.length} cards
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${accuracy >= 70 ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"}`}
                      >
                        {accuracy}% accuracy
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {sessions.slice(0, 10).map((session, index) => (
                      <div
                        key={session.id}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${getDifficultyColor(session.difficulty)}`}
                        title={getDifficultyLabel(session.difficulty)}
                      >
                        {getDifficultyLabel(session.difficulty)[0]}
                      </div>
                    ))}
                    {sessions.length > 10 && (
                      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 text-xs flex items-center justify-center text-gray-600 dark:text-gray-300">
                        +{sessions.length - 10}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
