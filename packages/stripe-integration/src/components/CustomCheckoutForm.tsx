import React, { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement
} from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';

interface CustomCheckoutFormProps {
  amount: number;
  courseTitle: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
}

export const CustomCheckoutForm: React.FC<CustomCheckoutFormProps> = ({
  amount,
  courseTitle,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Course Info */}
      <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-xl p-5 border-2 border-transparent bg-clip-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-blue-200/30 to-purple-200/30 rounded-xl"></div>
        <div className="relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">You're purchasing</p>
              </div>
              <p className="font-bold text-gray-900 text-lg leading-tight">{courseTitle}</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold">${(amount / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <label className="block text-sm font-semibold text-gray-800">
            Email Address
          </label>
        </div>
        <div className="bg-gradient-to-r from-slate-50 to-blue-100 rounded-xl p-3 border-2 border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <LinkAuthenticationElement 
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <label className="block text-sm font-semibold text-gray-800">
            Payment Method
          </label>
        </div>
        <div className="bg-gradient-to-r from-slate-50 to-purple-100 rounded-xl p-3 border-2 border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <PaymentElement 
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  email: email
                }
              }
            }}
          />
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <label className="block text-sm font-semibold text-gray-800">
            Billing Address
          </label>
        </div>
        <div className="bg-gradient-to-r from-slate-50 to-orange-100 rounded-xl p-3 border-2 border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <AddressElement 
            options={{
              mode: 'billing',
              allowedCountries: ['US', 'CA', 'GB', 'AU', 'IN', 'BD'],
              autocomplete: {
                mode: 'automatic'
              }
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Badges */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-2">
            <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-700">Secure Payment</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-2">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-700">SSL Encrypted</span>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-600 mr-2">Powered by</span>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
            STRIPE
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white text-lg
          transition-all duration-300 transform shadow-lg
          ${isProcessing 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed scale-95' 
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 hover:shadow-2xl hover:scale-105 active:scale-95'
          }
          relative overflow-hidden
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Complete Purchase • ${(amount / 100).toFixed(2)}
          </span>
        )}
      </button>

      {/* Trust Badges */}
      <div className="text-center text-xs text-gray-500 space-y-2">
        <p>🔒 Your payment information is encrypted and secure</p>
        <p>✓ 30-day money-back guarantee • ✓ Instant access after payment</p>
      </div>
    </form>
  );
};