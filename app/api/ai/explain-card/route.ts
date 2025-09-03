import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cardFront, cardBack, deckTitle } = await request.json()
    
    if (!cardFront || !cardBack) {
      return NextResponse.json({ error: 'Card front and back are required' }, { status: 400 })
    }

    const systemPrompt = `You are a helpful language learning tutor. Provide short, practical explanations with real examples.`

    const userPrompt = `Explain this flashcard simply and naturally:

FRONT: "${cardFront}"
BACK: ${cardBack}
DECK: ${deckTitle || 'Language Learning'}

Write a helpful explanation using natural markdown formatting. Include:
- A brief explanation of the concept  
- A memory tip to help remember it
- 4 realistic conversation examples with translations

Structure examples like this for clean formatting:
- "Short natural sentence" → "Natural translation"
- "Another realistic example" → "Clean translation"

Use headings with emojis (### 💡 Quick explanation), **bold text**, and keep examples concise and conversational. Make it minimalist and easy to scan.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "text" },
    })

    const explanation = completion.choices[0]?.message?.content

    if (!explanation) {
      throw new Error('No explanation generated')
    }

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('AI explanation error:', error)
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 })
  }
}