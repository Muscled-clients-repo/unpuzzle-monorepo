"use client";

import dynamic from "next/dynamic";

// const CourseInstructorDetailClient = dynamic(
//   () => import("./CourseInstructorDetailClient"),
//   { ssr: false }
// );
const CourseInstructorDetailClient = dynamic(() => import("./AIAgents"), {
  ssr: false,
});
export default CourseInstructorDetailClient;
