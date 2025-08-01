import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Brain, Users, Sparkles, PlayCircle, CheckCircle } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SEOStructuredData from "./components/shared/seo-structured-data";
import { generateOrganizationSchema } from "./utils/seo.utils";
import {UserStatus} from "@unpuzzle/ui"

export const metadata: Metadata = {
  title: "Unpuzzle - Transform Your Learning Experience",
  description: "Interactive educational platform that makes learning engaging through puzzle-based content, AI-powered assistance, and collaborative learning features.",
  keywords: "online learning, interactive education, puzzle-based learning, AI tutoring, educational platform, online courses",
  authors: [{ name: "Unpuzzle Team" }],
  creator: "Unpuzzle",
  publisher: "Unpuzzle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Unpuzzle - Transform Your Learning Experience",
    description: "Interactive educational platform that makes learning engaging through puzzle-based content, AI-powered assistance, and collaborative learning features.",
    url: "/",
    siteName: "Unpuzzle",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unpuzzle - Transform Your Learning Experience",
    description: "Interactive educational platform with puzzle-based content and AI-powered assistance.",
    creator: "@unpuzzle",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <SEOStructuredData data={organizationSchema} />
      <div className="min-h-screen">

      {/* Hero Section - Udemy Style */}
      <section className="relative bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Learn without limits
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8">
                Start, switch, or advance your career with more than 5,800 courses, Professional Certificates, and degrees from world-class universities and companies.
              </p>
              
              {/* Search Bar */}
              <div className="mb-8">
                <form className="relative">
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    className="w-full px-6 py-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/courses" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                >
                  Get Started
                </Link>
                <Link 
                  href="/courses" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                >
                  Browse Courses
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-600">Active learners</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Expert instructors</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                  <p className="text-sm text-gray-600">Average rating</p>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Student learning online"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-70 -z-10"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-70 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserStatus />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
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
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "1",
                title: "Introduction to Programming",
                instructor: "Dr. Sarah Johnson",
                students: "2,341",
                rating: "4.9",
                image: "/assets/course1.png",
                price: 49.99
              },
              {
                id: "2",
                title: "Data Science Fundamentals",
                instructor: "Prof. Michael Chen",
                students: "1,892",
                rating: "4.8",
                image: "/assets/thumbnailWebCourse.svg",
                price: 79.99
              },
              {
                id: "3",
                title: "Web Development Bootcamp",
                instructor: "Emily Rodriguez",
                students: "3,125",
                rating: "4.9",
                image: "/assets/courseThumbnail.svg",
                price: 99.99
              }
            ].map((course, index) => (
              <Link 
                key={index} 
                href={`${process.env.NEXT_PUBLIC_CORE_SERVER_URL || ''}/courses/${course.id}`}
                target="_blank"
                className="block border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  <BookOpen className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-yellow-500">★ {course.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">View Course →</span>
                  </div>
                </div>
              </Link>
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
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already learning smarter with Unpuzzle
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/courses" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Get Started Free
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
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
              <li><Link href="/courses" className="hover:text-white">Get Started</Link></li>
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
        </div>
      </footer>
      </div>
    </>
  );
}
