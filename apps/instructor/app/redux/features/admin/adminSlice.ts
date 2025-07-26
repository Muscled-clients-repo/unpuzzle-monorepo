// src/features/admin/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  filter: string;
  checkedItems: string[]; // Assuming the checked items are strings (like IDs)
  isSelectAll: boolean;
  currentPage: number;
  sortOption: string;
  searchText: string;
  isSortPopupOpen: boolean;
  isSearchOpen: boolean;
}

const initialState: AdminState = {
  filter: 'All',
  checkedItems: [],
  isSelectAll: false,
  currentPage: 1,
  sortOption: '',
  searchText: '',
  isSortPopupOpen: false,
  isSearchOpen: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.currentPage = 1; // Reset to page 1 on filter change
    },
    toggleCheckedItem(state, action: PayloadAction<string>) {
      const index = state.checkedItems.indexOf(action.payload);
      if (index !== -1) {
        state.checkedItems.splice(index, 1);
      } else {
        state.checkedItems.push(action.payload);
      }
    },
    toggleSelectAll(state, action: PayloadAction<string[]>) {
      state.isSelectAll = !state.isSelectAll; // Toggle the select all state
      state.checkedItems = state.isSelectAll ? action.payload : []; // action.payload should be the list of all item IDs
    },
    setSortOption(state, action: PayloadAction<string>) {
      state.sortOption = action.payload;
      state.isSortPopupOpen = false; // Close the popup
    },
    toggleSortPopup(state) {
      state.isSortPopupOpen = !state.isSortPopupOpen;
    },
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
      state.currentPage = 1; // Reset to page 1 on search text change
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setFilter,
  toggleCheckedItem,
  toggleSelectAll,
  setSortOption,
  setSearchText,
  toggleSearch,
  setCurrentPage,
  toggleSortPopup,
} = adminSlice.actions;

export default adminSlice.reducer;
