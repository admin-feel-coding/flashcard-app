"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: string
  title: string
  description: string | null
  icon: string | null
  created_at: string
  deck?: {
    title: string
    color: string
  } | null
  metadata: Record<string, any>
}

interface RecentActivityProps {
  recentActivities: Activity[]
}

export function RecentActivity({ recentActivities }: RecentActivityProps) {
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'deck_created':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'study_session':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'milestone_reached':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'streak_achieved':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'cards_added':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'deck_created':
        return 'Deck Created'
      case 'study_session':
        return 'Study Session'
      case 'milestone_reached':
        return 'Milestone'
      case 'streak_achieved':
        return 'Streak'
      case 'cards_added':
        return 'Cards Added'
      default:
        return 'Activity'
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-xl">📈</span>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No recent activity</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Start studying to see your progress here!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create decks, study cards, and achieve milestones
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Activity Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-lg">{activity.icon || '✨'}</span>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {activity.title}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 ${getActivityTypeColor(activity.type)}`}
                    >
                      {getActivityTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {activity.description}
                    </p>
                  )}

                  {/* Deck Info */}
                  {activity.deck && (
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: activity.deck.color }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {activity.deck.title}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {recentActivities.filter(a => a.type === 'deck_created').length}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">Decks Created</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {recentActivities.filter(a => a.type === 'study_session').length}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">Study Sessions</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {recentActivities.filter(a => a.type === 'milestone_reached').length}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">Milestones</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
