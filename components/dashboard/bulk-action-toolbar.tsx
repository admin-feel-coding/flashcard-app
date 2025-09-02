"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, X, CheckSquare } from "lucide-react"

interface BulkActionToolbarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onDeleteSelected: () => void
  onCancel: () => void
}

export function BulkActionToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onCancel,
}: BulkActionToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0
  const someSelected = selectedCount > 0 && selectedCount < totalCount

  return (
    <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Selection controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              ref={(ref) => {
                if (ref) {
                  ref.indeterminate = someSelected
                }
              }}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectAll()
                } else {
                  onDeselectAll()
                }
              }}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedCount === 0
                ? "Select decks"
                : selectedCount === totalCount
                ? "All selected"
                : `${selectedCount} selected`
              }
            </span>
          </div>

          {selectedCount > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount} of {totalCount} deck{totalCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <>
              {selectedCount < totalCount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAll}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Select All
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedCount === 1 ? 'Deck' : `${selectedCount} Decks`}
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <X className="w-4 h-4 mr-2" />
            {selectedCount > 0 ? 'Cancel' : 'Exit Selection'}
          </Button>
        </div>
      </div>
    </div>
  )
}