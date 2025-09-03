"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles, X } from "lucide-react"
import { LanguageStep } from "./language-step"
import { ProficiencyStep } from "./proficiency-step" 
import { FocusStep } from "./focus-step"
import { WizardFooter } from "./wizard-footer"
import { LEARNING_FOCUS_OPTIONS, getLanguageFlag } from "./constants"

export function AILanguageGenerator() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [viewportHeight, setViewportHeight] = useState(0)

  // Form state
  const [targetLanguage, setTargetLanguage] = useState("")
  const [targetLanguageSearch, setTargetLanguageSearch] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState("English")
  const [nativeLanguageSearch, setNativeLanguageSearch] = useState("")
  const [proficiencyLevel, setProficiencyLevel] = useState("")
  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [customFocus, setCustomFocus] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [focusSearch, setFocusSearch] = useState("")

  const router = useRouter()

  // Load saved preferences and handle viewport
  useEffect(() => {
    const savedNativeLanguage = localStorage.getItem('flashmind-native-language')
    if (savedNativeLanguage) {
      setNativeLanguage(savedNativeLanguage)
    }

    const savedTargetLanguage = localStorage.getItem('flashmind-target-language')
    if (savedTargetLanguage) {
      setTargetLanguage(savedTargetLanguage)
    }

    const savedProficiencyLevel = localStorage.getItem('flashmind-proficiency-level')
    if (savedProficiencyLevel) {
      setProficiencyLevel(savedProficiencyLevel)
    }

    // Set initial viewport height
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    window.addEventListener('orientationchange', updateViewportHeight)

    // Listen for language changes from settings
    const handleLanguageChange = (event: CustomEvent) => {
      setNativeLanguage(event.detail.language)
    }

    window.addEventListener('nativeLanguageChange', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
      window.removeEventListener('nativeLanguageChange', handleLanguageChange as EventListener)
    }
  }, [])

  const resetForm = () => {
    setStep(1)
    setTargetLanguageSearch("")
    const savedNativeLanguage = localStorage.getItem('flashmind-native-language') || 'English'
    setNativeLanguage(savedNativeLanguage)
    setNativeLanguageSearch("")
    
    // Keep saved target language and proficiency level
    const savedTargetLanguage = localStorage.getItem('flashmind-target-language')
    if (savedTargetLanguage) {
      setTargetLanguage(savedTargetLanguage)
    } else {
      setTargetLanguage("")
    }
    
    const savedProficiencyLevel = localStorage.getItem('flashmind-proficiency-level')
    if (savedProficiencyLevel) {
      setProficiencyLevel(savedProficiencyLevel)
    } else {
      setProficiencyLevel("")
    }
    
    setDeckTitle("")
    setDeckDescription("")
    setCustomFocus("")
    setSelectedCategory("")
    setFocusSearch("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceedFromStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return nativeLanguage !== ""
      case 2:
        return targetLanguage !== ""
      case 3:
        return proficiencyLevel !== ""
      case 4:
        return deckDescription.trim() !== "" || customFocus.trim() !== ""
      default:
        return true
    }
  }

  const handleGenerate = async () => {
    const nativeFlag = getLanguageFlag(nativeLanguage)
    const targetFlag = getLanguageFlag(targetLanguage)

    const getFocusDescription = () => {
      if (selectedCategory === "travel") return "✈️ Travel & Adventure phrases"
      if (selectedCategory === "business") return "💼 Business vocabulary"
      if (selectedCategory === "social") return "👥 Social conversations"
      if (selectedCategory === "academic") return "🎓 Academic mixed content"
      if (customFocus) return `🎯 ${customFocus}`
      return "📚 General vocabulary"
    }

    const focusDescription = getFocusDescription()

    const toastId = toast.loading(
      `${nativeFlag} → ${targetFlag} Creating ${targetLanguage} deck...`,
      {
        description: `${proficiencyLevel} level • ${focusDescription}`,
        duration: Infinity
      }
    )

    setTimeout(() => {
      setOpen(false)
      resetForm()
    }, 500)

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
          cardCount: 10,
          learningFocus: customFocus ? customFocus.trim() : 
                        selectedCategory === "travel" ? "travel" :
                        selectedCategory === "business" ? "business" :
                        selectedCategory === "social" ? "social" :
                        selectedCategory === "academic" ? "academic" :
                        "vocabulary",
          customFocus: customFocus || "",
          deckTitle: deckTitle || `${targetLanguage} Learning Deck`,
          deckDescription: deckDescription || `Personalized ${targetLanguage} flashcards for ${proficiencyLevel} level`
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate deck')
      }

      toast.success(
        `${targetFlag} Deck created successfully!`,
        {
          id: toastId,
          description: `"${data.deck.title}" • ${proficiencyLevel} level • ${data.deck.cardCount} cards ready to study`,
          action: {
            label: "Study Now",
            onClick: () => window.location.href = `/study/${data.deck.id}`
          },
          duration: 6000
        }
      )

      router.refresh()

    } catch (error) {
      console.error('Generation error:', error)
      toast.error(
        `${targetFlag} Failed to create ${targetLanguage} deck`,
        {
          id: toastId,
          description: error instanceof Error ? error.message : "Please try again with different settings",
          duration: 5000
        }
      )
    }
  }

  const selectLanguage = (language: string, isTarget: boolean) => {
    if (isTarget) {
      setTargetLanguage(language)
      setTargetLanguageSearch("")
      // Save target language preference
      localStorage.setItem('flashmind-target-language', language)
    } else {
      setNativeLanguage(language)
      setNativeLanguageSearch("")
    }
  }

  const selectFocus = (focusOption: any) => {
    setSelectedCategory(focusOption.id)
    setFocusSearch("")
    setDeckDescription(`${focusOption.name} ${targetLanguage} cards. ${focusOption.description}`)
    setDeckTitle(`${targetLanguage} ${focusOption.name}`)
    setCustomFocus("")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Create with AI
          </Button>
        </DialogTrigger>

        <DialogContent 
          className="w-full h-[100dvh] mobile-full-height max-w-none m-0 p-0 border-0 rounded-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"
          style={viewportHeight ? { height: `${viewportHeight}px` } : {}}
        >
          <DialogTitle className="sr-only">AI Language Learning Generator Wizard</DialogTitle>

          {/* Close button */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content - scrollable with space for footer */}
          <div className="h-full p-4 pt-16 overflow-y-auto pb-[140px] min-h-0" style={{paddingBottom: 'max(140px, calc(120px + env(safe-area-inset-bottom, 0px) + 20px))'}}>
            <LanguageStep
              step={step}
              nativeLanguage={nativeLanguage}
              nativeLanguageSearch={nativeLanguageSearch}
              setNativeLanguageSearch={setNativeLanguageSearch}
              targetLanguage={targetLanguage}
              targetLanguageSearch={targetLanguageSearch}
              setTargetLanguageSearch={setTargetLanguageSearch}
              selectLanguage={selectLanguage}
            />

            {step === 3 && (
              <ProficiencyStep
                proficiencyLevel={proficiencyLevel}
                setProficiencyLevel={setProficiencyLevel}
              />
            )}

            {step === 4 && (
              <FocusStep
                nativeLanguage={nativeLanguage}
                targetLanguage={targetLanguage}
                proficiencyLevel={proficiencyLevel}
                selectedCategory={selectedCategory}
                focusSearch={focusSearch}
                setFocusSearch={setFocusSearch}
                customFocus={customFocus}
                setCustomFocus={setCustomFocus}
                deckDescription={deckDescription}
                selectFocus={selectFocus}
                setDeckDescription={setDeckDescription}
                setDeckTitle={setDeckTitle}
                setSelectedCategory={setSelectedCategory}
              />
            )}
          </div>

          <WizardFooter
            step={step}
            prevStep={prevStep}
            nextStep={nextStep}
            handleGenerate={handleGenerate}
            canProceedFromStep={canProceedFromStep}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}