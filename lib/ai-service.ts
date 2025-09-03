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
  back: string // Now contains structured HTML content
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

    const systemPrompt = `Create 10 ${targetLanguage} flashcards about: "${userTopic}"

REQUIREMENTS:
- Each card MUST have exactly 2 examples
- Examples MUST be different sentences
- Examples MUST show real usage
- Include pronunciation, translation, usage notes

${isAdvanced ? `Use ${targetLanguage} for questions.` : `Can use ${nativeLanguage} for questions.`}

Return JSON only.`

    const userPrompt = `Create 10 flashcards about "${userTopic}" in ${targetLanguage}.

CRITICAL: Every card MUST have exactly 2 examples.

Card structure MUST be:
{
  "front": "simple trigger word",
  "back": "<div class='card-back'><div class='translation'><strong>Translation:</strong> answer</div><div class='pronunciation'><strong>Pronunciation:</strong> /sound/</div><div class='examples'><strong>Examples:</strong><ul><li>First example sentence → Translation</li><li>Second example sentence → Translation</li></ul></div><div class='usage'><strong>Usage:</strong> When/how to use</div></div>"
}

Examples:
- Phrasal verbs: "get up" → 2 different sentences showing usage
- Travel: "airport" → 2 different airport situations  
- Cooking: "boil" → 2 different cooking contexts

JSON response:
{
  "title": "[Emoji] ${userTopic} title",
  "description": "Learn ${userTopic}",
  "cards": [...10 cards with 2 examples each...],
  "tags": ["${targetLanguage.toLowerCase()}", "${proficiencyLevel.toLowerCase()}", "${userTopic.toLowerCase()}"],
  "suggestedColor": "blue"
}

MANDATORY: 2 examples per card. No exceptions.`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const generatedData = JSON.parse(response)
      
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

      return {
        title: generatedData.title,
        description: generatedData.description,
        cards: generatedData.cards,
        tags: generatedData.tags,
        color: colorMap[generatedData.suggestedColor] || DECK_COLORS[0],
        targetLanguage,
        proficiencyLevel,
        createdAt: new Date().toISOString()
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

    const systemPrompt = `You are an expert educational content creator with advanced duplicate detection capabilities. You're adding cards to the existing "${deckTitle}" deck using the same format structure as existing cards.

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
7. FORMAT CONSISTENCY: Use the same HTML structure as the deck creation wizard

CARD FORMAT REQUIREMENTS:
- Front: Simple, clear target language content
- Back: Rich HTML structure with multiple learning sections
- Use proper HTML structure with CSS classes: card-back, main-answer, pronunciation, word-type, examples, grammar, culture, usage
- Include sections that enhance learning: pronunciation guides, example sentences, grammar notes, cultural context

${customInstructions ? `CUSTOM INSTRUCTIONS: "${customInstructions}"` : ''}

Return JSON with exactly ${optimalCardCount} cards:
{
  "cards": [
    {
      "front": "Target language content (word/phrase/sentence)",
      "back": "HTML-formatted structured answer matching deck creation format"
    }
  ],
  "rationale": "Brief explanation of how these cards complement existing content"
}`

    const userPrompt = `Create ${optimalCardCount} ANKI-STYLE flashcards for "${topic}" that perfectly complement the existing "${deckTitle}" deck.

CRITICAL: Review all ${existingCardCount} existing cards to ensure zero duplication. Focus on memory challenges and difficult concepts that enhance learning.

ANKI PRINCIPLES FOR THESE CARDS:
- ONE concept per card (atomic learning)
- Focus on what's hard to remember
- Simple, testable questions
- Minimal but sufficient answers
- Target genuine memory challenges

RICH HTML FORMAT (match existing deck style):
<div class="card-back">
  <div class="translation"><strong>Translation:</strong> [Primary answer/translation]</div>
  <div class="pronunciation"><strong>Pronunciation:</strong> [Phonetic pronunciation when helpful]</div>
  <div class="word-type"><strong>Type:</strong> [Part of speech: noun, verb, adjective, etc.]</div>
  <div class="examples"><strong>Examples:</strong>
    <ul>
      <li>[Example sentence in context → Translation]</li>
      <li>[Additional example if needed → Translation]</li>
    </ul>
  </div>
  <div class="grammar"><strong>Grammar:</strong> [Grammar notes for difficult patterns]</div>
  <div class="culture"><strong>Culture:</strong> [Cultural context when relevant]</div>
  <div class="usage"><strong>Usage:</strong> [Usage notes for tricky words]</div>
</div>

CARD TYPES TO PRIORITIZE:
1. Tricky vocabulary (false friends, similar words)
2. Grammar patterns that are hard to remember
3. Cloze deletions with context
4. Reverse vocabulary tests
5. Pronunciation of difficult sounds
6. Gender/article assignments
7. Preposition usage challenges

EXAMPLE RICH FORMATS:
Vocabulary: Front: "gato" → Back: "<div class='card-back'><div class='translation'><strong>Translation:</strong> cat</div><div class='pronunciation'><strong>Pronunciation:</strong> /ˈɡato/</div><div class='word-type'><strong>Type:</strong> noun (masculine)</div><div class='examples'><strong>Examples:</strong><ul><li>El gato está durmiendo → The cat is sleeping</li></ul></div></div>"

Cloze: Front: "Je _____ français" → Back: "<div class='card-back'><div class='translation'><strong>Translation:</strong> parle</div><div class='grammar'><strong>Grammar:</strong> 1st person singular of 'parler'</div><div class='examples'><strong>Examples:</strong><ul><li>Je parle français → I speak French</li></ul></div></div>"

Idiomatic: Front: "take with a grain of salt" → Back: "<div class='card-back'><div class='translation'><strong>Translation:</strong> tomar algo con cautela</div><div class='pronunciation'><strong>Pronunciation:</strong> /tə teɪk ˈsʌmθɪŋ wɪð ə ɡreɪn əv sɔlt/</div><div class='word-type'><strong>Type:</strong> idiomatic expression</div><div class='examples'><strong>Examples:</strong><ul><li>You should take his advice with a grain of salt → Deberías tomar su consejo con cautela</li></ul></div><div class='usage'><strong>Usage:</strong> Use when suggesting skepticism about something</div></div>"

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
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const generatedData = JSON.parse(response)
      return generatedData.cards || []

    } catch (error) {
      console.error('AI card generation failed:', error)
      throw new Error('Failed to generate cards. Please try again.')
    }
  }

  // Keep the old method for backwards compatibility but rename the class
  static async generateTopicSuggestions(query: string): Promise<string[]> {
    return await this.generateLanguageTopics(query, 'B1')
  }
}
