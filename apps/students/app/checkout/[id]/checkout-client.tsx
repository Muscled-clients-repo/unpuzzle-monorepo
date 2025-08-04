"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { LoadingLink } from "@/app/components/navigation/LoadingLink";
import { LoadingButton } from "@/app/components/navigation/LoadingButton";
import { useNavigationLoading } from "@/app/context/NavigationLoadingContext";
import { useCourseDetails } from "@/app/hooks/useCourses";
import { useCreateEnrollMutation } from "@/app/redux/services/enroll.services";
import { CustomCheckout, useStripeCheckout } from "@unpuzzle/stripe-integration";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/api.config";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  VideoCameraIcon,
  LockClosedIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

interface CheckoutClientProps {
  courseId: string;
}

export default function CheckoutClient({ courseId }: CheckoutClientProps) {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();
  const { course, loading, error } = useCourseDetails(courseId);
  const [createEnroll, { isLoading: isEnrolling }] = useCreateEnrollMutation();
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { 
    createCourseCheckoutSession, 
    redirectToCheckout,
    isLoading: isCreatingSession 
  } = useStripeCheckout(API_ENDPOINTS.BASE.replace('/api', ''));

  useEffect(() => {
    if (!courseId || typeof courseId !== 'string') {
      notFound();
    }
  }, [courseId]);

  // Create Stripe payment intent when course loads
  useEffect(() => {
    if (course && course.price > 0 && !clientSecret) {
      handleCreatePaymentIntent();
    }
  }, [course, clientSecret]);

  const handleCreatePaymentIntent = async () => {
    if (!course || isRedirecting) return;
    
    try {
      console.log('Creating payment intent for course:', course.id);
      
      const response = await axios.post(
        `${API_ENDPOINTS.BASE}/stripe/create-course-payment-intent`,
        {
          userId: 'current-user-id', // Replace with actual user ID from auth
          courseId: course.id
        }
      );

      const data = response.data.body || response.data;
      console.log('Payment intent response:', data);

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        console.error('No client secret received:', data);
        setErrors({ payment: 'Failed to initialize payment. Please try again.' });
      }
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      setErrors({ payment: error.response?.data?.message || 'Failed to initialize payment.' });
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{isRedirecting ? 'Redirecting to payment...' : 'Loading checkout...'}</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    notFound();
  }

  if (course.enrolled) {
    router.push(`/courses/${courseId}/learn`);
    return null;
  }

  const totalVideos = course.chapters?.reduce((acc, chapter) => acc + (chapter.videos?.length || 0), 0) || 0;
  const originalPrice = course.price * 1.5;
  const discount = originalPrice - course.price;
  const discountPercentage = Math.round((discount / originalPrice) * 100);

  const handlePaymentSuccess = async () => {
    if (!course) return;
    
    try {
      // Enroll the user after successful payment
      await createEnroll({ 
        userId: 'current-user-id', // This should come from auth context
        courseId: course.id 
      }).unwrap();
      
      startNavigation();
      router.push(`/courses/${courseId}/learn`);
    } catch (error) {
      console.error('Enrollment failed:', error);
      setErrors({ payment: 'Payment succeeded but enrollment failed. Please contact support.' });
    }
  };

  const handlePaymentError = (error: string) => {
    setErrors({ payment: error });
  };

  const handleFreeEnrollment = async () => {
    if (!course) return;
    
    setProcessingPayment(true);
    try {
      await createEnroll({ 
        userId: 'current-user-id', // This should come from auth context
        courseId: course.id 
      }).unwrap();
      
      startNavigation();
      router.push(`/courses/${courseId}/learn`);
    } catch (error) {
      console.error('Free enrollment failed:', error);
      setErrors({ payment: 'Enrollment failed. Please try again.' });
    } finally {
      setProcessingPayment(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LoadingLink href={`/courses/${courseId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Back to course</span>
            </LoadingLink>
            <div className="flex items-center gap-2">
              <LockClosedIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {course.price === 0 ? (
                // Free Course Enrollment
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Free Course</h2>
                  <p className="text-gray-600 mb-6">This course is available for free. Click below to enroll.</p>
                  
                  {errors.payment && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700">{errors.payment}</p>
                    </div>
                  )}

                  <LoadingButton
                    onClick={handleFreeEnrollment}
                    disabled={processingPayment || isEnrolling}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    loadingText="Enrolling..."
                    showSpinner={true}
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Enroll for Free
                  </LoadingButton>
                </div>
              ) : (
                // Paid Course - Stripe Payment
                <div className="space-y-6">
                  {/* Error Message */}
                  {errors.payment && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700">{errors.payment}</p>
                    </div>
                  )}

                  {/* Custom Stripe Checkout - Only render if we have a clientSecret */}
                  {clientSecret ? (
                    <CustomCheckout
                      publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
                      clientSecret={clientSecret}
                      amount={course.price * 100} // Convert to cents
                      courseTitle={course.title}
                      onSuccess={async (paymentIntent) => {
                        console.log('Payment successful:', paymentIntent);
                        await handlePaymentSuccess();
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error);
                        handlePaymentError(error);
                      }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                      <p className="text-gray-600">Preparing secure checkout...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Course Info */}
                    <div className="flex gap-4">
                      <div className="relative w-24 h-16 flex-shrink-0">
                        <Image
                          src={course.thumbnail || "/assets/courseThumbnail.svg"}
                          alt={course.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          By {course.courseAuthor || "Unpuzzle Team"}
                        </p>
                      </div>
                    </div>

                    {/* Course Features */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center gap-3 text-sm">
                        <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{totalVideos} video lessons</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{course.duration || "0h"} of content</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Mobile & desktop access</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original Price</span>
                        <span className="line-through text-gray-400">${originalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount ({discountPercentage}%)</span>
                        <span className="text-green-600">-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-blue-600">${course.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckBadgeIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-900">30-Day Money-Back Guarantee</p>
                          <p className="text-sm text-green-700 mt-1">
                            Try the course risk-free. If you're not satisfied, get a full refund within 30 days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}