"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StudyCard } from "./study-card"
import { StudyComplete } from "./study-complete"
import { createClient } from "@/lib/supabase/client"
import { calculateSpacedRepetition, getCardsForReview, sortCardsByPriority } from "@/lib/spaced-repetition"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
}

interface Card {
  id: string
  front: string
  back: string
  deck_id: string
}

interface StudySession {
  id: string
  card_id: string
  difficulty: number
  interval_days: number
  ease_factor: number
  repetitions: number
  next_review_date: string
  created_at: string
  updated_at: string
}

interface StudySessionProps {
  deck: Deck
  cards: Card[]
  studySessions: StudySession[]
  userId: string
}

export function StudySession({ deck, cards, studySessions, userId }: StudySessionProps) {
  const allCardIds = cards.map((c) => c.id)
  const dueCardIds = getCardsForReview(studySessions, allCardIds)
  const prioritizedCardIds = sortCardsByPriority(dueCardIds, studySessions)

  // Filter cards to only include those that are due for review
  const studyCards = cards.filter((card) => prioritizedCardIds.includes(card.id))

  // If no cards are due, include all cards (for practice mode)
  const finalStudyCards = studyCards.length > 0 ? studyCards : cards

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: finalStudyCards.length,
    completed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })
  const router = useRouter()

  const currentCard = finalStudyCards[currentCardIndex]
  const isLastCard = currentCardIndex === finalStudyCards.length - 1

  const handleCardRating = async (difficulty: number) => {
    const supabase = createClient()

    const existingSession = studySessions.find((session) => session.card_id === currentCard.id)
    const result = calculateSpacedRepetition(existingSession, difficulty)

    // Update or create study session
    if (existingSession) {
      await supabase
        .from("study_sessions")
        .update({
          difficulty,
          interval_days: result.interval_days,
          ease_factor: result.ease_factor,
          repetitions: result.repetitions,
          next_review_date: result.next_review_date.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSession.id)
    } else {
      await supabase.from("study_sessions").insert({
        user_id: userId,
        card_id: currentCard.id,
        difficulty,
        interval_days: result.interval_days,
        ease_factor: result.ease_factor,
        repetitions: result.repetitions,
        next_review_date: result.next_review_date.toISOString(),
      })
    }

    // Update session stats
    const difficultyNames = ["again", "hard", "good", "easy"] as const
    setSessionStats((prev) => ({
      ...prev,
      completed: prev.completed + 1,
      [difficultyNames[difficulty]]: prev[difficultyNames[difficulty]] + 1,
    }))

    // Move to next card or complete session
    if (isLastCard) {
      setIsComplete(true)
    } else {
      setCurrentCardIndex((prev) => prev + 1)
    }
  }

  const handleReturnToDeck = () => {
    router.push(`/deck/${deck.id}`)
  }

  const handleStudyAgain = () => {
    setCurrentCardIndex(0)
    setIsComplete(false)
    setSessionStats({
      total: finalStudyCards.length,
      completed: 0,
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
    })
  }

  if (isComplete) {
    return (
      <StudyComplete
        deck={deck}
        stats={sessionStats}
        onReturnToDeck={handleReturnToDeck}
        onStudyAgain={handleStudyAgain}
      />
    )
  }

  return (
    <StudyCard 
      card={currentCard} 
      deck={deck}
      currentCard={currentCardIndex + 1}
      totalCards={finalStudyCards.length}
      onRate={handleCardRating}
      onExit={handleReturnToDeck}
    />
  )
}
