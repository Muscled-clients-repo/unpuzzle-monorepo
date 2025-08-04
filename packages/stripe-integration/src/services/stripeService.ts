import axios, { AxiosInstance } from 'axios';

export interface StripeServiceConfig {
  apiBaseUrl: string;
  headers?: Record<string, string>;
}

export interface CheckoutSessionData {
  sessionId: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  clientSecret?: string;
}

/**
 * Service class for Stripe API interactions
 */
export class StripeService {
  private api: AxiosInstance;

  constructor(config: StripeServiceConfig) {
    this.api = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  /**
   * Create a checkout session for course purchase
   */
  async createCourseCheckoutSession(params: {
    userId: string;
    courseId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSessionData> {
    const response = await this.api.post<CheckoutSessionData>(
      '/api/stripe/create-course-checkout-session',
      params
    );
    return response.data;
  }

  /**
   * Create a checkout session for credit purchase
   */
  async createCreditCheckoutSession(params: {
    userId: string;
    creditAmount: number;
    priceInCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSessionData> {
    const response = await this.api.post<CheckoutSessionData>(
      '/api/stripe/create-checkout-session',
      params
    );
    return response.data;
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckoutSession(params: {
    userId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    trialPeriodDays?: number;
  }): Promise<CheckoutSessionData> {
    const response = await this.api.post<CheckoutSessionData>(
      '/api/stripe/create-subscription-checkout',
      params
    );
    return response.data;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.api.post<{ success: boolean; message: string }>(
      `/api/stripe/cancel-subscription/${subscriptionId}`
    );
    return response.data;
  }

  /**
   * Get customer portal URL
   */
  async getCustomerPortalUrl(customerId: string, returnUrl: string): Promise<{ url: string }> {
    const response = await this.api.post<{ url: string }>(
      '/api/stripe/customer-portal',
      { customerId, returnUrl }
    );
    return response.data;
  }

  /**
   * Verify webhook signature (for server-side use)
   */
  async verifyWebhookSignature(params: {
    payload: string;
    signature: string;
  }): Promise<{ valid: boolean }> {
    const response = await this.api.post<{ valid: boolean }>(
      '/api/stripe/verify-webhook',
      params
    );
    return response.data;
  }
}

/**
 * Factory function to create a Stripe service instance
 */
export const createStripeService = (config: StripeServiceConfig): StripeService => {
  return new StripeService(config);
};

export default StripeService;