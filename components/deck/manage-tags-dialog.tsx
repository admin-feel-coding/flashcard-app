"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { X, Plus } from "lucide-react"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  tags?: string[] | null
}

interface ManageTagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deck: Deck
}

export function ManageTagsDialog({ open, onOpenChange, deck }: ManageTagsDialogProps) {
  const [tags, setTags] = useState<string[]>(deck.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset tags when deck changes
  useEffect(() => {
    setTags(deck.tags || [])
  }, [deck.tags])

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: tags.length > 0 ? tags : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update tags")
      }

      toast.success("Tags updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating tags:", error)
      toast.error("Failed to update tags")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTags(deck.tags || [])
      setNewTag("")
      onOpenChange(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Add new tag */}
          <div className="space-y-2">
            <Label htmlFor="new-tag">Add Tags</Label>
            <div className="flex gap-2">
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter tag name..."
                disabled={isLoading}
                maxLength={30}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim() || isLoading || tags.includes(newTag.trim())}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter or click + to add tags
            </p>
          </div>

          {/* Current tags */}
          <div className="space-y-2">
            <Label>Current Tags ({tags.length})</Label>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg min-h-[60px]">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isLoading}
                      className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm">No tags added yet</p>
                <p className="text-xs mt-1">Tags help organize and categorize your decks</p>
              </div>
            )}
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
              {isLoading ? "Saving..." : "Save Tags"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}