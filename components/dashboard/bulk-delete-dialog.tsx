"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2, AlertTriangle } from "lucide-react"

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

interface BulkDeleteDialogProps {
  selectedDecks: Deck[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BulkDeleteDialog({
  selectedDecks,
  open,
  onOpenChange,
  onSuccess,
}: BulkDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const totalCards = selectedDecks.reduce((total, deck) => {
    const cardCount = deck.cards?.[0]?.count || 0
    return total + cardCount
  }, 0)

  const isDeleteAll = selectedDecks.length > 1

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const deckIds = selectedDecks.map(deck => deck.id)

      // Delete all cards associated with these decks first
      const { error: cardsError } = await supabase
        .from("cards")
        .delete()
        .in("deck_id", deckIds)

      if (cardsError) {
        throw new Error("Failed to delete cards")
      }

      // Delete the decks
      const { error: decksError } = await supabase
        .from("decks")
        .delete()
        .in("id", deckIds)

      if (decksError) {
        throw new Error("Failed to delete decks")
      }

      // Success notification
      if (selectedDecks.length === 1) {
        toast.success(
          `"${selectedDecks[0].title}" deleted`,
          {
            description: `Deck and ${totalCards} card${totalCards !== 1 ? 's' : ''} removed successfully`,
            duration: 4000
          }
        )
      } else {
        toast.success(
          `${selectedDecks.length} decks deleted`,
          {
            description: `${totalCards} total cards removed successfully`,
            duration: 4000
          }
        )
      }

      onSuccess()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Bulk delete error:", error)
      toast.error(
        "Failed to delete decks",
        {
          description: error instanceof Error ? error.message : "Please try again",
          duration: 5000
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isDeleteAll ? `Delete ${selectedDecks.length} Decks?` : `Delete "${selectedDecks[0]?.title}"?`}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <DialogDescription className="space-y-3">
          <p>
            {isDeleteAll 
              ? `You're about to permanently delete ${selectedDecks.length} decks and all their cards.`
              : `You're about to permanently delete this deck and all its cards.`
            }
          </p>
          
          {/* Deck list for multiple deletions */}
          {isDeleteAll && selectedDecks.length <= 5 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
              {selectedDecks.map((deck) => {
                const cardCount = deck.cards?.[0]?.count || 0
                return (
                  <div key={deck.id} className="flex items-center gap-3 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: deck.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {deck.title}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-auto">
                      {cardCount} card{cardCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {isDeleteAll && selectedDecks.length > 5 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
              Including: {selectedDecks.slice(0, 3).map(d => d.title).join(', ')} 
              and {selectedDecks.length - 3} more...
            </div>
          )}
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <Trash2 className="w-4 h-4" />
              <span className="font-medium text-sm">
                {totalCards} card{totalCards !== 1 ? 's' : ''} will be permanently deleted
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </DialogDescription>

        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete {isDeleteAll ? `${selectedDecks.length} Decks` : 'Deck'}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
