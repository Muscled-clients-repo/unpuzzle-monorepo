// src/features/sidebar/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface SidebarState {
  isVisible: boolean,
  persistent: boolean
}
const initialState : SidebarState = {
  isVisible: false, // Tracks hover visibility  
  persistent: false, // Tracks click-based toggle
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    showSidebar: (state) => {
      state.isVisible = true;
    },
    hideSidebar: (state) => {
      if (!state.persistent) {
        state.isVisible = false; // Hide on hover only if not persistent
      }
    },
    togglePersistent: (state) => {
      state.persistent = !state.persistent; // Toggle persistence
      state.isVisible = state.persistent ? true : state.isVisible; // Ensure visibility matches persistent state
    },
  },
});

export const { showSidebar, hideSidebar, togglePersistent } = sidebarSlice.actions;
export default sidebarSlice.reducer;