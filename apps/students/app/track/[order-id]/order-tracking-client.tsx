"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { useCourseDetails } from '@/hooks/useCourses';
import { OrderStatusIndicator } from '@unpuzzle/ui';
import { LoadingButton } from '@/components/navigation/LoadingButton';
import { LoadingLink } from '@/components/navigation/LoadingLink';
import Image from 'next/image';
import { 
  ArrowPathIcon, 
  ArrowRightIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface OrderTrackingClientProps {
  orderId: string;
}

export default function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const router = useRouter();
  const { order, loading, error, refetch } = useOrder(orderId);
  const { course, loading: courseLoading } = useCourseDetails(order?.courseId || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket connection for real-time updates
  useEffect(() => {
    // TODO: Implement socket connection for real-time order updates
    // When socket.io is implemented, replace polling with:
    // 
    // import { useSocket } from '@/services/socket.service';
    // const { subscribeToOrder, unsubscribeFromOrder } = useSocket({
    //   onOrderUpdate: (updatedOrder) => {
    //     setOrder(updatedOrder);
    //   },
    //   onPaymentStatusChange: (status) => {
    //     if (status === 'paid') {
    //       refetch();
    //     }
    //   }
    // });
    // 
    // subscribeToOrder(orderId);
    // return () => unsubscribeFromOrder(orderId);
    
    // For now, use polling as fallback
    const checkOrderStatus = () => {
      if (order?.status === 'pending') {
        // Poll every 5 seconds if order is still pending
        const interval = setInterval(() => {
          refetch();
        }, 5000);

        return () => clearInterval(interval);
      }
    };

    return checkOrderStatus();
  }, [order?.status, refetch, orderId]);

  // Redirect to course page if payment is successful
  useEffect(() => {
    if (order?.status === 'paid' && order?.courseId) {
      // Set the session storage flag for enrollment polling
      sessionStorage.setItem(`recent_purchase_${order.courseId}`, 'true');
      
      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push(`/courses/${order.courseId}?refresh=${Date.now()}`);
      }, 3000);
    }
  }, [order?.status, order?.courseId, router]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100); // Convert from cents
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'We couldn\'t find the order you\'re looking for.'}
            </p>
            <LoadingLink href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Return to Home
            </LoadingLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
            <p className="text-gray-600">Order ID: {order.id}</p>
          </div>

          {/* Order Status Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Order Status</h2>
                  <OrderStatusIndicator status={order.status} size="lg" />
                </div>
                <LoadingButton
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || order.status === 'paid'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  loadingText="Refreshing..."
                  showSpinner={false}
                >
                  <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Status
                </LoadingButton>
              </div>

              {/* Status-specific messages */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                {order.status === 'pending' && (
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">
                      Your payment is being processed. This usually takes a few seconds.
                    </p>
                    <p className="text-sm text-gray-600">
                      The page will automatically update when your payment is confirmed.
                    </p>
                  </div>
                )}
                {order.status === 'paid' && (
                  <div className="text-center">
                    <p className="text-green-700 font-medium mb-2">
                      Payment successful! You now have access to the course.
                    </p>
                    <p className="text-sm text-gray-600">
                      Redirecting to your course...
                    </p>
                  </div>
                )}
                {order.status === 'failed' && (
                  <div className="text-center">
                    <p className="text-red-700 mb-2">
                      Your payment could not be processed.
                    </p>
                    <p className="text-sm text-gray-600">
                      Please check your payment details and try again.
                    </p>
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="text-center">
                    <p className="text-gray-700">
                      This order has been cancelled.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <CreditCardIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(order.amount, order.currency)}
                    </p>
                  </div>
                </div>

                {order.paymentIntentId && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Reference</p>
                      <p className="font-mono text-sm">{order.paymentIntentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Information */}
          {(course || order.courseName) && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-6">Course Details</h3>
                <div className="flex gap-6">
                  {(course?.thumbnail || order.courseThumbnail) && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course?.thumbnail || order.courseThumbnail || '/assets/courseThumbnail.svg'}
                        alt={course?.title || order.courseName || 'Course'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-2">
                      {course?.title || order.courseName}
                    </h4>
                    {course?.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            {order.status === 'failed' && (
              <LoadingButton
                onClick={() => router.push(`/checkout/${order.courseId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Try Again
                <ArrowRightIcon className="w-5 h-5" />
              </LoadingButton>
            )}
            {order.status === 'cancelled' && (
              <LoadingButton
                onClick={() => router.push(`/courses/${order.courseId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                View Course
                <ArrowRightIcon className="w-5 h-5" />
              </LoadingButton>
            )}
            <LoadingLink
              href="/my-courses"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              My Courses
            </LoadingLink>
          </div>
        </div>
      </div>
    </div>
  );
}