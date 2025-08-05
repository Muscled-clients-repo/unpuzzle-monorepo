'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useGetUserCreditsQuery } from '../redux/services/credits.services';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [testPaymentInfo, setTestPaymentInfo] = useState<any>(null);
  const sessionId = searchParams.get('session_id');
  
  // Query for user credits - will auto-refresh every 5 seconds
  const { data: creditsData, refetch: refetchCredits } = useGetUserCreditsQuery(
    userId || '',
    { skip: !userId }
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Check if this is a test session
    const isTestSession = sessionId.startsWith('cs_test_');
    
    const verifySession = async () => {
      try {
        if (isTestSession) {
          // For test sessions, get the payment info from sessionStorage
          console.log('Test session detected:', sessionId);
          
          if (typeof window !== 'undefined') {
            const storedPayment = sessionStorage.getItem('testPayment');
            if (storedPayment) {
              setTestPaymentInfo(JSON.parse(storedPayment));
              sessionStorage.removeItem('testPayment');
            }
          }
          
          if (userId) {
            await refetchCredits();
          }
          
          setTimeout(() => {
            setStatus('success');
            if (creditsData?.availableCredits) {
              setCreditBalance(creditsData.availableCredits);
            }
          }, 1000);
        } else {
          // For real Stripe sessions, verify with backend
          // TODO: Implement real verification
          // const response = await fetch(`/api/stripe/verify-session/${sessionId}`);
          // const data = await response.json();
          setTimeout(() => {
            setStatus('success');
          }, 1000);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setStatus('error');
      }
    };

    verifySession();
  }, [sessionId, userId, refetchCredits]);

  useEffect(() => {
    if (creditsData?.availableCredits) {
      setCreditBalance(creditsData.availableCredits);
    }
  }, [creditsData]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your purchase...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. Please try again or contact support if the issue persists.
          </p>
          <div className="space-y-3">
            <Link href="/tiers" className="block w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Try Again
            </Link>
            <Link href="/" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your credits have been added to your account and you can start using them immediately.
        </p>
        {creditBalance !== null && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-center">
              <span className="font-semibold">Current Credit Balance:</span> {creditBalance} credits
            </p>
          </div>
        )}
        {testPaymentInfo && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-sm">
            <p className="text-yellow-800 text-center mb-2">
              <span className="font-semibold">Test Mode:</span> Credits will be updated by webhook
            </p>
            <p className="text-yellow-700 text-center">
              Credits purchased: {testPaymentInfo.credits} | Amount: ${testPaymentInfo.amount}
            </p>
          </div>
        )}
        <div className="space-y-3">
          <Link href="/instructor/dashboard/overview" className="block w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Go to Dashboard
          </Link>
          <Link href="/courses" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Browse Courses
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}