import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DeckHeader } from "@/components/deck/deck-header"
import { CardList } from "@/components/deck/card-list"
import { CreateCardDialog } from "@/components/deck/create-card-dialog"
import { AIAddCardsDialog } from "@/components/deck/ai-add-cards-dialog"

interface DeckPageProps {
  params: Promise<{ id: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <DeckHeader deck={deck} cardCount={cards?.length || 0} />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flashcards</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {cards?.length ? `${cards.length} card${cards.length === 1 ? "" : "s"}` : "No cards yet"}
              </p>
            </div>
            <div className="flex gap-3">
              <AIAddCardsDialog deckId={id} deckTitle={deck.title} />
              <CreateCardDialog deckId={id} />
            </div>
          </div>

          <CardList cards={cards || []} deckId={id} />
        </div>
      </div>
    </div>
  )
}
