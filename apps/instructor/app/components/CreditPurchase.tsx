'use client';

import React, { useState } from 'react';
import { useOptionalAuth } from '../hooks/useOptionalAuth';
import { toast } from 'react-toastify';
import { Coins, Check } from 'lucide-react';

interface CreditPackage {
  credits: number;
  priceInCents: number;
  displayPrice: string;
  popular?: boolean;
  discount?: string;
}

interface CreditPurchaseProps {
  userId?: string;
  className?: string;
}

const CreditPurchase: React.FC<CreditPurchaseProps> = ({ userId: propUserId, className = '' }) => {
  const { userId: authUserId } = useOptionalAuth();
  const userId = propUserId || authUserId;
  const [loading, setLoading] = useState(false);
  
  // Get server URL from environment variable
  const serverUrl = process.env.NEXT_PUBLIC_APP_SERVER_URL || 'http://localhost:3001';

  const creditPackages: CreditPackage[] = [
    { 
      credits: 1000, 
      priceInCents: 999, 
      displayPrice: '$9.99',
      discount: 'Starter Pack'
    },
    { 
      credits: 5000, 
      priceInCents: 4999, 
      displayPrice: '$49.99',
      popular: true,
      discount: 'Best Value - Save 17%'
    },
    { 
      credits: 10000, 
      priceInCents: 8999, 
      displayPrice: '$89.99',
      discount: 'Pro Pack - Save 25%'
    },
    { 
      credits: 25000, 
      priceInCents: 19999, 
      displayPrice: '$199.99',
      discount: 'Enterprise - Save 33%'
    }
  ];

  const handlePurchase = async (creditPackage: CreditPackage) => {
    if (!userId) {
      toast.error('Please sign in to purchase credits');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${serverUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          creditAmount: creditPackage.credits,
          priceInCents: creditPackage.priceInCents,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.message);
      }

    } catch (error: any) {
      console.error('Payment creation failed:', error);
      
      if (error.message?.includes('Missing required fields')) {
        toast.error('Please check your information and try again.');
      } else if (error.message?.includes('positive numbers')) {
        toast.error('Invalid credit amount or price.');
      } else {
        toast.error('Failed to create payment session. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Purchase Credits</h2>
        <p className="text-lg text-gray-600">
          Choose a credit package that fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creditPackages.map((pkg, index) => (
          <div 
            key={index} 
            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              pkg.popular 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.credits.toLocaleString()} Credits
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {pkg.displayPrice}
                </div>
                {pkg.discount && (
                  <p className="text-sm text-green-600 font-medium">
                    {pkg.discount}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Valid for all puzzle types</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>No expiration date</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Instant activation</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  pkg.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Secure payment processed by Stripe • Instant credit delivery • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default CreditPurchase;