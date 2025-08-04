export interface StripeConfig {
  publishableKey: string;
  apiBaseUrl: string;
}

export interface PaymentMetadata {
  userId: string;
  courseId?: string;
  creditAmount?: number;
  subscriptionPlanId?: string;
  [key: string]: any;
}

export interface CheckoutSession {
  id: string;
  url: string;
  clientSecret?: string;
  status: 'open' | 'complete' | 'expired';
  metadata: PaymentMetadata;
}

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  enrollmentId?: string;
  transactionId?: string;
}

export interface CourseCheckoutProps {
  courseId: string;
  courseTitle: string;
  price: number;
  userId: string;
  userEmail?: string;
}

export interface CreditCheckoutProps {
  creditAmount: number;
  price: number;
  userId: string;
  userEmail?: string;
}

export interface SubscriptionCheckoutProps {
  planId: string;
  planName: string;
  price: number;
  interval: 'month' | 'year';
  userId: string;
  userEmail?: string;
  trialDays?: number;
}

export type CheckoutType = 'course' | 'credit' | 'subscription';

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export interface WebhookHandlers {
  'checkout.session.completed'?: (session: any) => Promise<void>;
  'payment_intent.succeeded'?: (paymentIntent: any) => Promise<void>;
  'payment_intent.payment_failed'?: (paymentIntent: any) => Promise<void>;
  'customer.subscription.created'?: (subscription: any) => Promise<void>;
  'customer.subscription.updated'?: (subscription: any) => Promise<void>;
  'customer.subscription.deleted'?: (subscription: any) => Promise<void>;
  [key: string]: ((data: any) => Promise<void>) | undefined;
}