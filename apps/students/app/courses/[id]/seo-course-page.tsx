import { use } from "react";
import CourseSEOWrapper from "./course-seo-wrapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export { generateMetadata } from "./course-seo-wrapper";

export default function CoursePage({ params }: PageProps) {
  const { id } = use(params);
  return <CourseSEOWrapper courseId={id} />;
}