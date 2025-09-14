import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AILanguageLearningService, LanguageDeckRequest } from '@/lib/ai-service'
import { ActivityService } from '@/lib/activity-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body: LanguageDeckRequest = await request.json()
    
    // Validate required fields
    if (!body.targetLanguage || !body.nativeLanguage || !body.proficiencyLevel || !body.cardCount || !body.learningFocus) {
      return NextResponse.json(
        { error: 'Missing required fields: targetLanguage, nativeLanguage, proficiencyLevel, cardCount, learningFocus' }, 
        { status: 400 }
      )
    }

    // Validate card count limits
    if (body.cardCount < 5 || body.cardCount > 50) {
      return NextResponse.json(
        { error: 'Card count must be between 5 and 50' }, 
        { status: 400 }
      )
    }

    // Validate proficiency level
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    if (!validLevels.includes(body.proficiencyLevel)) {
      return NextResponse.json(
        { error: 'Invalid proficiency level. Must be A1, A2, B1, B2, C1, or C2' }, 
        { status: 400 }
      )
    }

    // Validate learning focus (allow any string for custom topics)
    if (!body.learningFocus || typeof body.learningFocus !== 'string' || body.learningFocus.trim() === '') {
      return NextResponse.json(
        { error: 'Learning focus is required and must be a non-empty string' }, 
        { status: 400 }
      )
    }

    // Generate the deck using AI
    const generatedDeck = await AILanguageLearningService.generateLanguageDeck(body)

    // Save deck to database
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        user_id: user.id,
        title: generatedDeck.title,
        description: generatedDeck.description,
        color: generatedDeck.color,
        tags: generatedDeck.tags,
      })
      .select()
      .single()

    if (deckError) {
      console.error('Failed to save deck:', deckError)
      return NextResponse.json({ error: 'Failed to save deck' }, { status: 500 })
    }

    // Save cards to database with rich data
    const cardsToInsert = generatedDeck.cards.map(card => ({
      deck_id: deck.id,
      front: card.front,
      back: card.back,
      rich_data: {
        translation: card.translation,
        pronunciation: card.pronunciation,
        wordType: card.wordType,
        examples: card.examples,
        grammarNotes: card.grammarNotes,
        usageNotes: card.usageNotes,
        difficulty: card.difficulty,
        mnemonicHint: card.mnemonicHint,
        culturalContext: card.culturalContext,
        relatedWords: card.relatedWords,
        synonyms: card.synonyms,
        antonyms: card.antonyms,
        conjugations: card.conjugations
      },
      tags: card.tags || []
    }))

    const { error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert)

    if (cardsError) {
      console.error('Failed to save cards:', cardsError)
      // Try to cleanup the deck if cards failed to save
      await supabase.from('decks').delete().eq('id', deck.id)
      return NextResponse.json({ error: 'Failed to save cards' }, { status: 500 })
    }

    // Create activity for deck creation
    await ActivityService.createDeckCreatedActivity(
      user.id,
      deck.id,
      deck.title,
      generatedDeck.cards.length,
      true // AI generated
    )

    return NextResponse.json({
      success: true,
      deck: {
        id: deck.id,
        title: deck.title,
        description: deck.description,
        color: deck.color,
        tags: deck.tags,
        cardCount: generatedDeck.cards.length,
      }
    })

  } catch (error) {
    console.error('AI deck generation error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'AI service configuration error' }, { status: 500 })
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ error: 'AI service is temporarily busy. Please try again in a moment.' }, { status: 429 })
      }
    }

    return NextResponse.json({ error: 'Failed to generate deck' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const targetLanguage = searchParams.get('targetLanguage')
  const proficiencyLevel = searchParams.get('proficiencyLevel') || 'B1'

  if (!targetLanguage) {
    return NextResponse.json({ error: 'targetLanguage parameter is required' }, { status: 400 })
  }

  try {
    const suggestions = await AILanguageLearningService.generateLanguageTopics(targetLanguage, proficiencyLevel)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Language topic suggestions error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
