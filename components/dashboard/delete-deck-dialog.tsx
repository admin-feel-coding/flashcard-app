"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  card_count?: number
}

interface DeleteDeckDialogProps {
  deck: Deck
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDeckDialog({ deck, open, onOpenChange }: DeleteDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const router = useRouter()

  const cardCount = deck.card_count || 0
  const requiresConfirmation = cardCount > 0

  const handleDelete = async () => {
    if (requiresConfirmation && confirmText !== deck.title) {
      setError("Please type the deck name exactly to confirm deletion")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deck.id)
        .eq("user_id", user.id)

      if (error) throw error

      onOpenChange(false)
      router.refresh()

      // Show success message (could be enhanced with a toast library)
      console.log("Deck deleted successfully!")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete deck")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setError(null)
      setConfirmText("")
    }
  }

  const isConfirmValid = !requiresConfirmation || confirmText === deck.title

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="w-5 h-5" />
            Delete Deck
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your deck and all its cards.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning section */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                You are about to delete "{deck.title}"
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                {cardCount > 0 
                  ? `This deck contains ${cardCount} card${cardCount !== 1 ? 's' : ''} that will also be deleted.`
                  : "This empty deck will be permanently deleted."
                }
              </p>
            </div>
          </div>

          {/* Confirmation input for decks with cards */}
          {requiresConfirmation && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Type the deck name <span className="font-bold">"{deck.title}"</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={deck.title}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || !isConfirmValid}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Deck
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
