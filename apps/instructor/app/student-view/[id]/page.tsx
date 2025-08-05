import React from "react";
import VideoScreen from "../../components/screens/Videos/VideoScreen";
import { CourseProvider } from "@/app/context/CourseContext";
const page = () => {
  return (
    <CourseProvider>
      
        <VideoScreen />
      
    </CourseProvider>
  );
};

export default page;
