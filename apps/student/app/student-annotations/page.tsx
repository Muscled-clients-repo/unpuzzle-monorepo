"use client";

import { VideoTimeProvider } from "../context/VideoTimeContext";
import CourseVideoViewer from "../components/videos/course-video-viewer";
import { CourseProvider } from "../context/CourseContext";

export default function StudentAnnotations() {
  return (
    <div className="dark:bg-[#0F0F0F] dark:text-white">
      <CourseProvider>
        <VideoTimeProvider>
          <CourseVideoViewer />
        </VideoTimeProvider>
      </CourseProvider>
    </div>
  );
}
