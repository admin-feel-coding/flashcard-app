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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Edit } from "lucide-react"

interface FlashCard {
  id: string
  front: string
  back: string
  created_at: string
}

interface EditCardDialogProps {
  card: FlashCard
  deckId: string
}

export function EditCardDialog({ card, deckId }: EditCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("cards")
        .update({
          front: front.trim(),
          back: back.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", card.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update card")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
          <DialogDescription>Update the content of this flashcard.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front (Question/Prompt)</Label>
            <Textarea id="front" value={front} onChange={(e) => setFront(e.target.value)} required rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Back (Answer)</Label>
            <Textarea id="back" value={back} onChange={(e) => setBack(e.target.value)} required rows={3} />
          </div>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !front.trim() || !back.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? "Updating..." : "Update Card"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
