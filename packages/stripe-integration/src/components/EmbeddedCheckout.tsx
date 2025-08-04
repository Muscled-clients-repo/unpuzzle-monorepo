import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout as StripeEmbeddedCheckout
} from '@stripe/react-stripe-js';

interface EmbeddedCheckoutProps {
  publishableKey: string;
  clientSecret: string;
  onComplete?: () => void;
}

export const EmbeddedCheckout: React.FC<EmbeddedCheckoutProps> = ({
  publishableKey,
  clientSecret
}) => {
  const stripePromise = loadStripe(publishableKey);

  return (
    <div className="stripe-embedded-checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <StripeEmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};