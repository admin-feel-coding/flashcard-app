import { createClient } from '@/lib/supabase/server'

export interface Activity {
  id: string
  user_id: string
  type: 'deck_created' | 'study_session' | 'milestone_reached' | 'streak_achieved' | 'cards_added'
  title: string
  description: string | null
  icon: string | null
  deck_id: string | null
  metadata: Record<string, any>
  created_at: string
  deck?: {
    title: string
    color: string
  }
}

export class ActivityService {
  static async createActivity(
    userId: string,
    type: Activity['type'],
    title: string,
    description?: string,
    deckId?: string,
    metadata?: Record<string, any>
  ) {
    const supabase = await createClient()
    
    const icon = this.getIconForType(type)
    
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        type,
        title,
        description,
        icon,
        deck_id: deckId,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create activity:', error)
      return null
    }

    return data
  }

  static async getUserActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        deck:decks(title, color)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch activities:', error)
      return []
    }

    return data || []
  }

  static async createDeckCreatedActivity(
    userId: string, 
    deckId: string, 
    deckTitle: string,
    cardCount: number,
    isAIGenerated: boolean = false
  ) {
    const title = isAIGenerated 
      ? `Created AI deck "${deckTitle}"` 
      : `Created deck "${deckTitle}"`
    
    const description = `Added ${cardCount} cards to your collection`
    
    return this.createActivity(
      userId,
      'deck_created',
      title,
      description,
      deckId,
      { cardCount, isAIGenerated }
    )
  }

  static async createStudySessionActivity(
    userId: string,
    deckId: string,
    deckTitle: string,
    cardsStudied: number,
    accuracy: number,
    duration: number
  ) {
    const title = `Studied "${deckTitle}"`
    const description = `${cardsStudied} cards • ${accuracy}% accuracy • ${Math.round(duration / 60)}m`
    
    return this.createActivity(
      userId,
      'study_session',
      title,
      description,
      deckId,
      { cardsStudied, accuracy, duration }
    )
  }

  static async createMilestoneActivity(
    userId: string,
    milestone: string,
    description: string,
    metadata?: Record<string, any>
  ) {
    return this.createActivity(
      userId,
      'milestone_reached',
      milestone,
      description,
      undefined,
      metadata
    )
  }

  static async createStreakActivity(
    userId: string,
    streakDays: number
  ) {
    const title = `${streakDays} day study streak! 🔥`
    const description = `Keep up the great work!`
    
    return this.createActivity(
      userId,
      'streak_achieved',
      title,
      description,
      undefined,
      { streakDays }
    )
  }

  private static getIconForType(type: Activity['type']): string {
    switch (type) {
      case 'deck_created':
        return '📚'
      case 'study_session':
        return '📖'
      case 'milestone_reached':
        return '🏆'
      case 'streak_achieved':
        return '🔥'
      case 'cards_added':
        return '📝'
      default:
        return '✨'
    }
  }
}