"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  tags?: string[] | null
}

interface DeleteDeckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deck: Deck
  cardCount: number
}

export function DeleteDeckDialog({ open, onOpenChange, deck, cardCount }: DeleteDeckDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const expectedText = "DELETE"
  const canDelete = confirmText === expectedText

  const handleDelete = async () => {
    if (!canDelete) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete deck")
      }

      toast.success(`"${deck.title}" has been deleted`)
      onOpenChange(false)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting deck:", error)
      toast.error("Failed to delete deck")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Delete Deck
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Warning:</strong> This action cannot be undone. This will permanently delete:
              </p>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                <li>The deck "{deck.title}"</li>
                <li>{cardCount} flashcard{cardCount !== 1 ? "s" : ""}</li>
                <li>All study progress and statistics</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Type <span className="font-mono font-bold">{expectedText}</span> to confirm:
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${expectedText}" here...`}
                disabled={isLoading}
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={!canDelete || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Deleting..." : "Delete Deck"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}