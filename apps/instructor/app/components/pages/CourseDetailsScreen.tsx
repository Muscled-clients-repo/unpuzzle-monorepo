"use client";

import React, { useState, useEffect } from "react";
import { useGetCoursesQuery } from "../../redux/services/course.services";
import { useGetAllVideosQuery } from "../../redux/services/video.services";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import CourseVideoPlayer from "../video/CourseVideoPlayer";
import Image from "next/image";

interface CourseDetailsScreenProps {
  courseId: string;
}

interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  description?: string;
  order?: number;
}

interface Chapter {
  id: string;
  title: string;
  videos: Video[];
  order?: number;
}

const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({ courseId }) => {
  const { navigate } = useNavigationWithLoading();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  
  const { data: coursesData, isLoading: courseLoading } = useGetCoursesQuery(undefined);
  const { data: videosData, isLoading: videosLoading } = useGetAllVideosQuery(undefined);
  
  const course = coursesData?.data?.find((c: any) => c.id === courseId);
  const videos = videosData?.filter((v: any) => v.courseId === courseId) || [];

  // Set the first video as selected by default
  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  // Mock chapters data - in real app this would come from API
  const chapters: Chapter[] = React.useMemo(() => {
    if (videos.length === 0) return [];
    
    // Group videos into chapters (mock implementation)
    const chapterCount = Math.ceil(videos.length / 3);
    const chaptersArray: Chapter[] = [];
    
    for (let i = 0; i < chapterCount; i++) {
      const startIdx = i * 3;
      const endIdx = Math.min((i + 1) * 3, videos.length);
      const chapterVideos = videos.slice(startIdx, endIdx);
      
      chaptersArray.push({
        id: `chapter-${i + 1}`,
        title: `Chapter ${i + 1}: ${i === 0 ? 'Introduction' : i === chapterCount - 1 ? 'Advanced Topics' : 'Core Concepts'}`,
        videos: chapterVideos,
        order: i + 1
      });
    }
    
    return chaptersArray;
  }, [videos]);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const getNextVideo = () => {
    if (!selectedVideo) return null;
    const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
    return currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
  };

  const getPreviousVideo = () => {
    if (!selectedVideo) return null;
    const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
    return currentIndex > 0 ? videos[currentIndex - 1] : null;
  };

  if (courseLoading || videosLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <CourseVideoPlayer
                  video={selectedVideo}
                  onNext={getNextVideo() ? () => handleVideoSelect(getNextVideo()!) : undefined}
                  onPrevious={getPreviousVideo() ? () => handleVideoSelect(getPreviousVideo()!) : undefined}
                />
                
                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedVideo.description || "No description available"}
                  </p>
                  
                  {/* Video Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => getPreviousVideo() && handleVideoSelect(getPreviousVideo()!)}
                      disabled={!getPreviousVideo()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        getPreviousVideo() 
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <button
                      onClick={() => getNextVideo() && handleVideoSelect(getNextVideo()!)}
                      disabled={!getNextVideo()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        getNextVideo() 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No video selected</h3>
                <p className="text-gray-500">Select a video from the course content to start watching</p>
              </div>
            )}
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {videos.length} lessons • {course.duration || "2h 30m"}
                </p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="border-b border-gray-200 last:border-b-0">
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedChapters.has(chapter.id) ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">{chapter.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">{chapter.videos.length} lessons</span>
                    </button>
                    
                    {/* Chapter Videos */}
                    {expandedChapters.has(chapter.id) && (
                      <div className="bg-gray-50">
                        {chapter.videos.map((video, index) => (
                          <button
                            key={video.id}
                            onClick={() => handleVideoSelect(video)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                              selectedVideo?.id === video.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {selectedVideo?.id === video.id ? (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`text-sm ${selectedVideo?.id === video.id ? "font-medium text-gray-900" : "text-gray-700"}`}>
                                {video.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{video.duration || "5:00"}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Info Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-4">About this course</h4>
              <p className="text-sm text-gray-600 mb-4">
                {course.description || "Learn the fundamentals and advanced techniques in this comprehensive course."}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Duration: {course.duration || "2h 30m"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-gray-600">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-gray-600">{videos.length} lessons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsScreen;