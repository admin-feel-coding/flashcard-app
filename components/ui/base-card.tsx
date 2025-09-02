import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface BaseCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "outlined" | "glass" | "minimal"
}

const cardVariants = {
  default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm",
  outlined: "bg-transparent border-2 border-gray-200 dark:border-gray-700",
  glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg",
  minimal: "bg-gradient-to-br from-white/90 via-gray-50/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/20 backdrop-blur-md border border-white/50 dark:border-gray-600/30 shadow-lg"
}

export function BaseCard({ 
  children, 
  className,
  variant = "default"
}: BaseCardProps) {
  return (
    <div className={cn(
      "rounded-xl p-4 sm:p-6 transition-all duration-300",
      cardVariants[variant],
      className
    )}>
      {children}
    </div>
  )
}