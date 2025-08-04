"use client";

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import type { StripePaymentElementOptions } from '@stripe/stripe-js';

export interface StripeCheckoutFormProps {
  onSuccess: () => void | Promise<void>;
  onError: (error: string) => void;
  amount?: number;
  title?: string;
  description?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  paymentElementOptions?: StripePaymentElementOptions;
  customSubmitButton?: (props: {
    isLoading: boolean;
    isDisabled: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

/**
 * Reusable Stripe Checkout Form component
 */
export const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ 
  onSuccess, 
  onError,
  amount,
  title,
  description,
  submitButtonText = 'Complete Purchase',
  submitButtonClassName = 'w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  paymentElementOptions = { layout: 'tabs' as const },
  customSubmitButton
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        const errorMessage = error.message || 'Payment failed';
        setMessage(errorMessage);
        onError(errorMessage);
      } else {
        await onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !stripe || !elements;

  return (
    <div className="stripe-checkout-form">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Optional Header */}
        {(title || description || amount !== undefined) && (
          <div className="checkout-header">
            {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
            {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
            {amount !== undefined && (
              <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
            )}
          </div>
        )}

        {/* Payment Element */}
        <div className="payment-element-container">
          <PaymentElement 
            id="payment-element" 
            options={paymentElementOptions}
          />
        </div>

        {/* Error Message */}
        {message && (
          <div className="error-message bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        {customSubmitButton ? (
          customSubmitButton({ isLoading, isDisabled, handleSubmit })
        ) : (
          <button
            type="submit"
            disabled={isDisabled}
            className={submitButtonClassName}
          >
            {isLoading ? 'Processing...' : submitButtonText}
            {amount !== undefined && ` - $${amount.toFixed(2)}`}
          </button>
        )}
      </form>
    </div>
  );
};

export default StripeCheckoutForm;