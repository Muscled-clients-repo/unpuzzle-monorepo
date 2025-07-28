import Link from 'next/link'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                Unpuzzle
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                How it Works
              </Link>
              <Link href="/apps/instructor" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                For Instructors
              </Link>
              <Link href="/apps/student" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                For Students
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/apps/instructor/sign-in" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Sign In
              </Link>
              <Link 
                href="/apps/instructor/sign-up" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}