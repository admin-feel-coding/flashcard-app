"use client"

import { BookOpen, Sparkles } from "lucide-react"

export function EmptyDeckState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to start learning?</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first deck to begin your learning journey!</p>
      
      {/* AI Language Learning Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 mx-auto max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900 dark:text-blue-100">AI Language Learning</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Generate personalized flashcards for any language with pronunciation guides, grammar notes, and cultural context.
        </p>
        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <p>🗣️ Pronunciation guides included</p>
          <p>📚 Grammar explanations & examples</p>
          <p>🌍 Cultural context & practical usage</p>
          <p>🎯 CEFR levels (A1-C2) supported</p>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>💡 Tip: Start with A1-A2 level for beginners, B1-B2 for intermediate learners</p>
      </div>
    </div>
  )
}
