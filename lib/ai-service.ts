import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface LanguageDeckRequest {
  targetLanguage: string
  nativeLanguage: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  cardCount: number
  learningFocus: 'vocabulary' | 'grammar' | 'phrases' | 'conversation' | 'mixed'
  topics?: string[]
  customTopic?: string
  includeAudio?: boolean
  includeCulture?: boolean
  includeGrammarNotes?: boolean
}

export interface LanguageCard {
  front: string
  back: string
  examples?: Array<{text: string, translation?: string} | string>
  tags?: string[]
  pronunciation?: string
  translation?: string
  wordType?: string
  grammarNotes?: string
  culturalContext?: string
  usageNotes?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  audioUrl?: string
  imageUrl?: string
  mnemonicHint?: string
  relatedWords?: string[]
  conjugations?: Record<string, string>
  synonyms?: string[]
  antonyms?: string[]
}

export interface LanguageDeck {
  title: string
  description: string
  cards: LanguageCard[]
  tags: string[]
  color: string
  targetLanguage: string
  proficiencyLevel: string
  createdAt: string
  metadata?: {
    targetLanguage: string
    nativeLanguage: string
    proficiencyLevel: string
    learningFocus: string
    totalCards: number
    estimatedStudyTime: string
    difficulty: string
  }
  studyTips?: string[]
  additionalResources?: {
    grammarReference: string
    vocabularyThemes: string[]
    practiceExercises: string
  }
}

const DECK_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
]

