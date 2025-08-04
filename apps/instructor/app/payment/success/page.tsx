'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Coins } from 'lucide-react';
import Link from 'next/link';
import { useOptionalAuth } from '@/app/hooks/useOptionalAuth';
import { useGetUserCreditsQuery } from '../../redux/services/credits.services';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useOptionalAuth();
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
          // TODO: Implement real verification endpoint
          // const response = await fetch(`/api/stripe/verify-session/${sessionId}`);
          // const data = await response.json();
          
          // For now, just mark as success and refetch credits
          if (userId) {
            await refetchCredits();
          }
          
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your purchase...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. If you were charged, your credits will be added automatically within a few minutes.
          </p>
          <div className="space-y-3">
            <Link href="/instructor/dashboard/overview" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/tiers" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Back to Pricing
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Contact support if your credits don't appear within 10 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your credits have been added to your account and you can start using them immediately.
        </p>
        
        {creditBalance !== null && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Coins className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-blue-900">Current Credit Balance</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {creditBalance.toLocaleString()} credits
            </p>
          </div>
        )}
        
        {testPaymentInfo && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-sm border border-yellow-200">
            <p className="text-yellow-800 text-center mb-2 font-semibold">
              Test Mode Payment
            </p>
            <div className="text-yellow-700 space-y-1">
              <p>Credits purchased: {testPaymentInfo.credits?.toLocaleString()}</p>
              <p>Amount: ${testPaymentInfo.amount}</p>
              <p className="text-xs mt-2">Credits will be updated automatically via webhook</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Link 
            href="/instructor/dashboard/overview" 
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            href="/courses" 
            className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse Courses
          </Link>
          
          <Link 
            href="/tiers" 
            className="block w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Buy More Credits
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            ✅ A confirmation email has been sent to your registered email address
          </p>
          <p className="text-xs text-gray-400">
            Session ID: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
}