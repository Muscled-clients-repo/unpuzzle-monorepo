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
import { 
  CheckCircleIcon, 
  ClockIcon, 
  VideoCameraIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface CheckoutClientProps {
  courseId: string;
}

export default function CheckoutClient({ courseId }: CheckoutClientProps) {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();
  const { course, loading, error } = useCourseDetails(courseId);
  const [createEnroll, { isLoading: isEnrolling }] = useCreateEnrollMutation();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [billingDetails, setBillingDetails] = useState({
    email: '',
    country: 'US',
    zip: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!courseId || typeof courseId !== 'string') {
      notFound();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!billingDetails.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardDetails.number.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!cardDetails.name) {
        newErrors.cardName = 'Cardholder name is required';
      }

      if (!cardDetails.expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = 'Invalid expiry format (MM/YY)';
      }

      if (!cardDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }

    if (!billingDetails.zip) {
      newErrors.zip = 'ZIP code is required';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For free courses, directly enroll
      if (course.price === 0) {
        const result = await createEnroll({ 
          userId: 'current-user-id', // This should come from auth context
          courseId: course.id 
        }).unwrap();
        
        startNavigation();
        router.push(`/courses/${courseId}/learn`);
      } else {
        // For paid courses, process payment first
        // This is where you'd integrate with Stripe or other payment provider
        
        // After successful payment, enroll the user
        const result = await createEnroll({ 
          userId: 'current-user-id', // This should come from auth context
          courseId: course.id 
        }).unwrap();
        
        startNavigation();
        router.push(`/courses/${courseId}/learn`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
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
              {/* Payment Method Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCardIcon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    <p className="font-medium">Credit/Debit Card</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-2">
                      <span className="text-2xl font-bold text-blue-800">P</span>
                    </div>
                    <p className="font-medium">PayPal</p>
                  </button>
                </div>
              </div>

              {/* Payment Details Form */}
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Billing Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={billingDetails.email}
                        onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          value={billingDetails.country}
                          onChange={(e) => setBillingDetails({ ...billingDetails, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={billingDetails.zip}
                          onChange={(e) => setBillingDetails({ ...billingDetails, zip: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.zip ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="12345"
                        />
                        {errors.zip && (
                          <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details (shown only if card payment is selected) */}
                {paymentMethod === 'card' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Card Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cardName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.expiry ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiry && (
                            <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Option */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-blue-800">P</span>
                      </div>
                      <p className="text-gray-600">You will be redirected to PayPal to complete your purchase</p>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
                      I understand that this purchase is non-refundable after 30 days.
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-2">{errors.terms}</p>
                  )}
                </div>

                {/* Error Message */}
                {errors.payment && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{errors.payment}</p>
                  </div>
                )}

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  disabled={processingPayment || isEnrolling}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  loadingText="Processing payment..."
                  showSpinner={true}
                >
                  <LockClosedIcon className="w-5 h-5" />
                  Complete Purchase - ${course.price}
                </LoadingButton>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5 text-green-600" />
                    <span>256-bit Encryption</span>
                  </div>
                </div>
              </form>
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