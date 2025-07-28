import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Transform Your Teaching?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of educators who are already creating engaging, interactive courses with Unpuzzle
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/apps/instructor/sign-up" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/demo" 
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Watch Demo
          </Link>
        </div>
        <p className="text-sm text-blue-100 mt-6">
          No credit card required • Free 14-day trial • Cancel anytime
        </p>
      </div>
    </section>
  )
}