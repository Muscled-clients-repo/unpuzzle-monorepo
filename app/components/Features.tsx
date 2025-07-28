const features = [
  {
    title: "AI-Powered Video Analysis",
    description: "Our AI analyzes educational videos to create interactive learning experiences with automatic transcription, key point extraction, and smart summaries.",
    icon: "🤖"
  },
  {
    title: "Interactive Puzzles & Quizzes",
    description: "Engage students with automatically generated puzzles, quizzes, and interactive elements that reinforce learning at crucial moments.",
    icon: "🧩"
  },
  {
    title: "Real-time Analytics",
    description: "Track student progress, engagement, and comprehension with detailed analytics that help instructors optimize their content.",
    icon: "📊"
  },
  {
    title: "Smart Content Creation",
    description: "Create professional educational content with AI assistance for script writing, video editing, and course structuring.",
    icon: "🎬"
  },
  {
    title: "Personalized Learning Paths",
    description: "AI adapts to each student's learning pace and style, providing personalized recommendations and support.",
    icon: "🎯"
  },
  {
    title: "Collaborative Tools",
    description: "Foster interaction with discussion boards, peer reviews, and collaborative projects integrated into the learning experience.",
    icon: "👥"
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Education
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create, deliver, and optimize engaging educational content
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}