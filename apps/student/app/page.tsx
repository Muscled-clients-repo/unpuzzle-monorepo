export default function StudentHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Student Portal</h1>
        <p className="text-xl mb-8">Welcome to your learning journey</p>
        <div className="space-y-4">
          <a
            href="/student/courses"
            className="block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            My Courses
          </a>
          <a
            href="/student/videos"
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Video Library
          </a>
        </div>
      </div>
    </div>
  );
}