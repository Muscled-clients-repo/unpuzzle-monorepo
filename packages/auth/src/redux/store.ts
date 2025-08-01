// apps/student/app/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// apps/student/app/redux/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // ✅ Correct

