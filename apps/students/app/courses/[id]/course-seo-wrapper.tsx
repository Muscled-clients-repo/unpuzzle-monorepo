import { Metadata } from "next";
import { getCourseById } from "../../services/course.service";
import { generateSEOMetadata, generateCourseSchema } from "../../utils/seo.utils";
import SEOStructuredData from "../../components/shared/seo-structured-data";
import SEOBreadcrumb from "../../components/shared/seo-breadcrumb";
import CourseDetailClient from "./course-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    
    // Safe check for id
    if (!resolvedParams?.id) {
      return {
        title: "Course Not Found - Unpuzzle",
        description: "The requested course could not be found.",
      };
    }
    
    const course = await getCourseById(resolvedParams.id);
    
    if (!course) {
      return {
        title: "Course Not Found - Unpuzzle",
        description: "The requested course could not be found.",
      };
    }

    return generateSEOMetadata({
      title: `${course.title} - Unpuzzle Course`,
      description: course.description || `Learn ${course.title} with interactive puzzles and AI-powered assistance on Unpuzzle.`,
      keywords: `${course.title}, online course, interactive learning, ${course.category || 'education'}`,
      image: course.thumbnail || "/assets/courseThumbnail.svg",
      url: `/courses/${course.id}`,
      type: "article",
    });
  } catch (error) {
    return {
      title: "Course - Unpuzzle",
      description: "Explore our interactive courses on Unpuzzle.",
    };
  }
}

export default async function CourseSEOWrapper({ courseId }: { courseId: string }) {
  let courseSchema: ReturnType<typeof generateCourseSchema> | null = null;
  let breadcrumbItems = [
    { name: "Courses", url: "/courses" },
  ];

  try {
    const course = await getCourseById(courseId);
    
    if (course) {
      courseSchema = generateCourseSchema({
        id: course.id,
        title: course.title,
        description: course.description || "",
        instructor: course.courseAuthor || course.created_by || "Unpuzzle Instructor",
        price: course.price,
        rating: course.rating,
        studentsCount: course.reviewCount,
        duration: course.duration,
        level: course.category,
      });

      breadcrumbItems.push({
        name: course.title,
        url: `/courses/${course.id}`,
      });
    }
  } catch (error) {
    console.error("Error fetching course for SEO:", error);
  }

  return (
    <>
      {courseSchema && <SEOStructuredData data={courseSchema} />}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>
        <CourseDetailClient courseId={courseId} />
      </div>
    </>
  );
}