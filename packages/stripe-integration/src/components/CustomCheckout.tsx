import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CustomCheckoutForm } from './CustomCheckoutForm';
import { PaymentIntent } from '@stripe/stripe-js';

interface CustomCheckoutProps {
  publishableKey: string;
  clientSecret: string;
  amount: number;
  courseTitle: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
}

export const CustomCheckout: React.FC<CustomCheckoutProps> = ({
  publishableKey,
  clientSecret,
  amount,
  courseTitle,
  onSuccess,
  onError
}) => {
  const stripePromise = loadStripe(publishableKey);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        fontSizeBase: '16px',
      },
      rules: {
        '.Label': {
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
        '.Input': {
          padding: '12px',
          fontSize: '16px',
          boxShadow: 'none',
          border: '1px solid #e5e7eb',
        },
        '.Input:focus': {
          borderColor: '#2563eb',
          boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
        },
        '.Tab': {
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        },
        '.Tab--selected': {
          backgroundColor: '#eff6ff',
          borderColor: '#2563eb',
        },
      }
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-500/30 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
        </div>
        <p className="text-center text-blue-100 mt-2">Complete your purchase with confidence</p>
      </div>
      
      {/* Form content */}
      <div className="p-6">
        <Elements stripe={stripePromise} options={options}>
          <CustomCheckoutForm
            amount={amount}
            courseTitle={courseTitle}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </div>
    </div>
  );
};