import { useState, useCallback } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

interface PaymentItem {
  product_id: string;
  quantity: number;
}

interface BillingDetails {
  name: string;
  email?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

interface UseStripePaymentReturn {
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
  createPaymentIntent: (items: PaymentItem[]) => Promise<any>;
  confirmPayment: (clientSecret: string, cardElement: any, billingDetails: BillingDetails) => Promise<any>;
  resetPayment: () => void;
}

export function useStripePayment(): UseStripePaymentReturn {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const createPaymentIntent = useCallback(async (items: PaymentItem[]) => {
    if (!stripe) {
      throw new Error('Stripe is not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      // Call your backend API to create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create payment intent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stripe]);

  const confirmPayment = useCallback(async (
    clientSecret: string,
    cardElement: any,
    billingDetails: BillingDetails
  ) => {
    if (!stripe || !cardElement) {
      throw new Error('Stripe or card element not available');
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment confirmation failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentSuccess(true);
        return paymentIntent;
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stripe]);

  const resetPayment = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentSuccess(false);
  }, []);

  return {
    loading,
    error,
    paymentSuccess,
    createPaymentIntent,
    confirmPayment,
    resetPayment,
  };
}