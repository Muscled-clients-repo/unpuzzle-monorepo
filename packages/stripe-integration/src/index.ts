// Components
export { StripeProvider, getStripe } from './components/StripeProvider';
export type { StripeProviderProps } from './components/StripeProvider';

export { StripeCheckoutForm } from './components/StripeCheckoutForm';
export type { StripeCheckoutFormProps } from './components/StripeCheckoutForm';

export { EmbeddedCheckout } from './components/EmbeddedCheckout';
export { CustomCheckout } from './components/CustomCheckout';
export { CustomCheckoutForm } from './components/CustomCheckoutForm';

// Hooks
export { useStripeCheckout } from './hooks/useStripeCheckout';
export type { 
  CheckoutSessionParams,
  CourseCheckoutParams,
  CreditCheckoutParams,
  CheckoutSessionResponse 
} from './hooks/useStripeCheckout';

export { usePaymentIntent } from './hooks/usePaymentIntent';
export type { UsePaymentIntentOptions } from './hooks/usePaymentIntent';

// Services
export { StripeService, createStripeService } from './services/stripeService';
export type { 
  StripeServiceConfig,
  CheckoutSessionData 
} from './services/stripeService';

// Types
export type {
  StripeConfig,
  PaymentMetadata,
  CheckoutSession,
  PaymentResult,
  CourseCheckoutProps,
  CreditCheckoutProps,
  SubscriptionCheckoutProps,
  CheckoutType,
  StripeWebhookEvent,
  WebhookHandlers
} from './types';

// Re-export commonly used Stripe types
export type {
  Stripe,
  StripeElements,
  StripeError,
  PaymentIntent,
  PaymentMethod,
  StripeElementsOptions,
} from '@stripe/stripe-js';

export {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js';