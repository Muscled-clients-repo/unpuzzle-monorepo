import React, { createContext, useState, useCallback, ReactNode } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

interface PaymentItem {
  product_id: string;
  quantity: number;
}

interface PaymentRequest {
  payment_method: "credit_card";
  payment_currency: "USD";
  items: PaymentItem[];
}

interface PaymentIntent {
  client_secret: string;
  id: string;
  status: string;
}

interface StripePaymentContextType {
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
  paymentIntent: PaymentIntent | null;
  createPaymentIntent: (items: PaymentItem[]) => Promise<PaymentIntent>;
  confirmPayment: (clientSecret: string, cardElement: any, billingDetails: any) => Promise<any>;
  resetPayment: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const StripePaymentContext = createContext<StripePaymentContextType | undefined>(undefined);

const StripePaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  const createPaymentIntent = useCallback(async (items: PaymentItem[]): Promise<PaymentIntent> => {
    setLoading(true);
    setError(null);
    
    try {
      const paymentRequest: PaymentRequest = {
        payment_method: "credit_card",
        payment_currency: "USD",
        items: items
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create payment intent');
      }

      setPaymentIntent(result.data);
      return result.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create payment intent';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (clientSecret: string, cardElement: any, billingDetails: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const stripe = await loadStripe('pk_test_51RebMZ2fB4WJ1ELeiZQXVTkzG3TZFKJpzmvD2QHc5rAwM16TSUcBMe1NDoENz1d1aeKmthsIWfGOKLUsAd8wvW4R00JRu8RYP4');
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        throw error;
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        return paymentIntent;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Payment confirmation failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPayment = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentSuccess(false);
    setPaymentIntent(null);
  }, []);

  return (
    <StripePaymentContext.Provider
      value={{
        loading,
        error,
        paymentSuccess,
        paymentIntent,
        createPaymentIntent,
        confirmPayment,
        resetPayment,
        setLoading,
        setError,
      }}
    >
      {children}
    </StripePaymentContext.Provider>
  );
};

// Custom hook
export const useStripePayment = () => {
  const context = React.useContext(StripePaymentContext);
  if (!context) {
    throw new Error("useStripePayment must be used within StripePaymentProvider");
  }
  return context;
};

export { StripePaymentContext, StripePaymentProvider }; 