export class AILanguageLearningService {
  static async generateLanguageDeck(request: LanguageDeckRequest): Promise<LanguageDeck> {
    const {
      targetLanguage,
      nativeLanguage,
      proficiencyLevel,
      cardCount,
      learningFocus,
      topics = [],
      customTopic,
      includeAudio = false,
      includeCulture = false,
      includeGrammarNotes = false
    } = request

    const proficiencyDescriptions = {
      'A1': 'Beginner - Basic words and phrases for everyday situations',
      'A2': 'Elementary - Simple conversations and familiar topics',
      'B1': 'Intermediate - Express opinions and handle most travel situations',
      'B2': 'Upper-Intermediate - Understand complex texts and express ideas fluently',
      'C1': 'Advanced - Use language flexibly for social, academic, and professional purposes',
      'C2': 'Proficient - Near-native understanding and expression'
    }

    const focusDescriptions = {
      'vocabulary': 'Essential words and their meanings with context',
      'grammar': 'Grammar structures, rules, and practical usage',
      'phrases': 'Common expressions and idiomatic phrases',
      'conversation': 'Dialogue patterns and conversational skills',
      'mixed': 'Balanced combination of vocabulary, grammar, and phrases'
    }

    const userTopic = customTopic || learningFocus
    const isAdvanced = ['A2', 'B1', 'B2', 'C1', 'C2'].includes(proficiencyLevel)

    const systemPrompt = `You are an expert language learning flashcard creator. Create comprehensive flashcards for ${targetLanguage} learners at ${proficiencyLevel} level.

REQUIREMENTS:
- Return ONLY valid JSON
- Each card must include practical examples
- Include pronunciation guides when helpful
- Adapt difficulty to ${proficiencyLevel} level
- Focus on: ${focusDescriptions[learningFocus]}

${isAdvanced ? `Use ${targetLanguage} for card fronts.` : `Can use ${nativeLanguage} for clarification on card fronts.`}`

    const userPrompt = `Create ${cardCount} flashcards for "${userTopic}" in ${targetLanguage} for ${nativeLanguage} speakers (${proficiencyLevel} level).

Return ONLY valid JSON. Structure:
{
  "title": "Creative, engaging title with emoji that captures the essence of ${userTopic} learning",
  "description": "Detailed, motivational description (2-3 sentences) explaining what learners will master and why it's valuable for ${proficiencyLevel} level ${targetLanguage} learning",
  "cards": [
    {
      "front": "word/phrase in ${targetLanguage}",
      "translation": "${nativeLanguage} translation",
      "pronunciation": "phonetic guide",
      "wordType": "noun/verb/adjective/etc",
      "examples": [
        {"text": "example sentence in ${targetLanguage}", "translation": "${nativeLanguage} translation"},
        {"text": "another example in ${targetLanguage}", "translation": "${nativeLanguage} translation"}
      ],
      "grammarNotes": "grammar explanation if relevant",
      "usageNotes": "when/how to use",
      "mnemonicHint": "memory tip",
      "difficulty": "${proficiencyLevel === 'A1' || proficiencyLevel === 'A2' ? 'beginner' : proficiencyLevel === 'B1' || proficiencyLevel === 'B2' ? 'intermediate' : 'advanced'}",
      "culturalContext": "cultural notes if relevant",
      "relatedWords": ["word1", "word2"],
      "synonyms": ["synonym1"],
      "antonyms": ["antonym1"]
    }
  ],
  "tags": ["${targetLanguage.toLowerCase()}", "${proficiencyLevel.toLowerCase()}", "${userTopic.toLowerCase()}"]
}

Requirements:
- Create exactly ${cardCount} cards
- Keep responses concise
- Focus on ${learningFocus}
- Examples must be practical
- Include pronunciation for all words

TITLE GUIDELINES:
- Use relevant emoji (📚✈️🍕🏠💼🎵 etc.)
- Make it specific and engaging (not just "${userTopic}")
- Examples: "✈️ Master Travel Conversations", "🍕 Italian Food & Restaurant Essentials", "🏠 Home & Family Vocabulary Builder"

DESCRIPTION GUIDELINES:
- Explain the practical value and real-world applications
- Mention the proficiency level and learning focus
- Be motivational and specific about what learners will achieve
- Example: "Master essential travel vocabulary and phrases to confidently navigate airports, hotels, and tourist attractions. Perfect for ${proficiencyLevel} learners planning trips or working in tourism, these cards focus on practical conversations you'll actually use."`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 8000, // Increased for more comprehensive responses
        response_format: { type: "json_object" }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      let generatedData
      try {
        generatedData = JSON.parse(response)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', response)
        throw new Error('Invalid JSON response from AI')
      }

      // Map color name to hex
      const colorMap: Record<string, string> = {
        blue: "#3b82f6",
        emerald: "#10b981",
        amber: "#f59e0b",
        red: "#ef4444",
        violet: "#8b5cf6",
        cyan: "#06b6d4",
        orange: "#f97316",
        lime: "#84cc16"
      }

      // Process cards - keep only raw JSON data
      const enrichedCards = generatedData.cards?.map((card: any) => {
        // Ensure each card has at least front and translation
        if (!card.front || !card.translation) {
          console.error('Invalid card structure:', card)
          return null
        }

        return {
          front: card.front,
          back: card.translation, // Use simple translation as back
          examples: card.examples,
          translation: card.translation,
          pronunciation: card.pronunciation,
          wordType: card.wordType,
          grammarNotes: card.grammarNotes,
          usageNotes: card.usageNotes,
          difficulty: card.difficulty,
          mnemonicHint: card.mnemonicHint,
          culturalContext: card.culturalContext,
          relatedWords: card.relatedWords,
          synonyms: card.synonyms,
          antonyms: card.antonyms,
          conjugations: card.conjugations,
          tags: card.tags
        }
      }).filter(Boolean) || [] // Remove any null cards

      // Validate required fields
      if (!generatedData.title || !generatedData.cards || !Array.isArray(generatedData.cards)) {
        console.error('Invalid deck structure:', generatedData)
        throw new Error('Invalid deck structure from AI')
      }

      return {
        title: generatedData.title || `${userTopic} - ${targetLanguage}`,
        description: generatedData.description || `Learn ${userTopic} in ${targetLanguage}`,
        cards: enrichedCards,
        tags: generatedData.tags || [targetLanguage.toLowerCase(), proficiencyLevel.toLowerCase()],
        color: colorMap[generatedData.suggestedColor] || DECK_COLORS[0],
        targetLanguage,
        proficiencyLevel,
        createdAt: new Date().toISOString(),
        ...(generatedData.metadata && { metadata: generatedData.metadata }),
        ...(generatedData.studyTips && { studyTips: generatedData.studyTips }),
        ...(generatedData.additionalResources && { additionalResources: generatedData.additionalResources })
      }

    } catch (error) {
      console.error('AI deck generation failed:', error)
      throw new Error('Failed to generate deck. Please try again.')
    }
  }

  static async generateLanguageTopics(targetLanguage: string, proficiencyLevel: string): Promise<string[]> {
    const prompt = `For someone learning ${targetLanguage} at ${proficiencyLevel} level, suggest 8 practical topics that would make excellent flashcard decks for language learning.

Focus on topics that are:
- Practical for daily communication
- Appropriate for ${proficiencyLevel} proficiency level
- Cover essential vocabulary and phrases
- Relevant to real-world situations

Return a JSON object with a "topics" array of strings, each being a practical topic (2-4 words max).
Example: {"topics": ["Family & Relationships", "Food & Dining", "Travel & Transportation", "Work & Career", "Shopping & Money", "Health & Body", "Hobbies & Interests", "Weather & Seasons"]}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
        response_format: { type: "json_object" }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) return []

      const data = JSON.parse(response)
      return Array.isArray(data.topics) ? data.topics : []
    } catch (error) {
      console.error('Language topic suggestions failed:', error)
      return []
    }
  }

  // Generate additional cards for an existing deck with smart duplicate detection
  static async generateDeckCards(request: any): Promise<LanguageCard[]> {
    const {
      topic,
      deckTitle,
      deckDescription,
      deckTags,
      existingCards = [],
      existingCardCount,
      nativeLanguage,
      customInstructions,
      smartMode = false
    } = request

    // Analyze existing cards for patterns and themes
    const existingTopics = existingCards.map((card: any, i: number) =>
      `${i+1}. "${card.front}" → "${card.back.substring(0, 100)}${card.back.length > 100 ? '...' : ''}"`
    ).join('\n')

    // Determine optimal card count based on existing deck size and complexity
    const getOptimalCardCount = (existingCount: number): number => {
      if (existingCount === 0) return 10  // New deck
      if (existingCount < 10) return 8    // Small deck - add more
      if (existingCount < 20) return 6    // Medium deck - moderate addition
      if (existingCount < 50) return 4    // Large deck - focused addition
      return 3                           // Very large deck - minimal addition
    }

    const optimalCardCount = getOptimalCardCount(existingCardCount)

    const systemPrompt = `You are an expert educational content creator with advanced duplicate detection capabilities. You're adding cards to the existing "${deckTitle}" deck.

CURRENT DECK ANALYSIS:
- Deck Title: "${deckTitle}"
- Description: "${deckDescription || 'No description'}"
- Tags: [${deckTags.join(', ')}]
- Existing Cards: ${existingCardCount}
- Native Language: ${nativeLanguage}
- Topic Focus: "${topic}"

EXISTING CARD ANALYSIS (MUST AVOID DUPLICATING):
${existingCards.length > 0 ? existingTopics : 'No existing cards - this is a new deck'}

SMART GENERATION REQUIREMENTS:
1. DUPLICATE PREVENTION: Analyze all existing cards thoroughly
2. COMPLEMENTARY CONTENT: Fill gaps and expand on existing themes
3. OPTIMAL QUANTITY: Create exactly ${optimalCardCount} cards (AI-determined optimal amount)
4. CONSISTENT DIFFICULTY: Match the complexity level of existing cards
5. THEMATIC COHERENCE: Ensure cards fit the deck's learning objectives
6. PROGRESSIVE LEARNING: Build upon concepts already covered

${customInstructions ? `CUSTOM INSTRUCTIONS: "${customInstructions}"` : ''}

Return ONLY valid JSON.`

    const userPrompt = `Create ${optimalCardCount} flashcards for "${topic}" that perfectly complement the existing "${deckTitle}" deck.

CRITICAL: Review all ${existingCardCount} existing cards to ensure zero duplication. Focus on memory challenges and difficult concepts that enhance learning.

Return ONLY valid JSON. Structure:
{
  "cards": [
    {
      "front": "word/phrase/question",
      "translation": "${nativeLanguage} translation",
      "pronunciation": "phonetic guide",
      "wordType": "noun/verb/adjective/etc",
      "examples": [
        {"text": "example sentence", "translation": "${nativeLanguage} translation"},
        {"text": "another example", "translation": "${nativeLanguage} translation"}
      ],
      "grammarNotes": "grammar explanation if relevant",
      "usageNotes": "when/how to use",
      "mnemonicHint": "memory tip",
      "culturalContext": "cultural notes if relevant",
      "relatedWords": ["word1", "word2"],
      "synonyms": ["synonym1"],
      "antonyms": ["antonym1"]
    }
  ]
}

ANKI PRINCIPLES FOR THESE CARDS:
- ONE concept per card (atomic learning)
- Focus on what's hard to remember
- Simple, testable questions
- Minimal but sufficient answers
- Target genuine memory challenges

CARD TYPES TO PRIORITIZE:
1. Tricky vocabulary (false friends, similar words)
2. Grammar patterns that are hard to remember
3. Cloze deletions with context
4. Reverse vocabulary tests
5. Pronunciation of difficult sounds
6. Gender/article assignments
7. Preposition usage challenges

Requirements:
- Create exactly ${optimalCardCount} cards
- Keep responses concise
- Examples must be practical

${customInstructions ? `Additional focus: ${customInstructions}` : 'Focus on memory challenges and difficult-to-remember concepts.'}

Generate exactly ${optimalCardCount} atomic, memory-optimized flashcards that complement the existing deck without duplication.`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from OpenAI')

      const generatedData = JSON.parse(response)

      // Process cards - keep only raw JSON data
      const processedCards = generatedData.cards?.map((card: any) => {
        if (!card.front || !card.translation) return null

        return {
          front: card.front,
          back: card.translation, // Use simple translation as back
          examples: card.examples,
          translation: card.translation,
          pronunciation: card.pronunciation,
          wordType: card.wordType,
          grammarNotes: card.grammarNotes,
          usageNotes: card.usageNotes,
          difficulty: card.difficulty,
          mnemonicHint: card.mnemonicHint,
          culturalContext: card.culturalContext,
          relatedWords: card.relatedWords,
          synonyms: card.synonyms,
          antonyms: card.antonyms,
          conjugations: card.conjugations,
          tags: card.tags
        }
      }).filter(Boolean) || []

      return processedCards

    } catch (error) {
      console.error('AI card generation failed:', error)
      throw new Error('Failed to generate cards. Please try again.')
    }
  }

}
