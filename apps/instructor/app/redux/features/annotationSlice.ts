// src/features/sidebar/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface AnnotationState {

  activeIndex: number;
  activeTab: string | null;
  countdown: number | null;
  isRecording: boolean;
  screenBlob: string | null;
  showControls: boolean;
  isAudioRecording: boolean;
  quizModal: boolean;
  recordedAudioUrl: string | null;
}

const initialState: AnnotationState = {
  
  activeIndex: 0,
  activeTab: "Audio PP",
  countdown: null,
  isRecording: false,
  screenBlob: null,
  showControls: false,
  isAudioRecording: false,
  quizModal: false,
  recordedAudioUrl: null,
};

const annotationSlice = createSlice({
  name: 'teacherAnnotations',
  initialState,
  reducers: {
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setScreenBlob: (state, action) => {
      state.screenBlob = action.payload;
    },
    setShowControls: (state, action) => {
      state.showControls = action.payload;
    },
    setIsAudioRecording: (state, action) => {
      state.isAudioRecording = action.payload;
    },
    setQuizModal: (state, action) => {
      state.quizModal = action.payload;
    },
    setRecordedAudioUrl: (state, action) => {
      state.recordedAudioUrl = action.payload;
    },
  },
});

export const {
  setActiveIndex,
  setActiveTab,
  setCountdown,
  setIsRecording,
  setScreenBlob,
  setShowControls,
  setIsAudioRecording,
  setQuizModal,
  setRecordedAudioUrl,
} = annotationSlice.actions;

export default annotationSlice.reducer;