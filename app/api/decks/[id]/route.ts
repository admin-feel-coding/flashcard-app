import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { title, description, color, tags } = body

    // Verify deck ownership
    const { data: existingDeck, error: deckError } = await supabase
      .from('decks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (deckError || !existingDeck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (tags !== undefined) updateData.tags = tags

    // Update the deck
    const { data: updatedDeck, error: updateError } = await supabase
      .from('decks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update deck:', updateError)
      return NextResponse.json({ error: 'Failed to update deck' }, { status: 500 })
    }

    return NextResponse.json({ success: true, deck: updatedDeck })

  } catch (error) {
    console.error('Deck update error:', error)
    return NextResponse.json({ error: 'Failed to update deck' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify deck ownership
    const { data: existingDeck, error: deckError } = await supabase
      .from('decks')
      .select('id, title')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (deckError || !existingDeck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Delete all cards in the deck first (CASCADE should handle this, but being explicit)
    const { error: cardsError } = await supabase
      .from('cards')
      .delete()
      .eq('deck_id', id)

    if (cardsError) {
      console.error('Failed to delete cards:', cardsError)
      return NextResponse.json({ error: 'Failed to delete deck cards' }, { status: 500 })
    }

    // Delete the deck
    const { error: deleteError } = await supabase
      .from('decks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Failed to delete deck:', deleteError)
      return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Deck deleted successfully' })

  } catch (error) {
    console.error('Deck deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 })
  }
}