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
    <Card className="group border-0 shadow-xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Learning Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="group/stat text-center p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div
                className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover/stat:shadow-xl group-hover/stat:scale-110 transition-all duration-300`}
              >
                <span className="text-2xl filter drop-shadow-sm">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-400 transition-colors duration-300">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.title}</div>
            </div>
          ))}
        </div>

        {recentSessions.length > 0 && (
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-2xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Monthly Progress
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-800/50 px-3 py-1 rounded-full font-medium">
                {recentSessions.length} sessions
              </span>
            </div>
            <Progress value={Math.min((recentSessions.length / 30) * 100, 100)} className="h-3 bg-blue-100/50 dark:bg-blue-800/30" />
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
              {Math.min((recentSessions.length / 30) * 100, 100).toFixed(0)}% of monthly goal
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
