import React, { use } from "react";
import { VideoTimeProvider } from "../../context/VideoTimeContext";
import CourseVideoViewer from "../../components/videos/course-video-viewer";
import { CourseProvider } from "@/app/context/CourseContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for build time - returns empty array for dynamic generation
export async function generateStaticParams() {
  // Return empty array to allow all dynamic routes
  return [];
}

const StudentViewPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  
  // Safe check for id
  if (!resolvedParams?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Invalid ID</span>
      </div>
    );
  }
  
  return (
    <CourseProvider>
      <VideoTimeProvider>
        <CourseVideoViewer />
      </VideoTimeProvider>
    </CourseProvider>
  );
};

export default StudentViewPage;
