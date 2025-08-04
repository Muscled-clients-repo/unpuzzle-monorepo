"use client";

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or create the Stripe instance
 * @param publishableKey - Stripe publishable key
 */
export const getStripe = (publishableKey: string): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface StripeProviderProps {
  children: React.ReactNode;
  publishableKey: string;
  clientSecret?: string;
  options?: StripeElementsOptions;
}

/**
 * Global Stripe Provider component that can be used across all apps
 */
export const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  publishableKey,
  clientSecret,
  options: customOptions 
}) => {
  const stripe = getStripe(publishableKey);
  
  const defaultOptions: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  } : customOptions;

  return (
    <Elements stripe={stripe} options={defaultOptions}>
      {children}
    </Elements>
  );
};

export default StripeProvider;