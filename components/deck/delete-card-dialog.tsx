"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

interface FlashCard {
  id: string
  front: string
  back: string
  created_at: string
}

interface DeleteCardDialogProps {
  card: FlashCard
  deckId: string
}

export function DeleteCardDialog({ card, deckId }: DeleteCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      await supabase.from("study_sessions").delete().eq("card_id", card.id)

      const { error } = await supabase.from("cards").delete().eq("id", card.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete card")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400">Delete Flashcard</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this flashcard? This action cannot be undone and will also remove all study
            progress for this card.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Front:</span> {card.front.substring(0, 100)}
            {card.front.length > 100 ? "..." : ""}
          </p>
        </div>
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Card"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
