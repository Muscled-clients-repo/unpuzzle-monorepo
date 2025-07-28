export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Welcome to Unpuzzle</h1>
        <p className="text-2xl mb-12 text-gray-600">AI-Powered Learning Platform</p>
        <p className="text-xl mb-8 text-gray-600">Choose your role to continue</p>
        <div className="space-x-4">
          <a
            href="https://unpuzzle-instructor.vercel.app"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Instructor Portal
          </a>
          <a
            href="https://unpuzzle-student.vercel.app"
            className="inline-block px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            Student Portal
          </a>
        </div>
      </div>
    </div>
  );
}