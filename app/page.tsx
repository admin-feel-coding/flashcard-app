import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Master Any Subject with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FlashMind
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-balance max-w-2xl mx-auto leading-relaxed">
            The modern flashcard app that adapts to your learning style. Create, study, and master any topic with our
            intelligent spaced repetition system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/auth/sign-up">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* How it Works Section */}
          <div className="mb-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                How It Works
              </h2>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Choose Your Language & Level
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Select the language you want to learn and your current proficiency level (A1-C2). 
                      Our AI understands your learning needs based on the CEFR framework.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      AI Generates Personalized Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tell our AI exactly what you want to learn: "10 modal verbs", "past perfect", "business vocabulary", 
                      or "Toronto slang". It creates targeted flashcards with pronunciation guides, examples, and cultural context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Study with Smart Repetition
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Learn with spaced repetition that adapts to your progress. Cards you struggle with appear more often, 
                      while mastered content is reviewed at optimal intervals for long-term retention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    AI-Powered Language Learning
                  </h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  Our AI doesn't just translate words—it understands context, culture, and learning patterns. 
                  Get pronunciation guides, grammar explanations, real-world examples, and cultural insights 
                  that help you communicate naturally, not just memorize vocabulary.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Learning</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Adaptive spaced repetition algorithm optimizes your study sessions
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Beautiful Design</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Clean, modern interface that makes studying enjoyable
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Detailed analytics help you understand your learning patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
