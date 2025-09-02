# AI-Powered Language Learning Setup

## 🌍 Language Learning Focus

This flashcard app is specifically designed for **language learning** with AI-powered content generation that includes pronunciation guides, grammar explanations, cultural context, and CEFR-aligned difficulty levels.

## 🔑 Environment Variables Required

Add this to your `.env.local` file:

\`\`\`bash
# OpenAI API Key (required for AI deck generation)
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### Getting Your OpenAI API Key:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it in your `.env.local` file

## 🎯 Features Implemented

### ✅ **Language Learning AI Service** (`lib/ai-service.ts`)
- **CEFR Levels**: A1, A2, B1, B2, C1, C2 proficiency levels
- **Learning Focus**: Vocabulary, Grammar, Phrases, Conversation, or Mixed
- **Language Pairs**: Any target language with native language support
- **Enhanced Content**: Pronunciation guides, grammar notes, cultural context
- **Smart Prompting**: Uses GPT-4o-mini for language-specific content generation

### ✅ **API Integration** (`app/api/ai/generate-deck/route.ts`)
- **POST /api/ai/generate-deck**: Generate complete decks
- **GET /api/ai/generate-deck**: Topic suggestions
- **Error Handling**: Rate limiting, API key validation
- **Database Integration**: Automatic deck and card saving

### ✅ **Language Learning UI** (`components/dashboard/ai-language-generator.tsx`)
- **Three-Step Process**: Language Selection → Level & Focus → Topics & Settings
- **Language Selection**: Popular languages with flag icons
- **CEFR Level Selection**: Visual proficiency level picker
- **Learning Focus**: Vocabulary, Grammar, Phrases, Conversation options
- **Topic Suggestions**: AI-generated relevant topics for each language
- **Enhanced Features**: Grammar notes and cultural context toggles

### ✅ **Dashboard Integration**
- **AI Language Button**: Blue gradient "AI Language Cards" button
- **Language-focused Empty State**: Promotes language learning benefits
- **Seamless Workflow**: Generated decks appear instantly with language tags

## 🔄 Language Learning Workflow

1. **Language Selection**: Choose target language (Spanish, French, German, etc.) and native language
2. **Proficiency Level**: Select CEFR level (A1-C2) matching current ability
3. **Learning Focus**: Choose vocabulary, grammar, phrases, conversation, or mixed
4. **Customization**: Set card count (10-50), select topics, enable enhanced features
5. **AI Processing**: 
   - Analyzes language pair and proficiency requirements
   - Generates contextual vocabulary and phrases
   - Adds pronunciation guides and examples
   - Includes grammar explanations when relevant
   - Provides cultural context and usage notes
6. **Database Storage**: Saves deck with language-specific tags
7. **Instant Access**: Ready-to-study language deck appears in dashboard

## 🗣️ Language Learning Examples

**Vocabulary Card (Spanish A2):**
- Front: "la biblioteca"
- Back: "the library"
- Pronunciation: "la bee-blee-oh-TEH-kah"
- Example: "Voy a la biblioteca para estudiar. - I'm going to the library to study."

**Grammar Card (French B1):**
- Front: "Comment utilise-t-on le subjonctif?"
- Back: "Subjunctive mood: Used after expressions of doubt, emotion, or necessity"
- Example: "Il faut que tu viennes. - It's necessary that you come."
- Grammar Note: "Triggered by 'il faut que', 'je doute que', 'je suis content que'"

**Cultural Context Card (Japanese A1):**
- Front: "いただきます"
- Back: "Expression before eating (literally: I humbly receive)"
- Pronunciation: "itadakimasu"
- Cultural Note: "Always said before meals to show gratitude to those who prepared the food"

## 🔧 Technical Specifications

- **AI Model**: GPT-4o-mini for high-quality generation and JSON support
- **Consistent Model**: Same model for both deck generation and topic suggestions
- **Rate Limiting**: Built-in retry logic
- **Card Limits**: 5-50 cards per deck
- **Response Format**: Structured JSON for consistency
- **Security**: Server-side API key protection

## 🚀 Usage

1. **Setup Environment**: Add OpenAI API key to `.env.local`
2. **Access Feature**: Click "AI Language Cards" button on dashboard
3. **Select Languages**: Choose target language and your native language
4. **Set Level**: Pick your CEFR proficiency level (A1-C2)
5. **Choose Focus**: Select vocabulary, grammar, phrases, or conversation
6. **Customize**: Pick topics, card count, and enhanced features
7. **Generate**: AI creates personalized language flashcards
8. **Study**: Learn with pronunciation, context, and cultural insights

## 💡 Pro Tips for Language Learning

- **Start Appropriate**: A1-A2 for beginners, B1-B2 for intermediate
- **Focus Selection**: Use "Vocabulary" for beginners, "Mixed" for balanced learning
- **Topic Selection**: Choose 2-3 relevant topics for focused learning
- **Enable Features**: Turn on grammar notes and cultural context for deeper understanding
- **Optimal Card Count**: 15-20 cards for daily study sessions
- **Popular Languages**: Spanish, French, German have the most refined content
- **Practice Regularly**: Use spaced repetition for maximum retention

The AI system creates authentic, contextual language content that prepares you for real-world communication! 🌍✨
