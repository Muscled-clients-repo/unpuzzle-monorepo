"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { VideoTimeProvider } from "../../context/VideoTimeContext";

const VideoTeacherScreen = dynamic(
  () => import("../../components/video/VideoTeacherScreen"),
  { ssr: false }
);
// import Header from "../ssrComponent/Header";
// test import
// import Play from "/assets/playPlayer.svg";

function TeacherAnnotations() {
  return (
    <VideoTimeProvider>
      <div className="dark:bg-[#0F0F0F] dark:text-white h-12">
        <VideoTeacherScreen />
      </div>
    </VideoTimeProvider>
    //   <AnnotationsPuzzleJourney />
  );
}

export default TeacherAnnotations;
