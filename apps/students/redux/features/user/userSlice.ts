import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../../types/layout.types'

interface UserState {
  user: null | User,
  token: null | true,
  isAuthenticated: boolean,
  loading: boolean,
  error: null | string,
}

const initialState : UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state)=>{
      state.loading = true;
      state.error = null;    
    },
    loginSuccess: (state, action)=>{
      state.user = action.payload.user; 
      state.token = action.payload.token
      state.isAuthenticated = true;          
      state.loading = false;                  
    },
    loginFailure: (state, action)=>{
      state.loading = false;                  
      state.error = action.payload;           
    },
    logout: (state)=>{
      state.token = null
      state.user = null;                    
      state.isAuthenticated = false;          
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;