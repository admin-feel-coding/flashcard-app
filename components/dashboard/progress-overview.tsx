"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StudySession {
  id: string
  difficulty: number
  created_at: string
}

interface ProgressOverviewProps {
  totalDecks: number
  totalCards: number
  studySessions: StudySession[]
}

export function ProgressOverview({ totalDecks, totalCards, studySessions }: ProgressOverviewProps) {
  // Calculate statistics
  const totalSessions = studySessions.length
  const recentSessions = studySessions.filter((session) => {
    const sessionDate = new Date(session.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return sessionDate >= thirtyDaysAgo
  })

  const accuracy =
    recentSessions.length > 0
      ? Math.round((recentSessions.filter((s) => s.difficulty >= 2).length / recentSessions.length) * 100)
      : 0

  const stats = [
    {
      title: "Total Decks",
      value: totalDecks,
      icon: "📚",
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Total Cards",
      value: totalCards,
      icon: "🃏",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Study Sessions",
      value: totalSessions,
      icon: "📖",
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "Accuracy (30d)",
      value: `${accuracy}%`,
      icon: "🎯",
      color: "from-orange-600 to-red-600",
    },
  ]

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white">Learning Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</div>
            </div>
          ))}
        </div>

        {recentSessions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Monthly Progress</span>
              <span className="text-sm text-blue-600 dark:text-blue-300">{recentSessions.length} sessions</span>
            </div>
            <Progress value={Math.min((recentSessions.length / 30) * 100, 100)} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
