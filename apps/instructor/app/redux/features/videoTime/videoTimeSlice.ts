import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useRef, useCallback, MutableRefObject } from "react";
import { useDispatch, useSelector } from "react-redux";

interface VideoTimeState {
  // Core video timing
  currentTime: number;
  duration: number;
  displayTime: number;
  
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  
  // Video controls
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Video element tracking
  activeVideoId: string | null;
  videoElements: Record<string, {
    id: string;
    element: HTMLVideoElement | null;
    timestamp: number;
  }>;
  
  // Error handling
  error: string | null;
  
  // Performance optimization
  lastUpdateTime: number;
  updateThrottle: number; // milliseconds
}

const initialState: VideoTimeState = {
  currentTime: 0,
  duration: 0,
  displayTime: 0,
  isPlaying: false,
  isLoading: false,
  isPaused: false,
  volume: 100,
  isMuted: false,
  playbackRate: 1,
  activeVideoId: null,
  videoElements: {},
  error: null,
  lastUpdateTime: 0,
  updateThrottle: 100, // 100ms throttle for performance
};

const videoTimeSlice = createSlice({
  name: "videoTime",
  initialState,
  reducers: {
    // Time management
    setCurrentTime: (state, action: PayloadAction<number>) => {
      const now = Date.now();
      if (now - state.lastUpdateTime >= state.updateThrottle) {
        state.currentTime = action.payload;
        state.lastUpdateTime = now;
      }
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    setDisplayTime: (state, action: PayloadAction<number>) => {
      state.displayTime = action.payload;
    },
    
    // Playback control
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
      state.isPaused = !action.payload;
    },
    
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    play: (state) => {
      state.isPlaying = true;
      state.isPaused = false;
    },
    
    pause: (state) => {
      state.isPlaying = false;
      state.isPaused = true;
    },
    
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
      state.isPaused = !state.isPlaying;
    },
    
    // Volume control
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(100, action.payload));
      state.isMuted = state.volume === 0;
    },
    
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    
    // Playback rate
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = Math.max(0.25, Math.min(4, action.payload));
    },
    
    // Video element management
    registerVideoElement: (state, action: PayloadAction<{
      id: string;
      element: HTMLVideoElement | null;
    }>) => {
      const { id, element } = action.payload;
      state.videoElements[id] = {
        id,
        element: null, // DOM elements can't be stored in Redux
        timestamp: Date.now(),
      };
      
      // Set as active if no active video
      if (!state.activeVideoId || !state.videoElements[state.activeVideoId]) {
        state.activeVideoId = id;
      }
    },
    
    unregisterVideoElement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.videoElements[id];
      
      // Clear active if it was the unregistered element
      if (state.activeVideoId === id) {
        const remainingIds = Object.keys(state.videoElements);
        state.activeVideoId = remainingIds.length > 0 ? remainingIds[0] : null;
      }
    },
    
    setActiveVideo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.videoElements[id]) {
        state.activeVideoId = id;
      }
    },
    
    // Seek functionality
    seekTo: (state, action: PayloadAction<number>) => {
      const seekTime = Math.max(0, Math.min(state.duration, action.payload));
      state.currentTime = seekTime;
      state.displayTime = seekTime;
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset functionality
    resetVideoTime: (state) => {
      state.currentTime = 0;
      state.displayTime = 0;
      state.isPlaying = false;
      state.isPaused = false;
      state.error = null;
    },
    
    resetAllVideoState: () => initialState,
    
    // Performance optimization
    setUpdateThrottle: (state, action: PayloadAction<number>) => {
      state.updateThrottle = Math.max(50, Math.min(1000, action.payload));
    },
    
    // Batch update for performance
    batchUpdateVideoState: (state, action: PayloadAction<{
      currentTime?: number;
      isPlaying?: boolean;
      volume?: number;
      displayTime?: number;
    }>) => {
      const { currentTime, isPlaying, volume, displayTime } = action.payload;
      const now = Date.now();
      
      if (now - state.lastUpdateTime >= state.updateThrottle) {
        if (currentTime !== undefined) state.currentTime = currentTime;
        if (isPlaying !== undefined) {
          state.isPlaying = isPlaying;
          state.isPaused = !isPlaying;
        }
        if (volume !== undefined) {
          state.volume = volume;
          state.isMuted = volume === 0;
        }
        if (displayTime !== undefined) state.displayTime = displayTime;
        state.lastUpdateTime = now;
      }
    },
  },
});

export const {
  setCurrentTime,
  setDuration,
  setDisplayTime,
  setIsPlaying,
  setIsLoading,
  play,
  pause,
  togglePlayPause,
  setVolume,
  setIsMuted,
  toggleMute,
  setPlaybackRate,
  registerVideoElement,
  unregisterVideoElement,
  setActiveVideo,
  seekTo,
  setError,
  clearError,
  resetVideoTime,
  resetAllVideoState,
  setUpdateThrottle,
  batchUpdateVideoState,
} = videoTimeSlice.actions;

// Selectors
export const selectVideoTimeState = (state: any) => state.videoTime;
export const selectCurrentTime = (state: any) => state.videoTime.currentTime;
export const selectDuration = (state: any) => state.videoTime.duration;
export const selectDisplayTime = (state: any) => state.videoTime.displayTime;
export const selectIsPlaying = (state: any) => state.videoTime.isPlaying;
export const selectIsLoading = (state: any) => state.videoTime.isLoading;
export const selectIsPaused = (state: any) => state.videoTime.isPaused;
export const selectVolume = (state: any) => state.videoTime.volume;
export const selectIsMuted = (state: any) => state.videoTime.isMuted;
export const selectPlaybackRate = (state: any) => state.videoTime.playbackRate;
export const selectActiveVideoId = (state: any) => state.videoTime.activeVideoId;
export const selectVideoElements = (state: any) => state.videoTime.videoElements;
export const selectVideoError = (state: any) => state.videoTime.error;

// Advanced selectors
export const selectActiveVideoElement = (state: any) => {
  const activeId = state.videoTime.activeVideoId;
  return activeId ? state.videoTime.videoElements[activeId]?.element || null : null;
};

export const selectFormattedCurrentTime = (state: any) => {
  const time = state.videoTime.displayTime || state.videoTime.currentTime;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const selectFormattedDuration = (state: any) => {
  const duration = state.videoTime.duration;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const selectVideoProgress = (state: any) => {
  const { currentTime, duration } = state.videoTime;
  return duration > 0 ? (currentTime / duration) * 100 : 0;
};

export default videoTimeSlice.reducer;