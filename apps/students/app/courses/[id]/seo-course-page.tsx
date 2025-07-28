"use client";

import { notFound } from "next/navigation";
import CourseDetailClient from "./course-detail-client";

interface PageProps {
  params: { id: string };
}

export default function CoursePage({ params }: PageProps) {
  return <CourseDetailClient courseId={params.id} />;
}