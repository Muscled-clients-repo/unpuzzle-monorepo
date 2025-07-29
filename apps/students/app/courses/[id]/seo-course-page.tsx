"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import CourseDetailClient from "./course-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CoursePage({ params }: PageProps) {
  const { id } = use(params);
  return <CourseDetailClient courseId={id} />;
}