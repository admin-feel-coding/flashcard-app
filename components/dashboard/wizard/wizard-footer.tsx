"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

interface WizardFooterProps {
  step: number
  prevStep: () => void
  nextStep: () => void
  handleGenerate: () => void
  canProceedFromStep: (step: number) => boolean
}

export function WizardFooter({ step, prevStep, nextStep, handleGenerate, canProceedFromStep }: WizardFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px)+20px)] bg-white/95 dark:bg-gray-900/95 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm z-50 mobile-safe-bottom" style={{paddingBottom: 'max(calc(1rem + 30px), calc(1rem + env(safe-area-inset-bottom, 0px) + 30px))'}}>
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 h-12 px-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Progress value={(step / 4) * 100} className="w-16 h-2" />
          <span className="text-xs text-gray-500 font-medium">{step}/4</span>
        </div>

        {step < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceedFromStep(step)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 px-4"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={!canProceedFromStep(step)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 px-4"
          >
            <Sparkles className="w-4 h-4" />
            Create
          </Button>
        )}
      </div>
    </div>
  )
}
