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

interface CreateCardDialogProps {
  deckId: string
}

export function CreateCardDialog({ deckId }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
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

      const { error } = await supabase.from("cards").insert({
        front: front.trim(),
        back: back.trim(),
        deck_id: deckId,
      })

      if (error) throw error

      setOpen(false)
      setFront("")
      setBack("")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create card")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
          <DialogDescription>
            Add a new flashcard to this deck. The front is the question or prompt, and the back is the answer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front (Question/Prompt)</Label>
            <Textarea
              id="front"
              placeholder="What do you want to remember?"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Back (Answer)</Label>
            <Textarea
              id="back"
              placeholder="The answer or explanation..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
              rows={3}
            />
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
              {isLoading ? "Creating..." : "Create Card"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
