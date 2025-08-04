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
      notFound();
    }

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
    
    // Fetch course data server-side
    const course = await getCourseById(resolvedParams.id, forwardHeaders);
    
    if (!course) {
      notFound();
    }
    
    return <CheckoutClient courseId={resolvedParams.id} initialCourseData={course} />;
  } catch (error) {
    console.error('Error in checkout page:', error);
    notFound();
  }
}