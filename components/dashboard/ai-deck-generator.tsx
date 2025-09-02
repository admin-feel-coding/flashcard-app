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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  Brain, 
  Loader2, 
  Lightbulb, 
  Target,
  BookOpen,
  Zap,
  CheckCircle
} from "lucide-react"

interface TopicSuggestion {
  text: string
  icon: typeof Brain
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'Core concepts and foundations', icon: Target },
  { value: 'intermediate', label: 'Intermediate', description: 'Analysis and applications', icon: Brain },
  { value: 'advanced', label: 'Advanced', description: 'Synthesis and evaluation', icon: Zap },
] as const

const LEARNING_STYLES = [
  { value: 'conceptual', label: 'Conceptual', description: 'Theories and abstract thinking' },
  { value: 'practical', label: 'Practical', description: 'Real-world applications' },
  { value: 'mixed', label: 'Balanced', description: 'Mix of theory and practice' },
] as const

export function AIDeckGenerator() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [cardCount, setCardCount] = useState(15)
  const [learningStyle, setLearningStyle] = useState<'conceptual' | 'practical' | 'mixed'>('mixed')
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [customFocus, setCustomFocus] = useState("")
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([])
  
  const router = useRouter()

  // Load topic suggestions when user types
  useEffect(() => {
    const loadSuggestions = async () => {
      if (topic.length < 3) {
        setTopicSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/ai/generate-deck?query=${encodeURIComponent(topic)}`)
        const data = await response.json()
        setTopicSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Failed to load suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(loadSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [topic])

  // Simulate progress during generation
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

  const addFocusArea = () => {
    if (customFocus.trim() && !focusAreas.includes(customFocus.trim())) {
      setFocusAreas([...focusAreas, customFocus.trim()])
      setCustomFocus("")
    }
  }

  const removeFocusArea = (area: string) => {
    setFocusAreas(focusAreas.filter(a => a !== area))
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
          topic,
          difficulty,
          cardCount,
          learningStyle,
          focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate deck')
      }

      setProgress(100)
      
      // Success - close dialog and refresh
      setTimeout(() => {
        setOpen(false)
        resetForm()
        router.refresh()
      }, 1000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate deck')
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    }
  }

  const resetForm = () => {
    setStep(1)
    setTopic("")
    setDifficulty('intermediate')
    setCardCount(15)
    setLearningStyle('mixed')
    setFocusAreas([])
    setCustomFocus("")
    setTopicSuggestions([])
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
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Generate Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Socratic AI Flashcard Generator
          </DialogTitle>
          <DialogDescription>
            Create intelligent flashcards that promote critical thinking and deep learning through the Socratic method.
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          // Generation Progress
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin opacity-20"></div>
                <Brain className="w-10 h-10 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Generating Your Socratic Deck</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Creating thought-provoking questions that promote deep understanding...
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
                <Lightbulb className={`w-6 h-6 ${progress > 20 ? 'text-purple-600' : 'text-gray-400'}`} />
                <span>Analyzing Topic</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Brain className={`w-6 h-6 ${progress > 60 ? 'text-purple-600' : 'text-gray-400'}`} />
                <span>Crafting Questions</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className={`w-6 h-6 ${progress > 95 ? 'text-green-600' : 'text-gray-400'}`} />
                <span>Finalizing Deck</span>
              </div>
            </div>

            {progress === 100 && (
              <div className="text-center text-green-600 font-medium">
                ✨ Deck generated successfully! Redirecting...
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Topic Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="text-base font-medium">
                    What would you like to learn about?
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Enter any topic - from quantum physics to ancient philosophy. The AI will create Socratic questions to deepen your understanding.
                  </p>
                  <Input
                    id="topic"
                    placeholder="e.g., Quantum Physics, Ancient Philosophy, Machine Learning..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Topic Suggestions */}
                {topicSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Suggested Topics:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {topicSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300"
                          onClick={() => setTopic(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!topic.trim() || isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Customization */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Topic: {topic}
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Let's customize your learning experience
                  </p>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Difficulty Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDifficulty(option.value)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          difficulty === option.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <option.icon className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Style */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Learning Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {LEARNING_STYLES.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setLearningStyle(style.value)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          learningStyle === style.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <span className="font-medium block mb-1">{style.label}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {style.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Count */}
                <div className="space-y-2">
                  <Label htmlFor="cardCount" className="text-base font-medium">
                    Number of Cards: {cardCount}
                  </Label>
                  <input
                    id="cardCount"
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Focus Areas (Optional)
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add specific aspects or subtopics you want to emphasize
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., applications, history, theories..."
                      value={customFocus}
                      onChange={(e) => setCustomFocus(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFocusArea()}
                    />
                    <Button type="button" onClick={addFocusArea} variant="outline">
                      Add
                    </Button>
                  </div>
                  {focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFocusArea(area)}
                        >
                          {area} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Socratic Deck
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