import { useEffect, useRef, useState } from "react";
import { loadStripe, Stripe, StripeElements, StripeElement } from "@stripe/stripe-js";

interface StripeElementsConfig {
  cardNumber?: boolean;
  cardExpiry?: boolean;
  cardCvc?: boolean;
  postalCode?: boolean;
}

interface StripeElementsReturn {
  stripe: Stripe | null;
  elements: StripeElements | null;
  cardNumber: StripeElement | null;
  cardExpiry: StripeElement | null;
  cardCvc: StripeElement | null;
  postalCode: StripeElement | null;
  loading: boolean;
  error: string | null;
}

export function useStripeElements(config: StripeElementsConfig = {}): StripeElementsReturn {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cardNumberRef = useRef<StripeElement | null>(null);
  const cardExpiryRef = useRef<StripeElement | null>(null);
  const cardCvcRef = useRef<StripeElement | null>(null);
  const postalCodeRef = useRef<StripeElement | null>(null);

  // Define custom styling for each field
  const style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4"
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Stripe
        const stripeInstance = await loadStripe('pk_test_51RebMZ2fB4WJ1ELeiZQXVTkzG3TZFKJpzmvD2QHc5rAwM16TSUcBMe1NDoENz1d1aeKmthsIWfGOKLUsAd8wvW4R00JRu8RYP4');
        
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe');
        }

        setStripe(stripeInstance);

        // Create elements
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);

        // Create individual elements based on config
        if (config.cardNumber !== false) {
          cardNumberRef.current = elementsInstance.create('cardNumber', { style });
        }
        
        if (config.cardExpiry !== false) {
          cardExpiryRef.current = elementsInstance.create('cardExpiry', { style });
        }
        
        if (config.cardCvc !== false) {
          cardCvcRef.current = elementsInstance.create('cardCvc', { style });
        }
        
        // Note: postalCode element might not be available in all Stripe versions
        // You may need to use a regular input field for postal code
        if (config.postalCode !== false) {
          try {
            postalCodeRef.current = elementsInstance.create('postalCode' as any, { style });
          } catch (err) {
            console.warn('Postal code element not available, using regular input instead');
          }
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize Stripe');
        setLoading(false);
      }
    };

    initializeStripe();
  }, [config]);

  // Mount elements to DOM when they're ready
  useEffect(() => {
    if (!elements || loading) return;

    const mountElements = () => {
      try {
        // Mount card number
        if (cardNumberRef.current && document.getElementById('card-element')) {
          cardNumberRef.current.mount('#card-element');
        }

        // Mount expiry
        if (cardExpiryRef.current && document.getElementById('expiry-element')) {
          cardExpiryRef.current.mount('#expiry-element');
        }

        // Mount CVC
        if (cardCvcRef.current && document.getElementById('cvc-element')) {
          cardCvcRef.current.mount('#cvc-element');
        }

        // Mount postal code (if available)
        if (postalCodeRef.current && document.getElementById('postal-code-element')) {
          postalCodeRef.current.mount('#postal-code-element');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to mount Stripe elements');
      }
    };

    // Small delay to ensure DOM elements are ready
    const timer = setTimeout(mountElements, 100);
    return () => clearTimeout(timer);
  }, [elements, loading]);

  return {
    stripe,
    elements,
    cardNumber: cardNumberRef.current,
    cardExpiry: cardExpiryRef.current,
    cardCvc: cardCvcRef.current,
    postalCode: postalCodeRef.current,
    loading,
    error,
  };
} 