import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

export interface CheckoutSessionParams {
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CourseCheckoutParams extends CheckoutSessionParams {
  courseId: string;
}

export interface CreditCheckoutParams extends CheckoutSessionParams {
  creditAmount: number;
  priceInCents: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  clientSecret?: string;
}

/**
 * Hook for creating Stripe checkout sessions
 */
export const useStripeCheckout = (apiBaseUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a checkout session for course purchase
   */
  const createCourseCheckoutSession = useCallback(async (
    params: CourseCheckoutParams
  ): Promise<CheckoutSessionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CheckoutSessionResponse>(
        `${apiBaseUrl}/api/stripe/create-course-checkout-session`,
        params
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message 
        : 'Failed to create checkout session';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  /**
   * Create a checkout session for credit purchase
   */
  const createCreditCheckoutSession = useCallback(async (
    params: CreditCheckoutParams
  ): Promise<CheckoutSessionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CheckoutSessionResponse>(
        `${apiBaseUrl}/api/stripe/create-checkout-session`,
        params
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message 
        : 'Failed to create checkout session';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  /**
   * Redirect to Stripe Checkout
   */
  const redirectToCheckout = useCallback((sessionUrl: string) => {
    window.location.href = sessionUrl;
  }, []);

  return {
    createCourseCheckoutSession,
    createCreditCheckoutSession,
    redirectToCheckout,
    isLoading,
    error,
  };
};

export default useStripeCheckout;