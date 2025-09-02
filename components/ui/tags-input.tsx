"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  className?: string
  suggestions?: string[]
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  disabled = false,
  className,
  suggestions = [],
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isInputFocused, setIsInputFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag])
      setInputValue("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    switch (e.key) {
      case "Enter":
      case ",":
        e.preventDefault()
        addTag(inputValue)
        break
      case "Backspace":
        if (inputValue === "" && value.length > 0) {
          removeTag(value.length - 1)
        }
        break
      case "Escape":
        setIsInputFocused(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tags Display */}
      <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {value.length < maxTags && (
          <div className="flex-1 flex items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder={value.length === 0 ? placeholder : ""}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              disabled={disabled}
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm bg-transparent"
            />
            {inputValue && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => addTag(inputValue)}
                className="h-6 w-6 p-0 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {isInputFocused && filteredSuggestions.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md max-h-32 overflow-y-auto">
          {filteredSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none first:rounded-t-md last:rounded-b-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {!disabled && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Enter or comma to add tags. {value.length}/{maxTags} tags used.
        </p>
      )}
    </div>
  )
}