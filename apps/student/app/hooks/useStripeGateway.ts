import { useCallback, useEffect, useState } from 'react';
import { useStripePayment } from './useStripePayment';
import { useStripeElements } from './useStripeElements';

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

interface UseStripeGatewayReturn {
  // State
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
  elementsLoading: boolean;
  elementsError: string | null;
  paymentMessage: string;
  
  // Elements
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  postalCode: any;
  
  // Actions
  processPayment: (items: PaymentItem[], billingDetails: BillingDetails) => Promise<any>;
  resetPayment: () => void;
  setPaymentMessage: (message: string) => void;
}

export function useStripeGateway(): UseStripeGatewayReturn {
  const {
    loading,
    error,
    paymentSuccess,
    createPaymentIntent,
    confirmPayment,
    resetPayment: resetContextPayment
  } = useStripePayment();

  const {
    cardNumber,
    cardExpiry,
    cardCvc,
    postalCode,
    loading: elementsLoading,
    error: elementsError
  } = useStripeElements();

  const [paymentMessage, setPaymentMessage] = useState<string>('');

  const processPayment = useCallback(async (
    items: PaymentItem[], 
    billingDetails: BillingDetails
  ): Promise<any> => {
    if (!cardNumber) {
      throw new Error('Card number element not ready');
    }

    try {
      setPaymentMessage('');
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(items);

      // Confirm the payment with the client secret
      const result = await confirmPayment(
        paymentIntent.client_secret,
        cardNumber,
        billingDetails
      );

      if (result.status === 'succeeded') {
        setPaymentMessage(`Payment successful and payment id is: ${result.id}`);
        return result;
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentMessage(error.message || 'Payment failed');
      throw error;
    }
  }, [cardNumber, createPaymentIntent, confirmPayment]);

  const resetPayment = useCallback(() => {
    resetContextPayment();
    setPaymentMessage('');
  }, [resetContextPayment]);

  // Auto-clear payment message after success
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        setPaymentMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  // Auto-clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setPaymentMessage('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // State
    loading,
    error,
    paymentSuccess,
    elementsLoading,
    elementsError,
    paymentMessage,
    
    // Elements
    cardNumber,
    cardExpiry,
    cardCvc,
    postalCode,
    
    // Actions
    processPayment,
    resetPayment,
    setPaymentMessage,
  };
} 