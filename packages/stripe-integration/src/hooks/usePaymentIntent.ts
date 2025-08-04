import { useState, useCallback } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';

export interface UsePaymentIntentOptions {
  onSuccess?: (paymentIntent: PaymentIntent) => void | Promise<void>;
  onError?: (error: string) => void;
}

/**
 * Hook for handling payment intents with Stripe
 */
export const usePaymentIntent = (options: UsePaymentIntentOptions = {}) => {
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  /**
   * Confirm a payment intent
   */
  const confirmPayment = useCallback(async (clientSecret: string) => {
    if (!stripe) {
      const errorMsg = 'Stripe not initialized';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return false;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        const errorMsg = result.error.message || 'Payment confirmation failed';
        setError(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }

      if (result.paymentIntent) {
        setPaymentIntent(result.paymentIntent);
        await options.onSuccess?.(result.paymentIntent);
        return true;
      }

      return false;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [stripe, options]);

  /**
   * Retrieve a payment intent
   */
  const retrievePaymentIntent = useCallback(async (clientSecret: string) => {
    if (!stripe) {
      setError('Stripe not initialized');
      return null;
    }

    try {
      const result = await stripe.retrievePaymentIntent(clientSecret);
      if (result.paymentIntent) {
        setPaymentIntent(result.paymentIntent);
        return result.paymentIntent;
      }
      return null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve payment intent';
      setError(errorMsg);
      return null;
    }
  }, [stripe]);

  return {
    confirmPayment,
    retrievePaymentIntent,
    isProcessing,
    error,
    paymentIntent,
    stripe,
  };
};

export default usePaymentIntent;