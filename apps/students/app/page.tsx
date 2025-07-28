import type { Metadata } from "next";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, BookOpen, Brain, Users, Sparkles, PlayCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Unpuzzle - Transform Your Learning Experience",
  description: "Interactive educational platform that makes learning engaging through puzzle-based content",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Unpuzzle</span>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/courses" className="text-gray-700 hover:text-gray-900">
              My Courses
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Learn Smarter with
          <span className="text-blue-600"> Interactive Puzzles</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform complex concepts into engaging puzzle-based learning experiences. 
          Master any subject through interactive challenges and real-time feedback.
        </p>
        <div className="flex gap-4 justify-center">
          <SignedOut>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Start Learning Free <ArrowRight className="h-5 w-5" />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/courses" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Browse Courses <ArrowRight className="h-5 w-5" />
            </Link>
          </SignedIn>
          <Link 
            href="/courses" 
            className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <PlayCircle className="h-5 w-5" /> Watch Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Students Love Unpuzzle</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Engage with content through puzzles, quizzes, and hands-on challenges
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-600">
                Get personalized hints and guidance from our intelligent learning assistant
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Learning</h3>
              <p className="text-gray-600">
                Connect with peers, share insights, and learn together in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600 mt-2">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600 mt-2">Interactive Courses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600 mt-2">Completion Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">4.8★</div>
            <div className="text-gray-600 mt-2">Student Rating</div>
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Introduction to Programming",
                instructor: "Dr. Sarah Johnson",
                students: "2,341",
                rating: "4.9",
                image: "/assets/course1.png"
              },
              {
                title: "Data Science Fundamentals",
                instructor: "Prof. Michael Chen",
                students: "1,892",
                rating: "4.8",
                image: "/assets/thumbnailWebCourse.svg"
              },
              {
                title: "Web Development Bootcamp",
                instructor: "Emily Rodriguez",
                students: "3,125",
                rating: "4.9",
                image: "/assets/courseThumbnail.svg"
              }
            ].map((course, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">★ {course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/courses" 
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2"
            >
              View All Courses <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already learning smarter with Unpuzzle
          </p>
          <div className="flex gap-4 justify-center">
            <SignedOut>
              <Link 
                href="/sign-up" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold"
              >
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/courses" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold"
              >
                Explore Courses
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Unpuzzle</span>
            </div>
            <p className="text-sm">
              Making learning interactive and engaging through puzzle-based education.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white">Browse Courses</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Community</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2024 Unpuzzle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
