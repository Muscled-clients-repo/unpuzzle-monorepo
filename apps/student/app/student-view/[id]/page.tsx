import React from "react";
import { VideoTimeProvider } from "../../context/VideoTimeContext";
import CourseVideoViewer from "../../components/videos/course-video-viewer";
import { CourseProvider } from "@/app/context/CourseContext";
const page = () => {
  return (
    <CourseProvider>
      <VideoTimeProvider>
        <CourseVideoViewer />
      </VideoTimeProvider>
    </CourseProvider>
  );
};

export default page;
