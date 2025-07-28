"use client";

import dynamic from "next/dynamic";

// const CourseInstructorDetailClient = dynamic(
//   () => import("./CourseInstructorDetailClient"),
//   { ssr: false }
// );
const CourseInstructorDetailClient = dynamic(() => import("./ai-learning-assistant"), {
  ssr: false,
});
export default CourseInstructorDetailClient;
