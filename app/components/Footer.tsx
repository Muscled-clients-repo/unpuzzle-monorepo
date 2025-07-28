import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Unpuzzle</h3>
            <p className="text-gray-400">
              AI-powered education platform transforming how we teach and learn.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              <li><Link href="/updates" className="hover:text-white">Updates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
              <li><Link href="/community" className="hover:text-white">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Unpuzzle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}