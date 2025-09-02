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

    const systemPrompt = `You are an expert language teacher specializing in creating effective flashcards for language learning. Your goal is to create cards that help students progress naturally from their current proficiency level.

LANGUAGE LEARNING PRINCIPLES:
1. Present new content in context with real-world examples
2. Include pronunciation guides when helpful for learners
3. Provide practical usage scenarios
4. Connect to cultural context when relevant
5. Build on existing knowledge progressively
6. Use spaced repetition-friendly format

PROFICIENCY LEVEL: ${proficiencyLevel} - ${proficiencyDescriptions[proficiencyLevel]}
LEARNING FOCUS: ${learningFocus} - ${focusDescriptions[learningFocus]}

CARD DESIGN RULES:
- FRONT: Present target language content (word, phrase, sentence, or grammar concept)
- BACK: Provide ${nativeLanguage} translation/explanation plus contextual information
- Include pronunciation in IPA or simplified phonetics when helpful
- Add example sentences showing practical usage
- Include grammar notes for complex structures
- Add cultural context when it aids understanding

FOCUS-SPECIFIC GUIDELINES:
${learningFocus === 'vocabulary' ? `
- Present words with gender/article where applicable
- Include common collocations and word families
- Show different meanings in various contexts
` : ''}
${learningFocus === 'grammar' ? `
- Explain grammar rules clearly with examples
- Show correct vs incorrect usage
- Include conjugations or declensions where relevant
` : ''}
${learningFocus === 'phrases' ? `
- Present phrases in natural contexts
- Show when and how to use each phrase
- Include variations and alternatives
` : ''}
${learningFocus === 'conversation' ? `
- Present dialogue patterns and responses
- Include formal vs informal variations
- Show appropriate situations for each expression
` : ''}

Generate exactly ${cardCount} flashcards for learning ${targetLanguage} at ${proficiencyLevel} level.`

    let topicsText = ''
    if (customTopic) {
      topicsText = `SPECIFIC LEARNING REQUEST: Focus specifically on "${customTopic}". Create cards that directly teach this concept.`
    } else if (topics.length > 0) {
      topicsText = `Focus on these topics: ${topics.join(', ')}.`
    } else {
      topicsText = 'Cover general, practical vocabulary and expressions suitable for daily life.'
    }

    const userPrompt = `Create language learning flashcards with ANKI-STYLE structured backs. Each card back should be well-organized with clear sections.

TARGET LANGUAGE: ${targetLanguage}
NATIVE LANGUAGE: ${nativeLanguage}
PROFICIENCY LEVEL: ${proficiencyLevel} 
LEARNING FOCUS: ${learningFocus}
NUMBER OF CARDS: ${cardCount}
${topicsText}

CARD STRUCTURE REQUIREMENTS:
- Front: Simple, clear target language content
- Back: Structured with multiple sections using HTML formatting

Return JSON with:
{
  "title": "Engaging deck title in ${nativeLanguage} (max 60 chars)",
  "description": "Brief description of what students will learn (max 150 chars)", 
  "cards": [
    {
      "front": "Target language content (word/phrase/sentence)",
      "back": "HTML-formatted structured answer with sections"
    }
  ],
  "tags": ["${targetLanguage.toLowerCase()}", "${proficiencyLevel.toLowerCase()}", "${learningFocus}"],
  "suggestedColor": "blue, emerald, amber, red, violet, cyan, orange, or lime"
}

BACK STRUCTURE TEMPLATE (use HTML):
<div class="card-back">
  <div class="translation"><strong>Translation:</strong> [Main translation]</div>
  <div class="pronunciation"><strong>Pronunciation:</strong> [IPA or phonetic guide]</div>
  <div class="word-type"><strong>Type:</strong> [noun/verb/adjective/etc.]</div>
  <div class="examples">
    <strong>Examples:</strong>
    <ul>
      <li>[Example 1 in target language] → [Translation]</li>
      <li>[Example 2 in target language] → [Translation]</li>
    </ul>
  </div>
  ${includeGrammarNotes ? '<div class="grammar"><strong>Grammar Notes:</strong> [Grammar explanation]</div>' : ''}
  ${includeCulture ? '<div class="culture"><strong>Cultural Note:</strong> [Cultural context]</div>' : ''}
  <div class="usage"><strong>Usage:</strong> [When/how to use this]</div>
</div>

EXAMPLE CARDS:

VOCABULARY CARD:
Front: "el médico"
Back: "<div class='card-back'><div class='translation'><strong>Translation:</strong> the doctor</div><div class='pronunciation'><strong>Pronunciation:</strong> /el ˈme.ði.ko/</div><div class='word-type'><strong>Type:</strong> masculine noun</div><div class='examples'><strong>Examples:</strong><ul><li>El médico está en el hospital → The doctor is at the hospital</li><li>Necesito ver al médico → I need to see the doctor</li></ul></div><div class='usage'><strong>Usage:</strong> General term for doctor, used in formal and informal contexts</div></div>"

GRAMMAR CARD:
Front: "How do you form the past tense with 'haber'?"
Back: "<div class='card-back'><div class='translation'><strong>Answer:</strong> Present perfect = haber (present) + past participle</div><div class='examples'><strong>Examples:</strong><ul><li>He comido → I have eaten</li><li>Has vivido → You have lived</li><li>Han estudiado → They have studied</li></ul></div><div class='grammar'><strong>Formation:</strong> he/has/ha/hemos/habéis/han + -ado/-ido endings</div><div class='usage'><strong>Usage:</strong> Actions completed in the recent past or with current relevance</div></div>"

PHRASE CARD:
Front: "¿Cómo estás?"
Back: "<div class='card-back'><div class='translation'><strong>Translation:</strong> How are you?</div><div class='pronunciation'><strong>Pronunciation:</strong> /ˈko.mo es.ˈtas/</div><div class='examples'><strong>Common Responses:</strong><ul><li>Muy bien, gracias → Very well, thanks</li><li>Bien, ¿y tú? → Good, and you?</li></ul></div><div class='usage'><strong>Usage:</strong> Informal greeting, use with friends, family, peers</div><div class='culture'><strong>Cultural Note:</strong> More personal than '¿Qué tal?' - shows genuine interest</div></div>"

Create authentic, practical content that helps students communicate naturally. Each card should teach something immediately useful for real-world ${targetLanguage} communication.

IMPORTANT: 
- Use proper HTML structure in the "back" field
- Make content rich but well-organized  
- Include practical examples students can use immediately
- Adjust complexity to ${proficiencyLevel} level

Generate exactly ${cardCount} flashcards for learning ${targetLanguage} at ${proficiencyLevel} level.`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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
        proficiencyLevel
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
        model: "gpt-4o-mini",
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

QUALITY STANDARDS:
- Front: Clear, specific questions/prompts
- Back: Comprehensive answers with context
- NO repetition of existing card concepts
- Educational progression that enhances learning
- Appropriate depth for the deck's apparent level

${customInstructions ? `CUSTOM INSTRUCTIONS: "${customInstructions}"` : ''}

Return JSON with exactly ${optimalCardCount} cards:
{
  "cards": [
    {
      "front": "Unique question/prompt not covered in existing cards",
      "back": "Comprehensive answer that adds new value"
    }
  ],
  "rationale": "Brief explanation of how these cards complement existing content"
}`

    const userPrompt = `Create ${optimalCardCount} intelligent flashcards for "${topic}" that perfectly complement the existing "${deckTitle}" deck.

CRITICAL: Review all ${existingCardCount} existing cards to ensure zero duplication. Focus on gaps, extensions, and related concepts that enhance the learning experience.

${customInstructions ? `Additional focus: ${customInstructions}` : 'Create the most valuable additions possible.'}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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
