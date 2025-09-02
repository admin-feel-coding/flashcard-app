"use client"

import { useState } from "react"
import { DeckCard } from "./deck-card"
import { EmptyDeckState } from "./empty-deck-state"
import { EditDeckDialog } from "./edit-deck-dialog"
import { DeleteDeckDialog } from "./delete-deck-dialog"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  cards: { count: number }[]
  card_count?: number
  tags?: string[] | null
}

interface DeckGridProps {
  decks: Deck[]
  isSelectionMode?: boolean
  selectedDeckIds?: Set<string>
  onSelectionChange?: (deckId: string, selected: boolean) => void
}

export function DeckGrid({ 
  decks, 
  isSelectionMode = false, 
  selectedDeckIds = new Set(), 
  onSelectionChange 
}: DeckGridProps) {
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null)
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null)
  
  if (decks.length === 0) {
    return <EmptyDeckState />
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onEdit={setEditingDeck}
            onDelete={setDeletingDeck}
            isSelectionMode={isSelectionMode}
            isSelected={selectedDeckIds.has(deck.id)}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      {editingDeck && (
        <EditDeckDialog
          deck={editingDeck}
          open={!!editingDeck}
          onOpenChange={(open) => !open && setEditingDeck(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingDeck && (
        <DeleteDeckDialog
          deck={deletingDeck}
          open={!!deletingDeck}
          onOpenChange={(open) => !open && setDeletingDeck(null)}
        />
      )}
    </>
  )
}
