"use client"

import {useState, useEffect, useRef} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import { Sparkles, X } from "lucide-react"

interface StudyCardProps {
    card: {
        id: string
        front: string
        back: string
    }
    deck?: {
        title: string
        color: string
    }
    currentCard?: number
    totalCards?: number
    onRate: (difficulty: number) => void
    onExit?: () => void
}

export function StudyCard({card, deck, currentCard, totalCards, onRate, onExit}: StudyCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [showButtons, setShowButtons] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [explanation, setExplanation] = useState("")
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    // Prevent body scroll when component mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isFlipped) {
                if (event.code === "Space" || event.code === "Enter") {
                    event.preventDefault()
                    handleFlip()
                }
            } else {
                switch (event.code) {
                    case "Digit1":
                        event.preventDefault()
                        handleRate(0)
                        break
                    case "Digit2":
                        event.preventDefault()
                        handleRate(1)
                        break
                    case "Digit3":
                        event.preventDefault()
                        handleRate(2)
                        break
                    case "Digit4":
                        event.preventDefault()
                        handleRate(3)
                        break
                }
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [isFlipped])

    // Reset states when card changes
    useEffect(() => {
        setIsFlipped(false)
        setIsAnimating(false)
        setShowButtons(false)
    }, [card.id])

    // Auto-hide buttons after 3 seconds on mobile/touch devices
    useEffect(() => {
        if (isFlipped && !showButtons) {
            const timer = setTimeout(() => {
                // Only auto-show on touch devices (mobile)
                if ('ontouchstart' in window) {
                    setShowButtons(false)
                }
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isFlipped, showButtons])

    const handleFlip = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setIsFlipped(true)
            setIsAnimating(false)
        }, 150)
    }

    const handleFlippedCardClick = () => {
        setShowButtons(!showButtons) // Toggle buttons on flipped card click
    }

    const handleRate = (difficulty: number) => {
        setIsAnimating(true)
        setTimeout(() => {
            onRate(difficulty)
            setIsFlipped(false)
            setIsAnimating(false)
            setShowExplanation(false)
            setExplanation("")
        }, 200)
    }

    const handleExplanation = async () => {
        if (explanation) {
            setShowExplanation(true)
            return
        }

        setIsLoadingExplanation(true)
        try {
            const response = await fetch('/api/ai/explain-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardFront: card.front,
                    cardBack: card.back,
                    deckTitle: deck?.title
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get explanation')
            }

            setExplanation(data.explanation)
            setShowExplanation(true)
        } catch (error) {
            console.error('Explanation error:', error)
        } finally {
            setIsLoadingExplanation(false)
        }
    }

    const difficultyButtons = [
        {label: "Again", value: 0, color: "bg-red-500", swipe: "← Swipe Left", emoji: "😓"},
        {label: "Hard", value: 1, color: "bg-orange-500", swipe: "↓ Swipe Down", emoji: "🤔"},
        {label: "Good", value: 2, color: "bg-blue-500", swipe: "↑ Swipe Up", emoji: "👍"},
        {label: "Easy", value: 3, color: "bg-green-500", swipe: "→ Swipe Right", emoji: "😄"},
    ]

    // Calculate progress
    const progress = currentCard && totalCards ? (currentCard / totalCards) * 100 : 0

    return (
        <Card
            ref={cardRef}
            className={`fixed inset-0 border-0 shadow-2xl bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ${
                isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
            } ${!isFlipped ? 'cursor-pointer' : 'cursor-pointer'}`}
            onClick={!isFlipped ? handleFlip : handleFlippedCardClick}
        >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"/>

                {/* Minimal Progress Header */}
                {(currentCard && totalCards) && (
                    <div className="absolute top-0 left-0 right-0 z-20">
                        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5">
                            {/* Deck info */}
                            <div className="flex items-center gap-2">
                                {onExit && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onExit}
                                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 19l-7-7 7-7"/>
                                        </svg>
                                    </Button>
                                )}
                                {deck && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: deck.color}}/>
                                        <span
                                            className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-[120px] sm:max-w-none">
                        {deck.title}
                      </span>
                                    </div>
                                )}
                            </div>

                            {/* Progress indicator */}
                            <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {currentCard}/{totalCards}
                  </span>
                                <div
                                    className="w-12 sm:w-16 md:w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                                        style={{width: `${progress}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 h-dvh sm:h-screen flex flex-col justify-between relative z-10 overflow-hidden"
                             style={{paddingTop: (currentCard && totalCards) ? '3rem' : '1.5rem'}}>

                    {/* Main Content Area */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        {!isFlipped ? (
                            <div className="text-center space-y-6 md:space-y-8">
                                <div
                                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white leading-relaxed text-balance">
                                    {card.front}
                                </p>
                            </div>
                        ) : (
                            <div className="w-full space-y-6 md:space-y-8 max-w-none md:max-w-4xl">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    
                                    {/* AI Explanation Button - Desktop/Laptop only */}
                                    <div className="hidden md:block">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleExplanation()
                                            }}
                                            disabled={isLoadingExplanation}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            {isLoadingExplanation ? "Loading..." : "AI Explanation"}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className="text-left text-sm sm:text-base md:text-lg lg:text-xl"
                                    dangerouslySetInnerHTML={{__html: card.back}}
                                />
                            </div>
                        )}
                    </div>

                    {/* Rating buttons when flipped - always visible with blur effect */}
                    {isFlipped && (
                        <div 
                            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 group"
                            onMouseEnter={() => setShowButtons(true)}
                            onMouseLeave={() => setShowButtons(false)}
                        >
                            <div className={`bg-transparent backdrop-blur-none rounded-2xl p-3 transition-all duration-300 ${
                                showButtons ? 'opacity-100 blur-0' : 'opacity-40 blur-sm hover:opacity-70'
                            }`}>
                                {/* Mobile AI Explanation Button */}
                                <div className="mb-3 flex justify-center md:hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleExplanation()
                                        }}
                                        disabled={isLoadingExplanation}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {isLoadingExplanation ? "Loading..." : "AI Explanation"}
                                    </button>
                                </div>

                                {/* Rating Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRate(0)
                                        }}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-lg mb-1">
                                            😓
                                        </div>
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                            Again
                                            <span className="hidden md:block text-[10px] opacity-70">Press 1</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRate(1)
                                        }}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-lg mb-1">
                                            🤔
                                        </div>
                                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                            Hard
                                            <span className="hidden md:block text-[10px] opacity-70">Press 2</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRate(2)
                                        }}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg mb-1">
                                            👍
                                        </div>
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                            Good
                                            <span className="hidden md:block text-[10px] opacity-70">Press 3</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRate(3)
                                        }}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-lg mb-1">
                                            😄
                                        </div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            Easy
                                            <span className="hidden md:block text-[10px] opacity-70">Press 4</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isFlipped && (
                        <div className="pb-4">
                            <Button
                                onClick={handleFlip}
                                disabled={isAnimating}
                                className="w-full h-12 sm:h-14 md:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base sm:text-lg md:text-xl font-medium rounded-xl transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isAnimating ? "Loading..." : "Show Answer"}
                                <span className="hidden md:inline-block ml-2 text-sm opacity-75">
                                    (Press Space or Enter)
                                </span>
                            </Button>
                        </div>
                    )}
                </CardContent>

                {/* AI Explanation Overlay */}
                {showExplanation && explanation && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Explanation</h3>
                                </div>
                                <button
                                    onClick={() => setShowExplanation(false)}
                                    className="w-8 h-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div 
                                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{
                                        __html: explanation
                                            // Convert markdown-style formatting to HTML like we do for cards
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
                                            .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2 flex items-center gap-2">$1</h3>')
                                            .replace(/## (.*?)(?=\n|$)/g, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2 flex items-center gap-2">$1</h2>')
                                            .replace(/# (.*?)(?=\n|$)/g, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 flex items-center gap-2">$1</h1>')
                                            .replace(/\n\n/g, '</p><p class="mt-3">')
                                            .replace(/- "(.*?)" → "(.*?)"/g, '<div class="mb-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border-l-4 border-blue-400"><div class="font-medium">"$1"</div><div class="text-sm text-gray-600 dark:text-gray-400">→ "$2"</div></div>')
                                            .replace(/^(?!<)/, '<p>')
                                            .replace(/(?<!>)$/, '</p>')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Card>
    )
}
