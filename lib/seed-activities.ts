import { createClient } from '@/lib/supabase/server'

export async function seedSampleActivities(userId: string, deckId: string, deckTitle: string) {
  const supabase = await createClient()
  
  const now = new Date()
  const activities = [
    {
      user_id: userId,
      type: 'deck_created',
      title: `Created AI deck "${deckTitle}"`,
      description: 'Added 20 cards to your collection',
      icon: '📚',
      deck_id: deckId,
      metadata: { cardCount: 20, isAIGenerated: true },
      created_at: now.toISOString()
    },
    {
      user_id: userId,
      type: 'study_session',
      title: 'Studied "Basic Spanish Vocabulary"',
      description: '15 cards • 85% accuracy • 8m',
      icon: '📖',
      deck_id: null,
      metadata: { cardsStudied: 15, accuracy: 85, duration: 480 },
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      user_id: userId,
      type: 'milestone_reached',
      title: '100 Cards Studied! 🎉',
      description: 'You\'ve reached your first major milestone',
      icon: '🏆',
      deck_id: null,
      metadata: { milestone: 'cards_studied', count: 100 },
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      user_id: userId,
      type: 'streak_achieved',
      title: '7 day study streak! 🔥',
      description: 'Keep up the great work!',
      icon: '🔥',
      deck_id: null,
      metadata: { streakDays: 7 },
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      user_id: userId,
      type: 'deck_created',
      title: 'Created deck "French Basics"',
      description: 'Added 12 cards to your collection',
      icon: '📚',
      deck_id: null,
      metadata: { cardCount: 12, isAIGenerated: false },
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ]

  const { data, error } = await supabase
    .from('activities')
    .insert(activities)
    .select()

  if (error) {
    console.error('Failed to seed activities:', error)
    return null
  }

  return data
}
