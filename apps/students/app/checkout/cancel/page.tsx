"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircleIcon, ArrowLeftIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { LoadingButton } from '@/app/components/navigation/LoadingButton';

function CheckoutCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');

  const handleRetryPayment = () => {
    if (courseId) {
      router.push(`/checkout/${courseId}`);
    } else {
      router.push('/courses');
    }
  };

  const handleBrowseCourses = () => {
    router.push('/courses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            Your payment was cancelled and no charges were made. You can try again or browse other courses.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {courseId && (
              <LoadingButton
                onClick={handleRetryPayment}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <CreditCardIcon className="w-5 h-5" />
                Try Again
              </LoadingButton>
            )}

            <LoadingButton
              onClick={handleBrowseCourses}
              className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Browse Courses
            </LoadingButton>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-gray-600 mb-8">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  );
}