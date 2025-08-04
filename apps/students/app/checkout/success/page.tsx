"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { LoadingButton } from '@/app/components/navigation/LoadingButton';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');

  useEffect(() => {
    // Auto-redirect after 5 seconds if course_id is available
    if (courseId) {
      const timer = setTimeout(() => {
        router.push(`/courses/${courseId}/learn`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [courseId, router]);

  const handleContinue = () => {
    if (courseId) {
      router.push(`/courses/${courseId}/learn`);
    } else {
      router.push('/my-courses');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Congratulations! Your enrollment has been confirmed. You now have full access to the course content.
          </p>

          {/* Action Button */}
          <LoadingButton
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Start Learning
            <ArrowRightIcon className="w-5 h-5" />
          </LoadingButton>

          {/* Auto-redirect Notice */}
          {courseId && (
            <p className="text-sm text-gray-500 mt-4">
              You will be automatically redirected to the course in a few seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Loading your course details...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}