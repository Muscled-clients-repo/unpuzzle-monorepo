"use client";

import dynamic from "next/dynamic";

const CourseInstructorDetailClient = dynamic(
  () => import("./CourseInstructorDetailClient"),
  { ssr: false }
);

export default CourseInstructorDetailClient;
