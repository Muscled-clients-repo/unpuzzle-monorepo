import { use } from "react";
import CourseSEOWrapper from "./course-seo-wrapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export { generateMetadata } from "./course-seo-wrapper";

// Generate static params for build time - returns empty array for dynamic generation
export async function generateStaticParams() {
  // Return empty array to allow all dynamic routes
  // You can fetch and return actual course IDs here if you want static generation
  return [];
}

export default function CoursePage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  // Safe check for id
  if (!resolvedParams?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Invalid course ID</span>
      </div>
    );
  }
  
  return <CourseSEOWrapper courseId={resolvedParams.id} />;
}