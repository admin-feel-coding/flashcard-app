import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AILanguageLearningService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    if (!body.deckId || !body.topic) {
      return NextResponse.json(
        { error: 'Missing required fields: deckId, topic' }, 
        { status: 400 }
      )
    }

    // Verify deck ownership
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select('id, title, description, tags')
      .eq('id', body.deckId)
      .eq('user_id', user.id)
      .single()

    if (deckError || !deck) {
      return NextResponse.json({ error: 'Deck not found or access denied' }, { status: 404 })
    }

    // Get ALL existing cards to provide comprehensive context to AI
    const { data: existingCards } = await supabase
      .from('cards')
      .select('front, back')
      .eq('deck_id', body.deckId)
      .order('created_at', { ascending: false })

    // Prepare smart AI request
    const aiRequest = {
      topic: body.topic,
      deckTitle: deck.title,
      deckDescription: deck.description || '',
      deckTags: deck.tags || [],
      existingCards: existingCards || [],
      existingCardCount: existingCards?.length || 0,
      nativeLanguage: body.nativeLanguage || 'English',
      customInstructions: body.customPrompt || '',
      smartMode: body.smartMode || false,
    }

    // Generate cards using AI
    const generatedCards = await AILanguageLearningService.generateDeckCards(aiRequest)

    // Save new cards to database
    const cardsToInsert = generatedCards.map(card => ({
      deck_id: body.deckId,
      front: card.front,
      back: card.back,
    }))

    const { error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert)

    if (cardsError) {
      console.error('Failed to save generated cards:', cardsError)
      return NextResponse.json({ error: 'Failed to save generated cards' }, { status: 500 })
    }

    // Get updated card count
    const { count: totalCards } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', body.deckId)

    return NextResponse.json({
      success: true,
      cardsCreated: generatedCards.length,
      totalCards: totalCards || 0,
      deckTitle: deck.title,
    })

  } catch (error) {
    console.error('AI deck cards generation error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'AI service configuration error' }, { status: 500 })
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ error: 'AI service is temporarily busy. Please try again in a moment.' }, { status: 429 })
      }
    }

    return NextResponse.json({ error: 'Failed to generate cards' }, { status: 500 })
  }
}