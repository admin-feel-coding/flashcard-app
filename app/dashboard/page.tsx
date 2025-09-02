import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DeckManagement } from "@/components/dashboard/deck-management"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { StudyStreak } from "@/components/dashboard/study-streak"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DueCards } from "@/components/dashboard/due-cards"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's decks
  const { data: decks } = await supabase
    .from("decks")
    .select(`
      *,
      cards(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch total cards count
  const { count: totalCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .in("deck_id", decks?.map((deck) => deck.id) || [])

  // Fetch study sessions for analytics
  const { data: studySessions } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch cards due for review today
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const { data: dueCards } = await supabase
    .from("study_sessions")
    .select(`
      *,
      cards(*)
    `)
    .eq("user_id", user.id)
    .lte("next_review_date", today.toISOString())

  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { data: recentSessions } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <ProgressOverview
              totalDecks={decks?.length || 0}
              totalCards={totalCards || 0}
              studySessions={studySessions || []}
            />
            <RecentActivity recentSessions={recentSessions || []} />
          </div>
          <div className="space-y-6">
            <StudyStreak studySessions={studySessions || []} />
            <DueCards dueCards={dueCards || []} />
          </div>
        </div>

        <DeckManagement decks={decks || []} />
      </div>
    </div>
  )
}
