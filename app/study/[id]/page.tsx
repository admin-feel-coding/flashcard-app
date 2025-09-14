import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudySession } from "@/components/study/study-session"
import { getCardsForReview } from "@/lib/spaced-repetition"

interface StudyPageProps {
  params: Promise<{ id: string }>
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch deck details
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (deckError || !deck) {
    redirect("/dashboard")
  }

  // Fetch cards for this deck
  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", id)
    .order("created_at", { ascending: false })

  if (!cards || cards.length === 0) {
    redirect(`/deck/${id}`)
  }

  // Fetch existing study sessions for these cards
  const { data: studySessions } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", user.id)
    .in(
      "card_id",
      cards.map((card) => card.id),
    )

  const allCardIds = cards.map((c) => c.id)
  const dueCardIds = getCardsForReview(studySessions || [], allCardIds)

  // If no cards are due, show a message instead of starting study session
  if (dueCardIds.length === 0 && studySessions && studySessions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">All Caught Up!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No cards are due for review in <span className="font-semibold">{deck.title}</span> right now. Come back
            later or practice all cards anyway.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`/study/${id}?mode=practice`}
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-900 dark:text-white font-medium rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              Practice All Cards
            </a>
            <a
              href={`/deck/${id}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              Back to Deck
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StudySession deck={deck} cards={cards} studySessions={studySessions || []} userId={user.id} />
  )
}
