'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';

export default function TestCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [name, setName] = useState('Test User');

  // Get session details from URL params
  const sessionId = searchParams.get('session_id');
  const amount = searchParams.get('amount') || '30';
  const credits = searchParams.get('credits') || '1000';

  const handlePayment = async () => {
    if (!userId) {
      toast.error('Please sign in to complete the purchase');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, the Stripe webhook will handle credit updates
      // For test mode, we just simulate a successful payment
      toast.success('Test payment successful! Redirecting...');
      
      // Store test payment info in sessionStorage for the success page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('testPayment', JSON.stringify({
          sessionId: sessionId || 'test_session',
          credits: parseInt(credits),
          amount: parseInt(amount),
          timestamp: new Date().toISOString()
        }));
      }
      
      // Redirect to success page
      setTimeout(() => {
        router.push(`/success?session_id=${sessionId}`);
      }, 500);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tiers" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to pricing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Test Checkout</h1>
          <p className="text-gray-600 mt-2">This is a test checkout page for local development</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </h2>

            <div className="space-y-4">
              {/* Test Mode Banner */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Test Mode:</strong> Use any test card number. Default: 4242 4242 4242 4242
                </p>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${amount}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <Lock className="w-3 h-3 inline mr-1" />
                This is a test checkout. No real payment will be processed.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">Unpuzzle AI Credits</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-medium">{credits} credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">Early Adopter</span>
                </div>
              </div>

              <div className="pb-4 border-b">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${amount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${amount}.00</span>
              </div>

              {/* Test Mode Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Test Mode Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Session ID: {sessionId || 'N/A'}</li>
                  <li>• This is a simulated checkout for testing</li>
                  <li>• Click "Pay" to simulate a successful payment</li>
                  <li>• You'll be redirected to the success page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}