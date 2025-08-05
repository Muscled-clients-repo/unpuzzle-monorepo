import { Metadata } from "next";
import { headers } from "next/headers";
import { getCourseById } from "../../../services/course.service";
import { generateSEOMetadata, generateCourseSchema } from "@unpuzzle/ui";
import { SEOStructuredData } from "@unpuzzle/ui";
import CourseDetailClient from "./course-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const headersList = await headers();
    
    // Safe check for id
    if (!resolvedParams?.id) {
      return {
        title: "Course Not Found - Unpuzzle",
        description: "The requested course could not be found.",
      };
    }
    
    // Extract cookies, authorization, and origin headers
    const cookieHeader = headersList.get('cookie');
    const authHeader = headersList.get('authorization');
    const hostHeader = headersList.get('host');
    
    const forwardHeaders: HeadersInit = {};
    if (cookieHeader) {
      forwardHeaders['cookie'] = cookieHeader;
    }
    if (authHeader) {
      forwardHeaders['authorization'] = authHeader;
    }
    if (hostHeader) {
      forwardHeaders['origin'] = `https://${hostHeader}`;
    }
    
    const course = await getCourseById(resolvedParams.id, forwardHeaders);
    
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
  let course: any = null;

  try {
    const headersList = await headers();
    
    // Extract cookies, authorization, and origin headers
    const cookieHeader = headersList.get('cookie');
    const authHeader = headersList.get('authorization');
    const hostHeader = headersList.get('host');
    
    const forwardHeaders: HeadersInit = {};
    if (cookieHeader) {
      forwardHeaders['cookie'] = cookieHeader;
    }
    if (authHeader) {
      forwardHeaders['authorization'] = authHeader;
    }
    if (hostHeader) {
      forwardHeaders['origin'] = `https://${hostHeader}`;
    }
    
    course = await getCourseById(courseId, forwardHeaders);
    
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
      <CourseDetailClient courseId={courseId} initialCourseData={course} breadcrumbItems={breadcrumbItems} />
    </>
  );
}