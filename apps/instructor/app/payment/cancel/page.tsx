'use client';

import React from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/tiers');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account. 
          You can try again whenever you're ready.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link 
            href="/instructor/dashboard/overview" 
            className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            href="/courses" 
            className="block w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Need help?</h3>
          <p className="text-xs text-gray-500 mb-3">
            If you're experiencing issues with the payment process, here are some options:
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>• Check if your payment method is valid</p>
            <p>• Try a different payment method</p>
            <p>• Contact support if issues persist</p>
          </div>
        </div>
      </div>
    </div>
  );
}