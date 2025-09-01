"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StudyCardProps {
  card: {
    id: string
    front: string
    back: string
  }
  onRate: (difficulty: number) => void
}

export function StudyCard({ card, onRate }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isFlipped) {
        if (event.code === "Space" || event.code === "Enter") {
          event.preventDefault()
          handleFlip()
        }
      } else {
        switch (event.code) {
          case "Digit1":
            event.preventDefault()
            handleRate(0)
            break
          case "Digit2":
            event.preventDefault()
            handleRate(1)
            break
          case "Digit3":
            event.preventDefault()
            handleRate(2)
            break
          case "Digit4":
            event.preventDefault()
            handleRate(3)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isFlipped])

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false)
    setIsAnimating(false)
  }, [card.id])

  const handleFlip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsFlipped(true)
      setIsAnimating(false)
    }, 150)
  }

  const handleRate = (difficulty: number) => {
    setIsAnimating(true)
    setTimeout(() => {
      onRate(difficulty)
      setIsFlipped(false)
      setIsAnimating(false)
    }, 200)
  }

  const difficultyButtons = [
    { label: "Again", value: 0, color: "bg-red-600 hover:bg-red-700", description: "< 1 day", key: "1" },
    { label: "Hard", value: 1, color: "bg-orange-600 hover:bg-orange-700", description: "< 1 day", key: "2" },
    { label: "Good", value: 2, color: "bg-blue-600 hover:bg-blue-700", description: "1-6 days", key: "3" },
    { label: "Easy", value: 3, color: "bg-green-600 hover:bg-green-700", description: "> 6 days", key: "4" },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card
        className={`border-0 shadow-2xl bg-white dark:bg-gray-800 min-h-[400px] relative overflow-hidden transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
        <CardContent className="p-8 h-full flex flex-col justify-center relative z-10">
          <div className="text-center space-y-6">
            <div className="min-h-[200px] flex items-center justify-center">
              {!isFlipped ? (
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl text-gray-900 dark:text-white leading-relaxed text-balance">{card.front}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl text-gray-900 dark:text-white leading-relaxed text-balance">{card.back}</p>
                </div>
              )}
            </div>

            {!isFlipped ? (
              <div className="space-y-4">
                <Button
                  onClick={handleFlip}
                  disabled={isAnimating}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isAnimating ? "Loading..." : "Show Answer"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">Press Space or Enter to reveal</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">How well did you know this?</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {difficultyButtons.map((button) => (
                    <Button
                      key={button.value}
                      onClick={() => handleRate(button.value)}
                      disabled={isAnimating}
                      className={`${button.color} text-white h-16 flex flex-col items-center justify-center text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 relative`}
                    >
                      <span className="font-semibold">{button.label}</span>
                      <span className="text-xs opacity-90">{button.description}</span>
                      <span className="absolute top-1 right-1 text-xs opacity-60">{button.key}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Tip:</span> Use keyboard shortcuts (1-4) for faster rating, or be
                    honest with your rating to optimize learning!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
