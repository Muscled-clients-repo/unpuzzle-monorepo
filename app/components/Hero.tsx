import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Transform Learning with
          <span className="text-blue-600"> AI-Powered</span> Education
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Unpuzzle revolutionizes online education by providing interactive, AI-enhanced video learning experiences 
          that adapt to each student's needs and help instructors create engaging content effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/apps/instructor/sign-up" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Teaching Today
          </Link>
          <Link 
            href="/apps/student/sign-up" 
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Start Learning
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by educators worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-50">
            <div className="w-32 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-32 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-32 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  )
}