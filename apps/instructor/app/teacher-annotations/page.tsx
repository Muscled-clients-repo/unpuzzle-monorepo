"use client";

import React from "react";
import Image from "next/image";
import VideoTeacherScreen from "../components/screens/VideoAnnotationTeacher/VideoTeacherScreen";
// import Header from "../ssrComponent/Header";
// test import
// import Play from "/assets/playPlayer.svg";

function TeacherAnnotations() {
  return (
    <div className="dark:bg-[#0F0F0F] dark:text-white h-12">
      <VideoTeacherScreen />
    </div>
    //   <AnnotationsPuzzleJourney />
  );
}

export default TeacherAnnotations;
