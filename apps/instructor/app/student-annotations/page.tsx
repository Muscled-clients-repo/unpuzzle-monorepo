"use client";

import VideoScreen from "../components/screens/Videos/VideoScreen";
import { CourseProvider } from "../context/CourseContext";

export default function StudentAnnotations() {
  return (
    <div className="dark:bg-[#0F0F0F] dark:text-white">
      <CourseProvider>
        <VideoScreen />
      </CourseProvider>
    </div>
  );
}
