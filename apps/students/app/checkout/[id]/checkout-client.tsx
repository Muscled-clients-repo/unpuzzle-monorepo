"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { LoadingLink } from "@/components/navigation/LoadingLink";
import { LoadingButton } from "@/components/navigation/LoadingButton";
import { useNavigationLoading } from "@/context/NavigationLoadingContext";
import { useCourseDetails } from "@/hooks/useCourses";
import { useCreateEnrollMutation } from "@/redux/services/enroll.services";
// import { useOrders } from "@/hooks/useOrder"; // Temporarily disabled until API issue is resolved
import { CustomCheckout, useStripeCheckout } from "@unpuzzle/stripe-integration";
import { useBaseApi } from "@/hooks/useBaseApi";
import { API_ENDPOINTS } from "@/config/api.config";
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
  initialCourseData?: any;
}

export default function CheckoutClient({ courseId, initialCourseData }: CheckoutClientProps) {
  const router = useRouter();
  const api = useBaseApi();
  const { startNavigation } = useNavigationLoading();
  const { course: reduxCourse, loading, error } = useCourseDetails(courseId, initialCourseData);
  // const { createOrder } = useOrders(); // Temporarily disabled until API issue is resolved
  
  // Debug logging
  console.log('CheckoutClient props:', { courseId, initialCourseData });
  console.log('Redux course:', reduxCourse);
  
  // Extract actual course data from API response
  const extractCourseData = (courseResponse: any) => {
    if (!courseResponse) return null;
    
    // If it's already a course object (has id, title, etc.), return as is
    if (courseResponse.id && courseResponse.title) {
      return courseResponse;
    }
    
    // If it's an API response wrapper, extract from body
    if (courseResponse.success && courseResponse.body) {
      return courseResponse.body;
    }
    
    // If it has body property but no success, still try body
    if (courseResponse.body) {
      return courseResponse.body;
    }
    
    return courseResponse;
  };

  // Prioritize initialCourseData over Redux course to prevent "not found" flash
  const course = extractCourseData(initialCourseData || reduxCourse);
  console.log('Extracted course:', course);
  
  const [createEnroll, { isLoading: isEnrolling }] = useCreateEnrollMutation();
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { 
    createCourseCheckoutSession, 
    redirectToCheckout,
    isLoading: isCreatingSession 
  } = useStripeCheckout(API_ENDPOINTS.BASE.replace('/api', ''));

  useEffect(() => {
    if (!courseId || typeof courseId !== 'string') {
      console.error('Invalid courseId:', courseId);
      // Don't call notFound() here as it can cause routing issues
      // The parent page already validates the ID
    }
  }, [courseId]);

  // Create Stripe payment intent when course loads
  useEffect(() => {
    // Ensure course is fully loaded with valid ID
    if (course && 
        course.id && 
        course.id !== 'undefined' && 
        course.id === courseId && // Ensure the loaded course matches requested courseId
        Number(course.price) > 0 && 
        !clientSecret && 
        !loading) { // Don't create intent while still loading
      handleCreatePaymentIntent();
    }
  }, [course, clientSecret, courseId, loading]);

  const handleCreatePaymentIntent = async () => {
    if (!course || isRedirecting) return;
    
    // Validate course data
    if (!course.id || course.id === 'undefined') {
      console.error('Invalid course ID:', course);
      setErrors({ payment: 'Invalid course information. Please refresh and try again.' });
      return;
    }
    
    try {
      console.log('Creating payment intent for course:', {
        courseId: course.id,
        courseIdType: typeof course.id,
        courseTitle: course.title,
        coursePrice: course.price,
        fullCourse: course
      });
      
      // Ensure we have a valid course ID
      const validCourseId = course.id || courseId;
      if (!validCourseId || validCourseId === 'undefined' || validCourseId === '[id]') {
        throw new Error(`Invalid course ID: ${validCourseId}`);
      }
      
      // TODO: Temporarily disable order creation until API issue is resolved
      // First create the order with pending status
      // const orderData = await createOrder({
      //   courseId: validCourseId,
      //   amount: course.price * 100, // Convert to cents
      //   currency: 'usd',
      //   items: [{
      //     courseId: validCourseId,
      //     courseName: course.title || 'Course',
      //     price: course.price * 100,
      //     quantity: 1
      //   }]
      // });

      // if (!orderData || !orderData.data) {
      //   throw new Error('Failed to create order');
      // }

      // setCurrentOrderId(orderData.data.id);
      
      const response = await api.post('/stripe/create-course-payment-intent', {
        courseId: validCourseId
        // TODO: Add orderId when order creation is working
        // orderId: orderData.data.id // Pass order ID to link with payment intent
      });

      console.log('Payment intent response:', response);

      if (response.success && response.data) {
        const data = response.data.body || response.data;
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('No client secret received:', data);
          setErrors({ payment: 'Failed to initialize payment. Please try again.' });
        }
      } else {
        console.error('Payment intent creation failed:', response.error);
        setErrors({ payment: response.error || 'Failed to initialize payment.' });
      }
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      setErrors({ payment: 'Failed to initialize payment. Please try again.' });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading course: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Additional safety check - ensure course is properly loaded with valid data
  if (!course || 
      !course.id || 
      course.id === 'undefined' ||
      course.id !== courseId ||
      course.price === undefined || 
      course.price === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (course.enrolled) {
    router.push(`/courses/${courseId}`);
    return null;
  }

  const totalVideos = course.chapters?.reduce((acc: number, chapter: any) => acc + (chapter.videos?.length || 0), 0) || 0;
  const coursePrice = Number(course.price) || 0;
  const originalPrice = coursePrice * 1.5;
  const discount = originalPrice - coursePrice;
  const discountPercentage = originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const handlePaymentSuccess = async () => {
    if (!course) return;
    
    // Payment succeeded - redirect back to course page (original flow)
    console.log('Payment successful! Redirecting to course...');
    
    // TODO: When order tracking is working, redirect to track/${currentOrderId}
    // For now, redirect back to course with refresh parameter
    startNavigation();
    router.push(`/courses/${courseId}?refresh=${Date.now()}`);
  };

  const handlePaymentError = (error: string) => {
    setErrors({ payment: error });
  };

  const handleFreeEnrollment = async () => {
    if (!course) return;
    
    // Validate course data
    if (!course.id || course.id === 'undefined') {
      console.error('Invalid course ID:', course);
      setErrors({ payment: 'Invalid course information. Please refresh and try again.' });
      return;
    }
    
    setProcessingPayment(true);
    try {
      // Ensure we have a valid course ID
      const validCourseId = course.id || courseId;
      if (!validCourseId || validCourseId === 'undefined' || validCourseId === '[id]') {
        throw new Error(`Invalid course ID: ${validCourseId}`);
      }
      
      // TODO: Temporarily disable order creation until API issue is resolved
      // Create order for free course
      // const orderData = await createOrder({
      //   courseId: validCourseId,
      //   amount: 0, // Free course
      //   currency: 'usd',
      //   items: [{
      //     courseId: validCourseId,
      //     courseName: course.title || 'Course',
      //     price: 0,
      //     quantity: 1
      //   }]
      // });

      // if (!orderData || !orderData.data) {
      //   throw new Error('Failed to create order');
      // }

      // For free courses, directly enroll the user
      const response = await api.post('/enroll', {
        courseId: validCourseId
        // TODO: Add orderId when order creation is working
        // orderId: orderData.data.id 
      });
      
      if (response.success) {
        startNavigation();
        router.push(`/courses/${courseId}?refresh=${Date.now()}`);
      } else {
        console.error('Free enrollment failed:', response.error);
        setErrors({ payment: response.error || 'Enrollment failed. Please try again.' });
      }
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
              {coursePrice === 0 ? (
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
                      amount={coursePrice * 100} // Convert to cents
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
                        <span className="text-blue-600">${coursePrice.toFixed(2)}</span>
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