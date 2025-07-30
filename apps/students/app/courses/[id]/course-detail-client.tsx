"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useCourseDetails, useCourses } from "@/app/hooks/useCourses";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  PlayCircleIcon, 
  StarIcon, 
  UsersIcon, 
  TrophyIcon, 
  BookOpenIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ShareIcon,
  GiftIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "@/app/components/shared/ui/loading-spinner";

interface CourseDetailClientProps {
  courseId: string;
}

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const router = useRouter();
  const { course, loading, error } = useCourseDetails(courseId);
  const { enrollInCourse } = useCourses();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");

  const handleEnroll = async () => {
    // Authentication check removed

    if (!course) return;

    setIsEnrolling(true);
    try {
      const result = await enrollInCourse(course.id);
      if (result.success) {
        router.push(`/courses/${course.id}/learn`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !course) {
    notFound();
  }

  const totalVideos = course.chapters?.reduce((acc, chapter) => acc + (chapter.videos?.length || 0), 0) || 0;
  const totalDuration = course.duration || "0h";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Enhanced Breadcrumb */}
              <nav className="text-sm">
                <ul className="flex items-center space-x-2 text-gray-300">
                  <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="w-4 h-4 mx-2" />
                    <span className="text-white">{course.category || "General"}</span>
                  </li>
                </ul>
              </nav>
              
              {/* Course Title with Animation */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium backdrop-blur-sm">
                    Bestseller
                  </span>
                  <span className="px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                    Updated {new Date().getFullYear()}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {course.title}
                </h1>
              </div>
              
              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed">
                {course.description}
              </p>

              {/* Enhanced Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold text-lg">4.8</span>
                  <span className="text-gray-300">(1,234 reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <UsersIcon className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">12,456 students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">{totalDuration} total</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <GlobeAltIcon className="w-5 h-5 text-purple-300" />
                  <span className="font-semibold">English</span>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling || course.enrolled}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    {isEnrolling ? "Processing..." : course.enrolled ? (
                      <>Continue Learning <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <>Enroll for ${course.price} <SparklesIcon className="w-5 h-5" /></>
                    )}
                  </span>
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 hover:border-white/50 transition-all group">
                  <PlayCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 hover:border-white/50 transition-all">
                  <BookOpenIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {course.courseAuthor?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Created by</p>
                  <p className="font-semibold flex items-center gap-2">
                    {course.courseAuthor || "Unpuzzle Team"}
                    <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Video Preview */}
            <div className="relative group">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl transform transition-transform group-hover:scale-105">
                <Image
                  src={course.thumbnail || "/assets/courseThumbnail.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group/play relative">
                    <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 group-hover/play:opacity-50 transition-opacity" />
                    <div className="relative p-6 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-2xl">
                      <PlayCircleIcon className="w-16 h-16 text-blue-600" />
                    </div>
                  </button>
                </div>
                
                {/* Preview Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
                  <p className="text-white font-medium">Preview Course</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full blur-2xl opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 px-6 py-4 font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* What You'll Learn */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <LightBulbIcon className="w-8 h-8 text-blue-600" />
                        What you'll learn
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Master core concepts through interactive puzzles and real-world examples",
                          "Build production-ready projects with AI-powered guidance and support",
                          "Learn at your own pace with personalized feedback and adaptive learning",
                          "Get lifetime access to updates, new content, and community support"
                        ].map((item, index) => (
                          <div key={index} className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Features */}
                    <div>
                      <h2 className="text-2xl font-bold mb-8 text-center">Why Choose This Course?</h2>
                      <div className="grid md:grid-cols-3 gap-8">
                        {[
                          {
                            icon: PuzzlePieceIcon,
                            color: "blue",
                            title: "Interactive Puzzles",
                            description: "Learn by solving real challenges with immediate feedback"
                          },
                          {
                            icon: SparklesIcon,
                            color: "purple",
                            title: "AI-Powered Learning",
                            description: "Get personalized hints and guidance when you need it"
                          },
                          {
                            icon: UsersIcon,
                            color: "green",
                            title: "Community Support",
                            description: "Connect with 12,000+ learners and expert mentors"
                          },
                          {
                            icon: VideoCameraIcon,
                            color: "red",
                            title: "HD Video Content",
                            description: "Crystal clear explanations with downloadable resources"
                          },
                          {
                            icon: ShieldCheckIcon,
                            color: "yellow",
                            title: "Certificate",
                            description: "Earn a verified certificate upon completion"
                          },
                          {
                            icon: ChartBarIcon,
                            color: "indigo",
                            title: "Progress Tracking",
                            description: "Monitor your learning journey with detailed analytics"
                          }
                        ].map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <div key={index} className="group hover:scale-105 transition-transform">
                              <div className="text-center space-y-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`w-20 h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform`}>
                                  <Icon className={`w-10 h-10 text-${feature.color}-600`} />
                                </div>
                                <h3 className="font-bold text-lg">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-gray-50 p-8 rounded-2xl">
                      <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">Basic understanding of programming concepts (variables, functions)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">A computer with internet connection</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">Enthusiasm to learn and practice</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
                    {course.chapters?.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500">Chapter {chapterIndex + 1}</span>
                            <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{chapter.videos?.length || 0} lessons</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${expandedChapter === chapter.id ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        
                        {expandedChapter === chapter.id && (
                          <div className="divide-y">
                            {chapter.videos?.map((video, videoIndex) => (
                              <div key={video.id} className="px-6 py-4 hover:bg-gray-50 transition-all">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <PlayCircleIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                                      <p className="text-sm text-gray-600">Video • {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</p>
                                    </div>
                                  </div>
                                  {course.enrolled && (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && course.courseAuthor && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{course.courseAuthor}</h3>
                        <p className="text-gray-600">Expert Instructor</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4" />
                            4.8 Instructor Rating
                          </span>
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-4 h-4" />
                            25,000 Students
                          </span>
                        </div>
                        <p className="text-gray-700 pt-2">
                          Experienced educator with over 10 years of teaching experience. 
                          Passionate about making complex topics accessible through interactive learning.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                    <div className="flex items-center gap-6 pb-6 border-b">
                      <div className="text-center">
                        <div className="text-5xl font-bold">4.8</div>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarSolidIcon key={star} className={`w-5 h-5 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Course Rating</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-3">{rating}</span>
                            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400"
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-10 text-right">
                              {rating === 5 ? "70%" : rating === 4 ? "20%" : "10%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarSolidIcon key={star} className="w-4 h-4 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">2 days ago</span>
                          </div>
                          <h4 className="font-semibold mb-1">Great course for beginners!</h4>
                          <p className="text-gray-700">
                            This course exceeded my expectations. The interactive puzzles really helped me understand the concepts better.
                          </p>
                          <p className="text-sm text-gray-600 mt-2">- Student {review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Course Purchase Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-4xl font-bold">${course.price}</span>
                    {course.price > 0 && (
                      <span className="text-lg line-through opacity-75">${(course.price * 1.5).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                      50% OFF
                    </span>
                    <span className="text-sm">Limited time offer</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* CTA Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling || course.enrolled}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isEnrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : course.enrolled ? (
                      <span className="flex items-center justify-center gap-2">
                        Continue Learning <ArrowRightIcon className="w-5 h-5" />
                      </span>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>

                  {/* Guarantees */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">30-Day Money-Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <AcademicCapIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">Lifetime Access</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <ShareIcon className="w-4 h-4" />
                      Share
                    </button>
                    <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <GiftIcon className="w-4 h-4" />
                      Gift
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Features Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                  This course includes
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: VideoCameraIcon, text: `${totalVideos} HD video lessons`, color: "blue" },
                    { icon: ClockIcon, text: `${totalDuration} of content`, color: "green" },
                    { icon: DocumentTextIcon, text: "Downloadable resources", color: "purple" },
                    { icon: PuzzlePieceIcon, text: "Interactive coding exercises", color: "red" },
                    { icon: TrophyIcon, text: "Certificate of completion", color: "yellow" },
                    { icon: UsersIcon, text: "Access to student community", color: "indigo" },
                    { icon: GlobeAltIcon, text: "Available in English", color: "pink" },
                    { icon: DevicePhoneMobileIcon, text: "Access on mobile and TV", color: "gray" }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${item.color}-600`} />
                        </div>
                        <span className="text-gray-700 font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructor Card */}
              {course.courseAuthor && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Your Instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {course.courseAuthor.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        {course.courseAuthor}
                        <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                      </p>
                      <p className="text-sm text-gray-600">Expert Instructor</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}