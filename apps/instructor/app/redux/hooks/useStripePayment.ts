import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { 
  useCreatePaymentIntentMutation 
} from '../services/stripe.services';
import { 
  setLoading, 
  setError, 
  setPaymentSuccess, 
  setPaymentIntent, 
  resetPayment,
  selectStripeLoading,
  selectStripeError,
  selectPaymentSuccess,
  selectPaymentIntent
} from '../features/stripe/stripeSlice';

interface PaymentItem {
  product_id: string;
  quantity: number;
}

// Main hook for Stripe payment functionality
export const useStripePayment = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectStripeLoading);
  const error = useSelector(selectStripeError);
  const paymentSuccess = useSelector(selectPaymentSuccess);
  const paymentIntent = useSelector(selectPaymentIntent);
  
  const [createPaymentIntentMutation] = useCreatePaymentIntentMutation();
  
  const createPaymentIntent = useCallback(async (items: PaymentItem[]) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const result = await createPaymentIntentMutation(items).unwrap();
      dispatch(setPaymentIntent(result.data));
      return result.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create payment intent';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [createPaymentIntentMutation, dispatch]);
  
  const confirmPayment = useCallback(async (
    clientSecret: string, 
    cardElement: any, 
    billingDetails: any
  ) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
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
        dispatch(setError(error.message || 'Payment failed'));
        throw error;
      } else if (paymentIntent?.status === 'succeeded') {
        dispatch(setPaymentSuccess(true));
        return paymentIntent;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Payment confirmation failed';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  const resetPaymentState = useCallback(() => {
    dispatch(resetPayment());
  }, [dispatch]);
  
  return {
    loading,
    error,
    paymentSuccess,
    paymentIntent,
    createPaymentIntent,
    confirmPayment,
    resetPayment: resetPaymentState,
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    setError: (value: string | null) => dispatch(setError(value)),
  };
};