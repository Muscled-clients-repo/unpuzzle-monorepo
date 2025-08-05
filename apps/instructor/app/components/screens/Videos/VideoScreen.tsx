"use client";
// custom files
import { ViewAllCommentProvider } from "../../../context/ViewAllCommentContext";
import {
  useGetCourseByIdQuery,
  useDeleteCourseMutation,
  setCurrentCourse,
  setSelectedChapterAndVideo,
  selectSelectedChapter,
  selectSelectedVideo,
  selectUserRole,
} from "../../../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import CourseInstructorDetail from "./CourseInstructorDetail";
import VideoDetailSection from "./VideoDetailSection";
import Header from "@/app/ssrComponent/Header";
import NewVideoPlayer from "./NewVideoPlayer";
import { useEffect, useState, useMemo } from "react";
import CourseContent from "./CourseContent";
import VideoStats from "./VideoStats";
import LoadingSpinner from "../Loading";

const VideoScreen: React.FC = () => {
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const canEdit: boolean = userRole === "teacher" || userRole === "instructor" || userRole === "admin";

  const params = useParams(); // /course/[courseId]
  const searchParams = useSearchParams(); // ?video-id=1234&chapter-id=5678

  const courseId = params?.id as string; // Always a string
  // const courseId = "1582cb30-0c96-49d5-813d-d134c2366528";
  const queryVideoId = searchParams.get("video-id");
  const queryChapterId = searchParams.get("chapter-id");

  // Get selected chapter and video from Redux
  const chapter = useSelector(selectSelectedChapter);
  const video = useSelector(selectSelectedVideo);

  // Fetch only the course by ID
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCourseByIdQuery({ id: courseId });

  // Update Redux state when course data loads or URL params change
  useEffect(() => {
    if (course) {
      console.log("course is: ", course);
      // Set current course in Redux
      dispatch(setCurrentCourse(course));

      // Set selected chapter and video based on URL params
      dispatch(
        setSelectedChapterAndVideo({
          chapterId: queryChapterId || undefined,
          videoId: queryVideoId || undefined,
        })
      );
    }
  }, [course, queryChapterId, queryVideoId, dispatch]);

  // Render loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-500">
        <span>
          Error loading course data:{" "}
          {error && typeof error === "object" && "message" in error
            ? (error as any).message
            : "Unknown error"}
        </span>
        <button
          onClick={() => refetch()}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render not found
  if (!course) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span>No course found with the provided ID</span>
      </div>
    );
  }

  // Check if course has any videos at all
  const hasVideosInCourse = course.chapters?.some(
    ch => ch.videos && ch.videos.length > 0
  );

  // Render if no videos exist in any chapter
  if (!hasVideosInCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h2>
          <p className="text-gray-600">This course doesn't have any videos yet.</p>
        </div>
      </div>
    );
  }

  // Render if chapter/video selection failed (shouldn't happen with proper Redux logic)
  if (!chapter || !video) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span>Loading video selection...</span>
      </div>
    );
  }

  // Determine view type from URL
  const path = usePathname();
  let rightSideContent = null;
  if (path.includes("/student-view/")) {
    rightSideContent = (
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          <ViewAllCommentProvider>
            <VideoStats />
            {/* Course Content */}
            <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
              <CourseContent />
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
            {/* Only show AI Agents if there are videos in the course */}
            {hasVideosInCourse && video && (
              <CourseInstructorDetail video={video} />
            )}
            {/* Course Content - always show to display chapters */}
            <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
              <CourseContent />
            </div>
          </ViewAllCommentProvider>
        </div>
      </div>
    );
  } else {
    rightSideContent = (
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          {/* <CourseInstructorDetail /> */}
          {/* Course Content */}
          <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
            <VideoStats />
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
          <NewVideoPlayer video={video} />
          <VideoDetailSection video={video} />
        </div>
      </div>

      {/* Right Side: Rendered based on URL */}
      {rightSideContent}
    </div>
  );
};

export default VideoScreen;
