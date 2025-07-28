const steps = [
  {
    number: "1",
    title: "Upload Your Content",
    description: "Upload your educational videos or create new ones with our built-in tools. Our AI will automatically process and enhance your content."
  },
  {
    number: "2",
    title: "AI Enhancement",
    description: "Our AI analyzes your content, generates transcripts, identifies key concepts, and creates interactive elements to boost engagement."
  },
  {
    number: "3",
    title: "Customize & Publish",
    description: "Review AI suggestions, add your personal touch, create quizzes, and publish your course with just a few clicks."
  },
  {
    number: "4",
    title: "Track & Improve",
    description: "Monitor student progress with detailed analytics and use insights to continuously improve your content and teaching methods."
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How Unpuzzle Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our simple, intuitive process
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full">
                  <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}