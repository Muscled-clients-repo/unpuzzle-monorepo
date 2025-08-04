import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentIntent {
  client_secret: string;
  id: string;
  status: string;
}

interface StripeState {
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
  paymentIntent: PaymentIntent | null;
}

const initialState: StripeState = {
  loading: false,
  error: null,
  paymentSuccess: false,
  paymentIntent: null,
};

const stripeSlice = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    setPaymentIntent: (state, action: PayloadAction<PaymentIntent | null>) => {
      state.paymentIntent = action.payload;
    },
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentSuccess = false;
      state.paymentIntent = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setPaymentSuccess, 
  setPaymentIntent, 
  resetPayment 
} = stripeSlice.actions;

// Selectors
export const selectStripeLoading = (state: any) => state.stripe.loading;
export const selectStripeError = (state: any) => state.stripe.error;
export const selectPaymentSuccess = (state: any) => state.stripe.paymentSuccess;
export const selectPaymentIntent = (state: any) => state.stripe.paymentIntent;

export default stripeSlice.reducer;