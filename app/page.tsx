import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Sparkles, 
  Brain, 
  Zap, 
  Globe, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Play,
  Check,
  ArrowRight
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FlashMind
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 text-balance leading-tight">
            Learn Anything with
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Flashcards
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
            Create personalized flashcards with AI, study with spaced repetition, and master any subject faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Start Learning Free
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
            >
              Watch Demo
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mb-20">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ active learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>50+ languages supported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose FlashMind?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the perfect blend of AI technology and proven learning science
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Generate personalized flashcards instantly. Just tell our AI what you want to learn, and get contextual, relevant content.
              </p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Repetition</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our adaptive algorithm learns your patterns and schedules reviews at the perfect time for maximum retention.
              </p>
              <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Multi-Language</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Learn any language with pronunciation guides, cultural context, and grammar explanations tailored to your level.
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Detailed analytics and insights help you understand your learning patterns and stay motivated.
              </p>
              <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Study anywhere, anytime with our fast, responsive interface optimized for all devices.
              </p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Easy to Use</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Intuitive interface designed for learners. No complexity, just pure focus on what matters - learning.
              </p>
              <div className="flex items-center text-pink-600 dark:text-pink-400 font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Start Learning in 3 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in minutes, not hours
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create with AI</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tell our AI what you want to learn. It creates perfect flashcards with examples, pronunciation, and context.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Study Smart</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our spaced repetition system optimizes when you see each card for maximum learning efficiency.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Master It</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Track your progress and watch your knowledge grow. Celebrate milestones and achieve your learning goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-12 sm:p-16 text-center text-white">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl sm:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of learners who are mastering new skills with FlashMind's AI-powered flashcards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto px-10 py-5 text-lg bg-white text-gray-900 hover:bg-gray-50 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Start learning in 2 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FlashMind
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 FlashMind. Made with ❤️ for learners worldwide.
          </div>
        </div>
      </footer>
    </div>
  )
}
