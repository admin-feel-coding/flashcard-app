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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles, Plus, Zap } from "lucide-react"

interface AIAddCardsDialogProps {
  deckId: string
  deckTitle: string
}

export function AIAddCardsDialog({ deckId, deckTitle }: AIAddCardsDialogProps) {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Pre-fill topic with deck title when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setTopic(deckTitle)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() && !customPrompt.trim()) return

    setIsLoading(true)

    // Get user's native language preference
    const nativeLanguage = localStorage.getItem('flashmind-native-language') || 'English'
    
    // Show toast notification
    const toastId = toast.loading(
      `✨ AI is creating smart cards...`,
      { 
        description: `Analyzing "${deckTitle}" and avoiding duplicates`,
        duration: Infinity
      }
    )
    
    // Close dialog immediately to allow user to continue
    setTimeout(() => {
      setOpen(false)
      resetForm()
    }, 500)

    try {
      const response = await fetch('/api/ai/generate-deck-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckId,
          topic: topic || customPrompt,
          nativeLanguage,
          deckTitle,
          smartMode: true, // Enable smart duplicate detection
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cards')
      }

      // Success toast
      toast.success(
        `🎉 ${data.cardsCreated} cards added successfully!`,
        { 
          id: toastId,
          description: `"${deckTitle}" now has ${data.totalCards} cards`,
          action: {
            label: "View Deck",
            onClick: () => window.location.reload()
          },
          duration: 6000
        }
      )
      
      // Refresh the page to show new cards
      router.refresh()

    } catch (error) {
      console.error('AI card generation error:', error)
      toast.error(
        "Failed to generate cards",
        { 
          id: toastId,
          description: error instanceof Error ? error.message : "Please try again with a different topic",
          duration: 5000
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTopic("")
    setCustomPrompt("")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Add with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Generate Cards with AI
          </DialogTitle>
          <DialogDescription>
            AI will analyze "<strong>{deckTitle}</strong>" and create smart cards that complement your existing content without duplicating.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Learning focus (pre-filled from deck title)</Label>
            <Input
              id="topic"
              placeholder="AI will use your deck title as the learning focus..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-11 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
            />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              ✨ AI will create cards based on this topic while avoiding duplicates
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart AI Features</span>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li>• Analyzes existing cards to avoid duplicates</li>
              <li>• Determines optimal number of cards to create</li>
              <li>• Maintains consistent difficulty level</li>
              <li>• Creates complementary content</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Additional instructions (optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Any specific requirements? e.g., 'Focus on advanced concepts', 'Include more examples', 'Add pronunciation guides'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

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
            <Button
              type="submit"
              disabled={isLoading || (!topic.trim() && !customPrompt.trim())}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate Cards
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
