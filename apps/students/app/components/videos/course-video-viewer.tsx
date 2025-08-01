"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ViewAllCommentProvider } from "../../context/ViewAllCommentContext";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCourse } from "../../hooks/useCourse";
import Header from "@/app/ssrComponent/Header";
import { VideoPlayerErrorBoundary } from "../shared/component-error-boundary";

// Dynamic imports for performance
const NewVideoPlayer = dynamic(() => import("./enhanced-video-player"), {
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-gray-500">Loading video player...</div>
    </div>
  ),
  ssr: false // Video player should only render on client
});

const InstructorProfileCard = dynamic(() => import("./instructor-profile-card"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
});

const VideoDetailSection = dynamic(() => import("./video-metadata-section"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
});

const CourseContentNavigator = dynamic(() => import("./course-content-navigator"), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
});

const VideoEngagementStats = dynamic(() => import("./video-engagement-stats"), {
  loading: () => <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
});

const VideoScreen: React.FC = () => {
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const params = useParams(); // /course/[courseId]
  const searchParams = useSearchParams(); // ?video-id=1234&chapter-id=5678
  const { course, chapter, video, loading, getCourseById } = useCourse();

  // Safe extraction of courseId with type safety
  const courseId = params && typeof params === 'object' && 'id' in params && typeof params.id === 'string' 
    ? params.id 
    : undefined;
    
  const queryVideoId = searchParams.get("video-id");
  const queryChapterId = searchParams.get("chapter-id");

  // Determine view type from URL
  const path = usePathname();
  useEffect(() => {
    if (!course) return;
    // Handle chapterId
    if (queryChapterId) {
      setChapterId(queryChapterId);
    } else if (course.chapters?.length > 0) {
      setChapterId(course.chapters[0].id);
    }

    // Handle videoId
    if (queryVideoId) {
      setVideoId(queryVideoId);
    } else if (course.chapters?.[0]?.videos?.length > 0) {
      setVideoId(course.chapters[0].videos[0].id);
    }
  }, [course, queryChapterId, queryVideoId]);

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId);
    }
  }, [courseId]);

  // Render loading or not found
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span>Loading...</span>
      </div>
    );
  }

  if (!course || (Array.isArray(course) && course.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span>No course with the provided ID available</span>
      </div>
    );
  }

  let rightSideContent: React.ReactNode = null;
  if (path.includes("/student-view/")) {
    rightSideContent = (
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          <ViewAllCommentProvider>
            <VideoEngagementStats />
            {/* Course Content */}
            <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
              <CourseContentNavigator />
            </div>
          </ViewAllCommentProvider>
        </div>
      </div>
    );
  } else if (path.includes("/course/")) {
    rightSideContent = (
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          <ViewAllCommentProvider>
            {video && (
              <>
                <InstructorProfileCard video={video} />
                {/* Course Content */}
                <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
                  <CourseContentNavigator />
                </div>
              </>
            )}
          </ViewAllCommentProvider>
        </div>
      </div>
    );
  } else {
    rightSideContent = (
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          {/* <InstructorProfileCard /> */}
          {/* Course Content */}
          <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
            <VideoEngagementStats />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-[20px]">
      {/* Left Side: Video Player and Content */}
      <div className="flex flex-col flex-1 w-[70%] mt-4">
        <div className="mb-6">
          <VideoPlayerErrorBoundary>
            <NewVideoPlayer />
          </VideoPlayerErrorBoundary>
          <VideoDetailSection video={video} />
        </div>
      </div>

      {/* Right Side: Rendered based on URL */}
      {rightSideContent}
    </div>
  );
};

export default VideoScreen;
