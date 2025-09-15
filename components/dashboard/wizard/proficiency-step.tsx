"use client"

import React from "react"
import { BookOpen } from "lucide-react"
import { PROFICIENCY_LEVELS } from "./constants"

interface ProficiencyStepProps {
  proficiencyLevel: string
  setProficiencyLevel: (level: string) => void
}

const handleLevelSelect = (level: string, setProficiencyLevel: (level: string) => void) => {
  setProficiencyLevel(level)
  // Save proficiency level preference
  localStorage.setItem('flashmind-proficiency-level', level)
}

export function ProficiencyStep({ proficiencyLevel, setProficiencyLevel }: ProficiencyStepProps) {
  return (
    <div className="text-center space-y-3">
      <div>
        <BookOpen className="w-10 h-10 mx-auto mb-3 text-purple-600" />
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          What's your current level?
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 px-4">
          Be honest - this helps us create better content
        </p>
      </div>

      <div className="space-y-2 max-w-sm mx-auto px-4">
        {PROFICIENCY_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => handleLevelSelect(level.value, setProficiencyLevel)}
            className={`w-full p-2.5 rounded-lg border-2 transition-all duration-200 text-left ${
              proficiencyLevel === level.value
                ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${level.color} flex-shrink-0`} />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">{level.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{level.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
