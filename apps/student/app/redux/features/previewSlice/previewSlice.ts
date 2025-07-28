import { createSlice } from "@reduxjs/toolkit";

interface PreviewState {
showPreview : boolean
} 

const initialState : PreviewState  = {
    showPreview: true,
}

const previewSlice = createSlice({
    name: 'previewSlice',
    initialState,
    reducers: {
         setPreview : (state) => {
            state.showPreview = !state.showPreview;
        },
      
    }
})

export const { setPreview } = previewSlice.actions;

export default previewSlice.reducer;
