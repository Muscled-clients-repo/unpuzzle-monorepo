"use client";

import React from "react";
import { useParams } from "next/navigation";
import CourseDetailsScreen from "../../../components/pages/CourseDetailsScreen";
import { VideoTimeProvider } from "../../../context/VideoTimeContext";
import { CourseProvider } from "../../../context/CourseContext";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;

  return (
    <CourseProvider>
      <VideoTimeProvider>
        <CourseDetailsScreen courseId={courseId} />
      </VideoTimeProvider>
    </CourseProvider>
  );
}