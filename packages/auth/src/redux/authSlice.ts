// packages/auth/src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    setLoading(state) {
      state.status = 'loading';
    },
    clearAuth(state) {
      state.user = null;
      state.status = 'idle';
    },
  },
});

export const { hydrateAuth, setLoading, clearAuth } = authSlice.actions;

export default authSlice.reducer;
