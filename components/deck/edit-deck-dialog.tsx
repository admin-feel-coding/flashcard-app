"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  tags?: string[] | null
}

interface EditDeckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deck: Deck
}

export function EditDeckDialog({ open, onOpenChange, deck }: EditDeckDialogProps) {
  const [title, setTitle] = useState(deck.title)
  const [description, setDescription] = useState(deck.description || "")
  const [color, setColor] = useState(deck.color)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#6B7280", // Gray
    "#F97316", // Orange
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Deck title is required")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          color,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update deck")
      }

      toast.success("Deck updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating deck:", error)
      toast.error("Failed to update deck")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle(deck.title)
      setDescription(deck.description || "")
      setColor(deck.color)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Deck</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Deck Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deck title..."
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter deck description..."
              disabled={isLoading}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Deck Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-gray-300 dark:border-gray-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
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
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? "Updating..." : "Update Deck"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
