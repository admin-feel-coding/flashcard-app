"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { useRouter } from "next/navigation"
import { Loader2, Edit3 } from "lucide-react"

const DECK_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
]

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  tags?: string[] | null
}

interface EditDeckDialogProps {
  deck: Deck
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDeckDialog({ deck, open, onOpenChange }: EditDeckDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(DECK_COLORS[0])
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userTags, setUserTags] = useState<string[]>([])
  const router = useRouter()

  // Initialize form with deck data when dialog opens
  useEffect(() => {
    if (open && deck) {
      setTitle(deck.title)
      setDescription(deck.description || "")
      setSelectedColor(deck.color)
      setTags(deck.tags || [])
      setError(null)
    }
  }, [open, deck])

  // Load user's existing tags for suggestions
  useEffect(() => {
    const loadUserTags = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase.rpc('get_user_tags', { user_uuid: user.id })
          setUserTags(data || [])
        }
      } catch (error) {
        console.error('Failed to load user tags:', error)
      }
    }

    if (open) {
      loadUserTags()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

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
        .update({
          title: title.trim(),
          description: description.trim() || null,
          color: selectedColor,
          tags: tags.length > 0 ? tags : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", deck.id)
        .eq("user_id", user.id)

      if (error) throw error

      onOpenChange(false)
      router.refresh()

      // Show success message (could be enhanced with a toast library)
      console.log("Deck updated successfully!")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update deck")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Deck
          </DialogTitle>
          <DialogDescription>
            Update your flashcard deck details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Deck Title</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Spanish Vocabulary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (Optional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Brief description of what this deck covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Deck Color</Label>
            <div className="flex gap-2 flex-wrap">
              {DECK_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-full border-2 transition-all disabled:opacity-50 ${
                    selectedColor === color
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-gray-300 dark:border-gray-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <TagsInput
              value={tags}
              onChange={setTags}
              placeholder="Add tags to categorize your deck..."
              maxTags={8}
              disabled={isLoading}
              suggestions={userTags}
            />
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}