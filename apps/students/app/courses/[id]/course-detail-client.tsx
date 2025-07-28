"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCourseDetails, useCourses } from "@/app/hooks/useCourses";
import { CheckCircleIcon, ClockIcon, PlayCircleIcon, StarIcon, UsersIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "@/app/components/shared/ui/loading-spinner";

interface CourseDetailClientProps {
  courseId: string;
}

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const { course, loading, error } = useCourseDetails(courseId);
  const { enrollInCourse } = useCourses();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");

  const handleEnroll = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <nav className="text-sm breadcrumbs">
                <ul className="flex items-center space-x-2">
                  <li><Link href="/courses" className="hover:underline">Courses</Link></li>
                  <li className="before:content-['/'] before:mx-2">{course.category || "General"}</li>
                </ul>
              </nav>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-100 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-200">(1,234 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>12,456 students</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{totalDuration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling || course.enrolled}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isEnrolling ? "Processing..." : course.enrolled ? "Continue Learning" : `Enroll for $${course.price}`}
                </button>
                <button className="p-4 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all">
                  <PlayCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={course.thumbnail || "/default-course-thumbnail.jpg"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button className="p-6 bg-white/90 rounded-full hover:bg-white transition-all shadow-lg">
                  <PlayCircleIcon className="w-12 h-12 text-blue-600" />
                </button>
              </div>
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
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Master core concepts through interactive puzzles",
                          "Build real-world projects with AI guidance",
                          "Learn at your own pace with personalized feedback",
                          "Access lifetime updates and community support"
                        ].map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-4">Course Features</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <TrophyIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-semibold">Interactive Learning</h3>
                          <p className="text-sm text-gray-600">Solve puzzles and challenges</p>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <BookOpenIcon className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="font-semibold">AI Assistance</h3>
                          <p className="text-sm text-gray-600">Get help when you need it</p>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <UsersIcon className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-semibold">Community</h3>
                          <p className="text-sm text-gray-600">Learn with peers</p>
                        </div>
                      </div>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">This course includes:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PlayCircleIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{totalVideos} on-demand videos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{totalDuration} of content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Interactive exercises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Access to community</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">${course.price}</span>
                  {course.price > 0 && (
                    <span className="text-sm text-gray-500 line-through">${(course.price * 1.5).toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling || course.enrolled}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? "Processing..." : course.enrolled ? "Continue Learning" : "Enroll Now"}
                </button>
                <p className="text-center text-sm text-gray-600 mt-3">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              <div className="pt-4 border-t space-y-3">
                <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  Share Course
                </button>
                <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  Gift This Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}