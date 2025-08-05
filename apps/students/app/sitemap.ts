import { MetadataRoute } from 'next';
import { getAllCourses } from '../services/course.service';
import { Course } from '../types/course.types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_CORE_SERVER_URL || 'https://core.nazmulcodes.org';
  
  // Get all courses - handle auth errors during build
  let courses: Course[] = [];
  try {
    courses = await getAllCourses();
  } catch (error) {
    console.warn('Could not fetch courses for sitemap during build:', error);
    courses = [];
  }
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/my-courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];
  
  // Dynamic course pages
  const coursePages = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(course.updated_at || course.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...coursePages];
}