import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

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

interface PaymentIntentResponse {
  success: boolean;
  data: PaymentIntent;
  message?: string;
}

interface CheckoutSessionRequest {
  userId: string;
  creditAmount: number;
  priceInCents: number;
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    checkoutUrl: string | null;
    sessionUrl: string | null;
  };
  message?: string;
}

export const stripeApi = createApi({
  reducerPath: 'stripeApi',
  baseQuery: baseQuery,
  tagTypes: ['PaymentIntent'],
  endpoints: (build) => ({
    createPaymentIntent: build.mutation<PaymentIntentResponse, PaymentItem[]>({
      query: (items) => ({
        url: '/api/orders',
        method: 'POST',
        body: {
          payment_method: "credit_card",
          payment_currency: "USD",
          items: items
        } as PaymentRequest,
      }),
      transformResponse: (response: any) => {
        if (!response.success && response.message) {
          throw new Error(response.message);
        }
        return response;
      },
    }),
    createCheckoutSession: build.mutation<CheckoutSessionResponse, CheckoutSessionRequest>({
      query: (data) => ({
        url: '/api/stripe/create-checkout-session',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (!response.success && response.message) {
          throw new Error(response.message);
        }
        return response;
      },
    }),
  }),
});

export const { useCreatePaymentIntentMutation, useCreateCheckoutSessionMutation } = stripeApi;