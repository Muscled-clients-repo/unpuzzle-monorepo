import { createSlice } from '@reduxjs/toolkit';

interface RecordingState {
  countdown : null | number,
  recordingStarted: boolean,
  showControls: boolean,
  isOpen: boolean
}

const initialState : RecordingState = {
  countdown: null,
  recordingStarted: false,
  showControls: false,
  isOpen: false,
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    openPopover: (state) => {
      state.isOpen = true;
    },
    closePopover: (state) => {
      state.isOpen = false;
    },
    togglePopover: (state) => {
      state.isOpen = !state.isOpen;
    },
    startCountdown: (state) => {
      state.countdown = 3; // Start countdown from 3 seconds
    },
    decrementCountdown: (state) => {
      if (state.countdown !== null && state.countdown > 0) {
        state.countdown -= 1;
      }
      if (state.countdown === 0) {
        state.recordingStarted = true;
        state.showControls = true;
        state.countdown = null; // Reset countdown
      }
    },
    skipCountdown: (state) => {
      state.countdown = null;
      state.recordingStarted = true;
      state.showControls = true;
    },
    setStopRecording: (state) => {
      state.countdown = null;
      state.recordingStarted = false;
      state.showControls = false;
    },
  },
});

export const {
  startCountdown,
  decrementCountdown,
  skipCountdown,
  setStopRecording,
  openPopover,
  closePopover,
  togglePopover
} = recordingSlice.actions;

export default recordingSlice.reducer;
