"use client"

import {useState, useEffect, useRef} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import { Sparkles, X } from "lucide-react"
import { CardFormatter } from "@/components/cards/card-formatter"

interface StudyCardProps {
    card: {
        id: string
        front: string
        back: string
        translation?: string
        pronunciation?: string
        wordType?: string
        examples?: Array<{text: string, translation?: string} | string>
        grammarNotes?: string
        usageNotes?: string
        mnemonicHint?: string
        culturalContext?: string
        relatedWords?: string[]
        synonyms?: string[]
        antonyms?: string[]
        conjugations?: Record<string, string>
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
    }, [card.id])



    const handleFlip = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setIsFlipped(true)
            setIsAnimating(false)
        }, 150)
    }

    const handleCardClick = () => {
        if (!isFlipped) {
            handleFlip()
        }
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


    // Calculate progress
    const progress = currentCard && totalCards ? (currentCard / totalCards) * 100 : 0

    return (
        <Card
            ref={cardRef}
            className={`fixed inset-0 border-0 shadow-2xl bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ${
                isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
            } ${!isFlipped ? 'cursor-pointer' : 'cursor-pointer'}`}
            onClick={handleCardClick}
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

                <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 h-dvh sm:h-screen flex flex-col justify-between relative z-10 overflow-y-auto"
                             style={{paddingTop: (currentCard && totalCards) ? '4rem' : '2rem', paddingBottom: isFlipped ? '6rem' : '1rem'}}>

                    {/* Main Content Area */}
                    <div className="flex-1 flex items-center justify-center min-h-0 py-4">
                        {!isFlipped ? (
                            <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-4xl mx-auto px-4">
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
                                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-900 dark:text-white leading-relaxed text-balance break-words hyphens-auto">
                                    {card.front}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 sm:space-y-6 md:space-y-8 max-w-none md:max-w-5xl mx-auto px-2 sm:px-4 overflow-y-auto">
                                <div className="text-center">
                                    <div
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                        <div className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                                            {card.front.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
                                    <CardFormatter 
                                        card={card}
                                        className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Minimalist Button System */}
                    {isFlipped && (
                        <div className="fixed inset-x-0 bottom-0 z-20">
                            <div className="flex items-center justify-center gap-3 p-6 pb-8">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRate(0)
                                    }}
                                    className="group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Again</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRate(1)
                                    }}
                                    className="group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.294-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Hard</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRate(2)
                                    }}
                                    className="group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Good</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRate(3)
                                    }}
                                    className="group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Easy</span>
                                </button>
                            </div>
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
