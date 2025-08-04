import { headers } from "next/headers";
import { getCourseById } from "../../services/course.service";
import CheckoutClient from './checkout-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for build time - returns empty array for dynamic generation
export async function generateStaticParams() {
  // Return empty array to allow all dynamic routes at build time
  return [];
}

export default async function CheckoutPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    
    // Safe check for id
    if (!resolvedParams?.id) {
      console.error('CheckoutPage: Missing course ID');
      notFound();
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(resolvedParams.id)) {
      console.error('CheckoutPage: Invalid course ID format:', resolvedParams.id);
      notFound();
    }

    console.log('CheckoutPage: Fetching course data for ID:', resolvedParams.id);

    const headersList = await headers();
    
    // Extract cookies, authorization, and origin headers for API calls
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
    
    // Fetch course data server-side with timeout protection
    let course;
    try {
      course = await Promise.race([
        getCourseById(resolvedParams.id, forwardHeaders),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Course fetch timeout')), 15000)
        )
      ]);
    } catch (fetchError) {
      console.error('CheckoutPage: Failed to fetch course data:', fetchError);
      // Return a fallback that will use client-side data fetching
      return <CheckoutClient courseId={resolvedParams.id} initialCourseData={null} />;
    }
    
    if (!course) {
      console.error('CheckoutPage: Course not found for ID:', resolvedParams.id);
      notFound();
    }
    
    console.log('CheckoutPage: Successfully fetched course data');
    return <CheckoutClient courseId={resolvedParams.id} initialCourseData={course} />;
  } catch (error) {
    console.error('CheckoutPage: Unexpected error:', error);
    // Fallback to client-side rendering instead of crashing
    try {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        return <CheckoutClient courseId={resolvedParams.id} initialCourseData={null} />;
      }
    } catch (fallbackError) {
      console.error('CheckoutPage: Fallback failed:', fallbackError);
    }
    notFound();
  }
}