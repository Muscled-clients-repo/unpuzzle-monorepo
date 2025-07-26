"use client";
// custom files
import { ViewAllCommentProvider } from "@/context/ViewAllCommentContext";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import CourseInstructorDetail from "@/components/features/course/CourseInstructorDetail";
import VideoDetailSection from "./VideoDetailSection";
import { useCourse } from "@/hooks/useCourse";
import Header from "@/ssrComponent/Header";
import NewVideoPlayer from "./NewVideoPlayer";
import { useEffect, useState } from "react";
import CourseContent from "@/components/content/CourseContent";
import VideoStats from "@/components/analytics/VideoStats";

type UserRole = "teacher" | "student" | "admin" | "guest";
const VideoScreen: React.FC = () => {
  const userRole: UserRole = "teacher"; // Hardcoded for demonstration
  const canEdit: boolean = userRole === "teacher" || userRole === "student";
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const params = useParams(); // /course/[courseId]
  const searchParams = useSearchParams(); // ?video-id=1234&chapter-id=5678
  const { course, chapter, video, loading, getCourseById } = useCourse();

  const courseId = params?.id as string | undefined;
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
            {video && (
              <>
                <CourseInstructorDetail video={video} />
                {/* Course Content */}
                <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
                  <CourseContent />
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
          <NewVideoPlayer />
          <VideoDetailSection video={video} />
        </div>
      </div>

      {/* Right Side: Rendered based on URL */}
      {rightSideContent}
    </div>
  );
};

export default VideoScreen;
