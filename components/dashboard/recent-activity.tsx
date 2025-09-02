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
    <Card className="group border-0 shadow-xl bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-cyan-50/70 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/10 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] border border-emerald-200/30 dark:border-emerald-700/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-lg">📈</span>
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl filter drop-shadow-sm">📚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">No Recent Activity</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Start studying to see your progress here!</p>
            <div className="mt-4 p-4 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-2xl backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/30">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Create decks, study cards, and achieve milestones
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-700 scrollbar-track-transparent">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="group/item flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-white/50 dark:border-gray-600/30 backdrop-blur-sm"
              >
                {/* Activity Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover/item:shadow-xl group-hover/item:scale-110 transition-all duration-300">
                    <span className="text-xl filter drop-shadow-sm">{activity.icon || '✨'}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors duration-300">
                      {activity.title}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-3 py-1 ${getActivityTypeColor(activity.type)} rounded-full font-medium shadow-sm`}
                    >
                      {getActivityTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                      {activity.description}
                    </p>
                  )}

                  {/* Deck Info */}
                  {activity.deck && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50/80 dark:bg-gray-600/30 rounded-lg backdrop-blur-sm">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                        style={{ backgroundColor: activity.deck.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">
                        {activity.deck.title}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentActivities.length > 0 && (
          <div className="mt-6 pt-6 border-t border-emerald-200/50 dark:border-emerald-700/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-2xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {recentActivities.filter(a => a.type === 'deck_created').length}
                </div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Decks Created</div>
              </div>
              <div className="p-3 bg-green-50/80 dark:bg-green-900/20 rounded-2xl backdrop-blur-sm border border-green-200/50 dark:border-green-700/30">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {recentActivities.filter(a => a.type === 'study_session').length}
                </div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">Study Sessions</div>
              </div>
              <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-2xl backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-700/30">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {recentActivities.filter(a => a.type === 'milestone_reached').length}
                </div>
                <div className="text-xs text-yellow-600/80 dark:text-yellow-400/80 font-medium">Milestones</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
