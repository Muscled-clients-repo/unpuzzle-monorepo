import CheckoutClient from './checkout-client';
import { notFound } from 'next/navigation';

// Generate static params for known routes (optional)
export async function generateStaticParams() {
  // Return empty array to enable dynamic generation
  return [];
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    
    // Basic validation
    if (!id || typeof id !== 'string') {
      notFound();
    }

    return <CheckoutClient courseId={id} />;
  } catch (error) {
    console.error('Error in checkout page:', error);
    notFound();
  }
}