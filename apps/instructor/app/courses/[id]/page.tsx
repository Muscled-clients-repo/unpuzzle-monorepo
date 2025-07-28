import React from "react";
import VideoScreen from "../../components/video/VideoScreen";
import { VideoTimeProvider } from "../../context/VideoTimeContext";
import Header from "../../ssrComponent/Header";
import { CourseProvider } from "../../context/CourseContext";

const page = () => {
  return (
    <CourseProvider>
      <VideoTimeProvider>
        <Header />
        <VideoScreen />
      </VideoTimeProvider>
    </CourseProvider>
  );
};

export default page;
