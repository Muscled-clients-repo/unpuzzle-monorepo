import CheckoutClient from './checkout-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Force dynamic rendering because we use headers()
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export default async function CheckoutPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // Safe check for id
  if (!resolvedParams?.id) {
    console.error('CheckoutPage: Missing course ID');
    notFound();
  }

  // Check for build-time placeholder
  if (resolvedParams.id === '[id]') {
    console.error('CheckoutPage: Received placeholder [id] - this should not happen in production');
    notFound();
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(resolvedParams.id)) {
    console.error('CheckoutPage: Invalid course ID format:', resolvedParams.id);
    notFound();
  }

  // For checkout pages, we'll use client-side data fetching
  // This avoids the headers() issue during static generation
  return <CheckoutClient courseId={resolvedParams.id} initialCourseData={null} />;
}