import React from "react";
import CourseVideoViewer from "../../components/videos/course-video-viewer";
import { VideoTimeProvider } from "../../context/VideoTimeContext";
import Header from "../../ssrComponent/Header";
import { CourseProvider } from "@/app/context/CourseContext";

const page = () => {
  return (
    <CourseProvider>
      <VideoTimeProvider>
        <Header />
        <CourseVideoViewer />
      </VideoTimeProvider>
    </CourseProvider>
  );
};

export default page;
