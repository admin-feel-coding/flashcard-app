export interface StudySession {
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

export interface SpacedRepetitionResult {
  interval_days: number
  ease_factor: number
  repetitions: number
  next_review_date: Date
}

/**
 * Enhanced SM-2 Algorithm Implementation
 * Based on the SuperMemo SM-2 algorithm with improvements
 */
export function calculateSpacedRepetition(
  existingSession: StudySession | null,
  difficulty: number, // 0: Again, 1: Hard, 2: Good, 3: Easy
): SpacedRepetitionResult {
  // Default values for new cards
  let interval = 1
  let easeFactor = 2.5
  let repetitions = 0

  if (existingSession) {
    interval = existingSession.interval_days
    easeFactor = existingSession.ease_factor
    repetitions = existingSession.repetitions
  }

  // Calculate new ease factor
  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)))

  let newInterval: number
  let newRepetitions: number

  if (difficulty < 2) {
    // Again (0) or Hard (1) - reset the card
    newInterval = 1
    newRepetitions = 0

    // For "Hard", make it slightly easier next time
    if (difficulty === 1) {
      newInterval = Math.max(1, Math.floor(interval * 0.6))
    }
  } else {
    // Good (2) or Easy (3) - advance the card
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * newEaseFactor)
    }

    // Easy cards get a bonus multiplier
    if (difficulty === 3) {
      newInterval = Math.round(newInterval * 1.3)
    }
  }

  // Cap the maximum interval to prevent cards from disappearing for too long
  newInterval = Math.min(newInterval, 365) // Max 1 year

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

  return {
    interval_days: newInterval,
    ease_factor: newEaseFactor,
    repetitions: newRepetitions,
    next_review_date: nextReviewDate,
  }
}

/**
 * Get cards that are due for review
 */
export function getCardsForReview(studySessions: StudySession[], allCardIds: string[]): string[] {
  const now = new Date()
  const dueCardIds = new Set<string>()

  // Add cards that have study sessions and are due
  studySessions.forEach((session) => {
    const reviewDate = new Date(session.next_review_date)
    if (reviewDate <= now) {
      dueCardIds.add(session.card_id)
    }
  })

  // Add new cards that haven't been studied yet
  const studiedCardIds = new Set(studySessions.map((s) => s.card_id))
  allCardIds.forEach((cardId) => {
    if (!studiedCardIds.has(cardId)) {
      dueCardIds.add(cardId)
    }
  })

  return Array.from(dueCardIds)
}

/**
 * Sort cards by priority for optimal learning
 */
export function sortCardsByPriority(cardIds: string[], studySessions: StudySession[]): string[] {
  const sessionMap = new Map(studySessions.map((s) => [s.card_id, s]))

  return cardIds.sort((a, b) => {
    const sessionA = sessionMap.get(a)
    const sessionB = sessionMap.get(b)

    // New cards (no session) get highest priority
    if (!sessionA && !sessionB) return 0
    if (!sessionA) return -1
    if (!sessionB) return 1

    // Cards that are more overdue get higher priority
    const now = new Date().getTime()
    const dueDateA = new Date(sessionA.next_review_date).getTime()
    const dueDateB = new Date(sessionB.next_review_date).getTime()

    const overdueA = Math.max(0, now - dueDateA)
    const overdueB = Math.max(0, now - dueDateB)

    if (overdueA !== overdueB) {
      return overdueB - overdueA // More overdue first
    }

    // Cards with lower ease factor (harder cards) get priority
    return sessionA.ease_factor - sessionB.ease_factor
  })
}

/**
 * Get study statistics for a set of sessions
 */
export function getStudyStatistics(studySessions: StudySession[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const todaySessions = studySessions.filter((s) => new Date(s.created_at) >= today)
  const yesterdaySessions = studySessions.filter(
    (s) => new Date(s.created_at) >= yesterday && new Date(s.created_at) < today,
  )
  const weekSessions = studySessions.filter((s) => new Date(s.created_at) >= weekAgo)

  const calculateAccuracy = (sessions: StudySession[]) => {
    if (sessions.length === 0) return 0
    const goodSessions = sessions.filter((s) => s.difficulty >= 2)
    return Math.round((goodSessions.length / sessions.length) * 100)
  }

  return {
    today: {
      count: todaySessions.length,
      accuracy: calculateAccuracy(todaySessions),
    },
    yesterday: {
      count: yesterdaySessions.length,
      accuracy: calculateAccuracy(yesterdaySessions),
    },
    week: {
      count: weekSessions.length,
      accuracy: calculateAccuracy(weekSessions),
    },
    total: {
      count: studySessions.length,
      accuracy: calculateAccuracy(studySessions),
    },
  }
}
