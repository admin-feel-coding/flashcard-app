"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { 
  Languages, 
  Globe, 
  Loader2, 
  BookOpen, 
  MessageCircle,
  Brain,
  CheckCircle,
  Sparkles
} from "lucide-react"

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
]

const NATIVE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
]

const PROFICIENCY_LEVELS = [
  { 
    value: 'A1', 
    label: 'A1 - Beginner', 
    description: 'Basic words and phrases',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  { 
    value: 'A2', 
    label: 'A2 - Elementary', 
    description: 'Simple conversations',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  { 
    value: 'B1', 
    label: 'B1 - Intermediate', 
    description: 'Express opinions, travel situations',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  { 
    value: 'B2', 
    label: 'B2 - Upper-Intermediate', 
    description: 'Complex texts, fluent expression',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  { 
    value: 'C1', 
    label: 'C1 - Advanced', 
    description: 'Flexible use for all purposes',
    color: 'bg-red-100 text-red-800 border-red-300'
  },
  { 
    value: 'C2', 
    label: 'C2 - Proficient', 
    description: 'Near-native fluency',
    color: 'bg-red-100 text-red-800 border-red-300'
  },
] as const

const LEARNING_FOCUS = [
  { 
    value: 'vocabulary', 
    label: 'Vocabulary', 
    description: 'Essential words and meanings',
    icon: BookOpen 
  },
  { 
    value: 'grammar', 
    label: 'Grammar', 
    description: 'Rules and structures',
    icon: Brain 
  },
  { 
    value: 'phrases', 
    label: 'Phrases', 
    description: 'Common expressions',
    icon: MessageCircle 
  },
  { 
    value: 'conversation', 
    label: 'Conversation', 
    description: 'Dialogue patterns',
    icon: Languages 
  },
  { 
    value: 'mixed', 
    label: 'Mixed', 
    description: 'Balanced combination',
    icon: Globe 
  },
] as const

export function AILanguageGenerator() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [targetLanguage, setTargetLanguage] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState("English")
  const [proficiencyLevel, setProficiencyLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A2')
  const [cardCount, setCardCount] = useState(20)
  const [learningFocus, setLearningFocus] = useState<'vocabulary' | 'grammar' | 'phrases' | 'conversation' | 'mixed'>('vocabulary')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([])
  const [customTopic, setCustomTopic] = useState("")
  const [includeGrammarNotes, setIncludeGrammarNotes] = useState(false)
  const [includeCulture, setIncludeCulture] = useState(false)
  
  const router = useRouter()

  // Load topic suggestions when language/level changes
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!targetLanguage) return

      try {
        const response = await fetch(`/api/ai/generate-deck?targetLanguage=${encodeURIComponent(targetLanguage)}&proficiencyLevel=${proficiencyLevel}`)
        const data = await response.json()
        setTopicSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Failed to load topic suggestions:', error)
      }
    }

    const timeoutId = setTimeout(loadSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [targetLanguage, proficiencyLevel])

  // Progress simulation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 10
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
          nativeLanguage,
          proficiencyLevel,
          cardCount,
          learningFocus,
          topics: selectedTopics.length > 0 ? selectedTopics : undefined,
          customTopic: customTopic.trim() || undefined,
          includeGrammarNotes,
          includeCulture,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate language deck')
      }

      setProgress(100)
      
      // Success - close dialog and refresh
      setTimeout(() => {
        setOpen(false)
        resetForm()
        router.refresh()
      }, 1000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate language deck')
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    }
  }

  const resetForm = () => {
    setStep(1)
    setTargetLanguage("")
    setNativeLanguage("English")
    setProficiencyLevel('A2')
    setCardCount(20)
    setLearningFocus('vocabulary')
    setSelectedTopics([])
    setTopicSuggestions([])
    setCustomTopic("")
    setIncludeGrammarNotes(false)
    setIncludeCulture(false)
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
          <Languages className="w-4 h-4 mr-2" />
          AI Language Cards
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-6 h-6 text-blue-600" />
            AI Language Learning Generator
          </DialogTitle>
          <DialogDescription>
            Create personalized flashcards for language learning with AI-powered content, pronunciation guides, and cultural context.
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          // Generation Progress
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-spin opacity-20"></div>
                <Languages className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Creating Your Language Deck</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Generating {targetLanguage} flashcards tailored for {proficiencyLevel} level...
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 dark:text-gray-300">
              <div className="flex flex-col items-center gap-2">
                <Globe className={`w-6 h-6 ${progress > 20 ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Analyzing Language</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookOpen className={`w-6 h-6 ${progress > 60 ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Creating Content</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className={`w-6 h-6 ${progress > 95 ? 'text-green-600' : 'text-gray-400'}`} />
                <span>Adding Context</span>
              </div>
            </div>

            {progress === 100 && (
              <div className="text-center text-green-600 font-medium">
                ✨ Language deck generated successfully! 
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Language Selection */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Target Language */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What language do you want to learn?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {POPULAR_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTargetLanguage(lang.name)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          targetLanguage === lang.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Or type another language..."
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Native Language */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What's your native language?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {NATIVE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setNativeLanguage(lang.name)}
                        className={`p-2 border rounded-lg text-sm transition-all ${
                          nativeLanguage === lang.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!targetLanguage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Level & Focus */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Learning: {targetLanguage} → {nativeLanguage}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Let's customize your learning experience
                  </p>
                </div>

                {/* Proficiency Level */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Your Current Level</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setProficiencyLevel(level.value)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          proficiencyLevel === level.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={level.color}>
                            {level.value}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {level.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Focus */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Learning Focus</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LEARNING_FOCUS.map((focus) => (
                      <button
                        key={focus.value}
                        type="button"
                        onClick={() => setLearningFocus(focus.value)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          learningFocus === focus.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <focus.icon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{focus.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {focus.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Topics & Settings */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Card Count */}
                <div className="space-y-2">
                  <Label htmlFor="cardCount" className="text-base font-medium">
                    Number of Cards: {cardCount}
                  </Label>
                  <input
                    id="cardCount"
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>30</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Topic Suggestions */}
                {topicSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Suggested Topics (Optional)
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Select topics to focus on specific vocabulary areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topicSuggestions.map((topic) => (
                        <Badge
                          key={topic}
                          variant={selectedTopics.includes(topic) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTopic(topic)}
                        >
                          {topic} {selectedTopics.includes(topic) ? '✓' : '+'}
                        </Badge>
                      ))}
                    </div>
                    {selectedTopics.length > 0 && (
                      <p className="text-xs text-blue-600">
                        {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                {/* Custom Learning Topic */}
                <div className="space-y-3">
                  <Label htmlFor="customTopic" className="text-base font-medium">
                    Custom Learning Request (Optional)
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Specify exactly what you want to learn (e.g., "10 modal verbs", "past perfect tense", "Toronto slang")
                  </p>
                  <Input
                    id="customTopic"
                    placeholder="e.g., 10 modal verbs most used, past perfect, Toronto slang..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full"
                  />
                  {customTopic && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Sparkles className="w-4 h-4" />
                      <span>AI will focus specifically on: "{customTopic}"</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Features */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Enhanced Features</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGrammarNotes}
                        onChange={(e) => setIncludeGrammarNotes(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Include grammar explanations</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCulture}
                        onChange={(e) => setIncludeCulture(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Include cultural context</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Language Deck
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}