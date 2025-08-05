import React from "react";
import RootLayout from "../ssrComponent/Layout";
import VideoScreen from "../components/screens/Videos/VideoScreen";
import Header from "../ssrComponent/Header";
import Tiers from "../tiers/Tiers";
import CourseVideoPlayer from "../components/screens/VideoEditor/CourseVideoPlayer";
import { CourseProvider } from "../context/CourseContext";
import { CourseContext } from "../context/CourseContext";
const page = () => {
  return (
    // <CourseProvider>
    <>
      <Header />
      <VideoScreen />
    </>
    // </CourseProvider>
  );
};

export default page;
