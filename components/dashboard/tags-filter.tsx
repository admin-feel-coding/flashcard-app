"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Filter } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

interface TagsFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  className?: string
}

export function TagsFilter({ selectedTags, onTagsChange, className }: TagsFilterProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load all available tags for the current user
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase.rpc('get_user_tags', { user_uuid: user.id })
          setAvailableTags(data || [])
        }
      } catch (error) {
        console.error('Failed to load tags:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTags()
  }, [])

  const filteredTags = availableTags.filter(
    tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(tag)
  )

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  if (availableTags.length === 0 && !isLoading) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="default"
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
            <X className="h-3 w-3" />
          </Badge>
        ))}

        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Filter by tags"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filter by tags</h4>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllTags}
                    className="text-xs h-auto p-1"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Available Tags */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {isLoading ? (
                  <div className="text-sm text-gray-500 text-center py-4">Loading tags...</div>
                ) : filteredTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {filteredTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    {searchTerm ? "No tags found" : "No more tags available"}
                  </div>
                )}
              </div>

              {/* Selected Count */}
              {selectedTags.length > 0 && (
                <div className="text-xs text-gray-500 pt-2 border-t">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
