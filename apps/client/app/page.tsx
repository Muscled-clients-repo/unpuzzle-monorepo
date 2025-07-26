export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Unpuzzle</h1>
        <p className="text-xl mb-8">Choose your role to continue</p>
        <div className="space-x-4">
          <a
            href="/instructor"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Instructor Portal
          </a>
          <a
            href="/student"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Student Portal
          </a>
        </div>
      </div>
    </div>
  );
}