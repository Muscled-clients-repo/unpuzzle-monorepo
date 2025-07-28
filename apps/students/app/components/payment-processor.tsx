import React, { useEffect, useRef, useState } from 'react';
import { useStripePayment } from '../context/StripePaymentContext';
import { useStripeElements } from '../hooks/useStripeElements';

interface StripeGatewayProps {
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: string) => void;
  redirectUrl?: string;
  redirectDelay?: number;
  billingDetails?: {
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
  };
  items?: Array<{
    product_id: string;
    quantity: number;
  }>;
}

const StripeGateway: React.FC<StripeGatewayProps> = ({
  onPaymentSuccess,
  onPaymentError,
  redirectUrl = "/",
  redirectDelay = 2000,
  billingDetails = { name: 'Test User' },
  items = [
    {
      product_id: "f218539e-cddb-4cda-9062-0e420d2cf3b0",
      quantity: 1
    }
  ]
}) => {
  const {
    loading,
    error,
    paymentSuccess,
    createPaymentIntent,
    confirmPayment,
    resetPayment
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
  const formRef = useRef<HTMLFormElement>(null);

  // Handle payment success redirect
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, redirectDelay);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, redirectUrl, redirectDelay]);

  // Handle payment success callback
  useEffect(() => {
    if (paymentSuccess && onPaymentSuccess) {
      // You can pass the payment intent data here if needed
      onPaymentSuccess({ success: true });
    }
  }, [paymentSuccess, onPaymentSuccess]);

  // Handle payment error callback
  useEffect(() => {
    if (error && onPaymentError) {
      onPaymentError(error);
    }
  }, [error, onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!cardNumber) {
      setPaymentMessage('Card number element not ready');
      return;
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
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentMessage(error.message || 'Payment failed');
    }
  };

  const handleReset = () => {
    resetPayment();
    setPaymentMessage('');
  };

  if (elementsError) {
    return (
      <div className="stripe-error">
        <p>Error loading payment form: {elementsError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="stripe-gateway">
      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        className={`payment-form ${loading ? 'loading' : ''}`}
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="card-element">Card Number</label>
            <div id="card-element" className="stripe-element"></div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry-element">Expiry Date</label>
            <div id="expiry-element" className="stripe-element"></div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cvc-element">CVC</label>
            <div id="cvc-element" className="stripe-element"></div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postal-code-element">Postal Code</label>
            <div id="postal-code-element" className="stripe-element"></div>
          </div>
        </div>

        {error && (
          <div className="payment-error">
            <p>{error}</p>
          </div>
        )}

        {paymentMessage && (
          <div className="payment-message">
            <p>{paymentMessage}</p>
          </div>
        )}

        {paymentSuccess && (
          <div className="payment-success">
            <p>Payment successful! Redirecting...</p>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || elementsLoading}
            className="payment-button"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          
          <button 
            type="button" 
            onClick={handleReset}
            className="reset-button"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Loading indicator */}
      {(loading || elementsLoading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing payment...</p>
        </div>
      )}
    </div>
  );
};

export default StripeGateway; 