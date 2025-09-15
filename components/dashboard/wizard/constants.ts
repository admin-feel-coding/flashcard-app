export const ALL_LANGUAGES = [
  // Popular first 6
  { code: 'en', name: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', flag: '🇮🇹', popular: true },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', popular: true },

  // Other languages
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: false },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: false },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', popular: false },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: false },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: false },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: false },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', popular: false },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', popular: false },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', popular: false },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', popular: false },
  { code: 'da', name: 'Danish', flag: '🇩🇰', popular: false },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', popular: false },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', popular: false },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', popular: false },
  { code: 'th', name: 'Thai', flag: '🇹🇭', popular: false },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', popular: false },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', popular: false },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', popular: false },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', popular: false },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', popular: false },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', popular: false },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', popular: false },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', popular: false },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', popular: false },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', popular: false },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', popular: false },
  { code: 'el', name: 'Greek', flag: '🇬🇷', popular: false },
]

export const NATIVE_LANGUAGES = [
  // Popular first 6
  { code: 'en', name: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', flag: '🇮🇹', popular: true },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', popular: true },

  // Other languages
  { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: false },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', popular: false },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: false },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: false },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: false },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: false },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', popular: false },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', popular: false },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', popular: false },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', popular: false },
  { code: 'da', name: 'Danish', flag: '🇩🇰', popular: false },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', popular: false },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', popular: false },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', popular: false },
  { code: 'th', name: 'Thai', flag: '🇹🇭', popular: false },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', popular: false },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', popular: false },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', popular: false },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', popular: false },
  { code: 'el', name: 'Greek', flag: '🇬🇷', popular: false },
]

export const PROFICIENCY_LEVELS = [
  {
    value: 'A1',
    label: 'A1 - Beginner',
    description: 'I know basic words and phrases',
    color: 'from-green-500 to-emerald-500',
  },
  {
    value: 'A2',
    label: 'A2 - Elementary',
    description: 'I can have simple conversations',
    color: 'from-lime-500 to-green-500',
  },
  {
    value: 'B1',
    label: 'B1 - Intermediate',
    description: 'I can express opinions and handle travel',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    value: 'B2',
    label: 'B2 - Upper-Intermediate',
    description: 'I understand complex texts',
    color: 'from-orange-500 to-red-500',
  },
  {
    value: 'C1',
    label: 'C1 - Advanced',
    description: 'I use the language flexibly',
    color: 'from-red-500 to-pink-500',
  },
  {
    value: 'C2',
    label: 'C2 - Proficient',
    description: 'I have near-native fluency',
    color: 'from-purple-500 to-indigo-500',
  },
]

export const LEARNING_FOCUS_OPTIONS = [
  // Popular first 4
  { id: 'travel', name: 'Travel & Adventure', icon: '✈️', description: 'Memory challenges: phrases, cultural cues, tricky expressions', popular: true },
  { id: 'business', name: 'Professional Success', icon: '💼', description: 'Formal/informal distinctions, business idioms, tricky vocabulary', popular: true },
  { id: 'social', name: 'Social Connections', icon: '💬', description: 'Slang vs formal, regional variations, conversation nuances', popular: true },
  { id: 'academic', name: 'Academic Excellence', icon: '🎓', description: 'Complex grammar, formal register, difficult academic vocabulary', popular: true },

  // Additional options
  { id: 'food', name: 'Food & Cooking', icon: '🍳', description: 'Culinary terms, restaurant vocabulary, cooking methods', popular: false },
  { id: 'medical', name: 'Health & Medical', icon: '🏥', description: 'Medical terminology, symptoms, body parts, health concerns', popular: false },
  { id: 'technology', name: 'Technology & Digital', icon: '💻', description: 'Tech vocabulary, social media, digital communication', popular: false },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', description: 'Sports terminology, fitness vocabulary, competition terms', popular: false },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨', description: 'Art vocabulary, cultural expressions, creative terms', popular: false },
  { id: 'finance', name: 'Money & Finance', icon: '💰', description: 'Banking terms, investment vocabulary, financial concepts', popular: false },
  { id: 'family', name: 'Family & Relationships', icon: '👨‍👩‍👧‍👦', description: 'Family terms, relationship vocabulary, emotions', popular: false },
  { id: 'nature', name: 'Nature & Environment', icon: '🌳', description: 'Environmental terms, weather, animals, plants', popular: false },
  { id: 'shopping', name: 'Shopping & Commerce', icon: '🛒', description: 'Retail vocabulary, clothing, prices, transactions', popular: false },
  { id: 'transportation', name: 'Transportation', icon: '🚗', description: 'Vehicle types, directions, public transport, traffic', popular: false },
  { id: 'entertainment', name: 'Entertainment & Media', icon: '🎬', description: 'Movies, music, books, games, entertainment vocabulary', popular: false },
  { id: 'education', name: 'Education & Learning', icon: '📚', description: 'School terms, educational concepts, learning vocabulary', popular: false },
]

export function getLanguageFlag(languageName: string): string {
  const allLanguages = [...ALL_LANGUAGES, ...NATIVE_LANGUAGES]
  const language = allLanguages.find(lang => lang.name === languageName)
  return language?.flag || '🌐'
}
