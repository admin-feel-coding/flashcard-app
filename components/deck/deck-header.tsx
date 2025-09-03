"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Edit, Trash2, Tags } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { EditDeckDialog } from "./edit-deck-dialog"
import { DeleteDeckDialog } from "./delete-deck-dialog"
import { ManageTagsDialog } from "./manage-tags-dialog"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  created_at: string
  tags?: string[] | null
}

interface DeckHeaderProps {
  deck: Deck
  cardCount: number
}

export function DeckHeader({ deck, cardCount }: DeckHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 bg-transparent text-xs sm:text-sm">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 mt-1 sm:mt-1" style={{ backgroundColor: deck.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words flex-1">{deck.title}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Deck
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowTagsDialog(true)} className="cursor-pointer">
                      <Tags className="mr-2 h-4 w-4" />
                      Manage Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)} 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Deck
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {deck.description && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 break-words">{deck.description}</p>
              )}
              
              {/* Tags */}
              {deck.tags && deck.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {deck.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                  {deck.tags.length > 5 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                      +{deck.tags.length - 5}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                  {cardCount} card{cardCount !== 1 ? "s" : ""}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(deck.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {cardCount > 0 && (
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link href={`/study/${deck.id}`}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="hidden sm:inline">Start Studying</span>
                  <span className="sm:hidden">Study</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EditDeckDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        deck={deck}
      />
      
      <DeleteDeckDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deck={deck}
        cardCount={cardCount}
      />
      
      <ManageTagsDialog
        open={showTagsDialog}
        onOpenChange={setShowTagsDialog}
        deck={deck}
      />
    </div>
  )
}
