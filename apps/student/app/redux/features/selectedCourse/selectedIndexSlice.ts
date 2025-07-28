import { createSlice } from "@reduxjs/toolkit";

interface SelectedIndexState {
    selectedIndexes: number[]; 
  }
  
  const initialState: SelectedIndexState = {
    selectedIndexes: [],
  };

const selectedIndexSlice = createSlice({
  name: "selectedIndex",
  initialState,
  reducers: {
    toggleIndex: (state, action) => {
      const index = action.payload;
      if (state.selectedIndexes.includes(index)) {
        state.selectedIndexes = state.selectedIndexes.filter((i) => i !== index);
      } else {
        state.selectedIndexes.push(index);
      }
    },
    clearIndexes: (state) => {
      state.selectedIndexes = []; // Reset selection
    },
  },
});

export const { toggleIndex, clearIndexes } = selectedIndexSlice.actions;
export default selectedIndexSlice.reducer;
