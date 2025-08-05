import React, { Suspense } from 'react';
import OrderTrackingClient from './order-tracking-client';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface OrderTrackingPageProps {
  params: Promise<{ 'order-id': string }>;
}

async function OrderTrackingContent({ params }: { params: { 'order-id': string } }) {
  const orderId = params['order-id'];

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Invalid order ID</p>
        </div>
      </div>
    );
  }

  return <OrderTrackingClient orderId={orderId} />;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order tracking...</p>
          </div>
        </div>
      }
    >
      <OrderTrackingContent params={resolvedParams} />
    </Suspense>
  );
}

export function generateMetadata({ params }: OrderTrackingPageProps) {
  return {
    title: 'Order Tracking - Unpuzzle',
    description: 'Track your course purchase order status',
  };
}