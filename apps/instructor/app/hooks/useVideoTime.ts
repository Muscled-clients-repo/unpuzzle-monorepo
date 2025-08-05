"use client";
import { useRef, useCallback, useEffect, MutableRefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTime,
  setDuration,
  setDisplayTime,
  registerVideoElement,
  unregisterVideoElement,
  setActiveVideo,
  selectCurrentTime,
  selectDuration,
  selectDisplayTime,
  selectActiveVideoId,
  selectVideoElements,
  batchUpdateVideoState,
} from "../redux/hooks";

// Type definition matching the original VideoTimeContext
type VideoTimeContextType = {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  currentTimeSec: MutableRefObject<number>;
  setCurrentTimeSec: (newTime: number) => void;
  durationSec: number;
  setDurationSec: (newDuration: number) => void;
};

// Create a unique ID generator for video elements
let videoIdCounter = 0;
const generateVideoId = () => `video_${++videoIdCounter}_${Date.now()}`;

// Custom hook that provides backward compatibility with the original VideoTimeContext
export const useVideoTime = (): VideoTimeContextType => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const currentTime = useSelector(selectCurrentTime);
  const duration = useSelector(selectDuration);
  const displayTime = useSelector(selectDisplayTime);
  const activeVideoId = useSelector(selectActiveVideoId);
  const videoElements = useSelector(selectVideoElements);
  
  // Create refs for backward compatibility
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeRef = useRef<number>(currentTime);
  const videoIdRef = useRef<string | null>(null);
  
  // Update currentTimeRef when Redux state changes
  useEffect(() => {
    currentTimeRef.current = displayTime || currentTime;
  }, [currentTime, displayTime]);
  
  // Generate video ID on first render
  useEffect(() => {
    if (!videoIdRef.current) {
      videoIdRef.current = generateVideoId();
    }
  }, []);
  
  // Register/unregister video element when ref changes
  useEffect(() => {
    const videoId = videoIdRef.current;
    if (!videoId) return;
    
    if (videoRef.current) {
      dispatch(registerVideoElement({
        id: videoId,
        element: videoRef.current,
      }));
      
      // Set as active video if no active video exists
      if (!activeVideoId) {
        dispatch(setActiveVideo(videoId));
      }
    }
    
    return () => {
      if (videoId) {
        dispatch(unregisterVideoElement(videoId));
      }
    };
  }, [videoRef.current, dispatch, activeVideoId]);
  
  // Backward-compatible setCurrentTimeSec function
  const setCurrentTimeSec = useCallback((newTime: number) => {
    // Update the ref immediately for synchronous access
    currentTimeRef.current = newTime;
    
    // Update Redux state (with throttling built into the slice)
    dispatch(setCurrentTime(newTime));
    dispatch(setDisplayTime(newTime));
    
    // Update the actual video element if it exists
    if (videoRef.current && !isNaN(newTime) && isFinite(newTime)) {
      try {
        videoRef.current.currentTime = newTime;
      } catch (error) {
        console.warn("Failed to update video currentTime:", error);
      }
    }
  }, [dispatch]);
  
  // Backward-compatible setDurationSec function
  const setDurationSec = useCallback((newDuration: number) => {
    if (!isNaN(newDuration) && isFinite(newDuration) && newDuration >= 0) {
      dispatch(setDuration(newDuration));
    }
  }, [dispatch]);
  
  // Enhanced video ref that syncs with Redux
  const enhancedVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Create a proxy ref that updates Redux when the video element changes
  const createVideoRef = useCallback((): MutableRefObject<HTMLVideoElement | null> => {
    return {
      get current() {
        return enhancedVideoRef.current;
      },
      set current(element: HTMLVideoElement | null) {
        const previousElement = enhancedVideoRef.current;
        enhancedVideoRef.current = element;
        videoRef.current = element;
        
        // Clean up previous element listeners
        if (previousElement) {
          previousElement.removeEventListener('timeupdate', handleTimeUpdate);
          previousElement.removeEventListener('durationchange', handleDurationChange);
          previousElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
        
        // Set up new element listeners
        if (element) {
          element.addEventListener('timeupdate', handleTimeUpdate);
          element.addEventListener('durationchange', handleDurationChange);
          element.addEventListener('loadedmetadata', handleLoadedMetadata);
          
          // Initial sync
          if (!isNaN(element.duration) && isFinite(element.duration)) {
            setDurationSec(element.duration);
          }
          if (!isNaN(element.currentTime) && isFinite(element.currentTime)) {
            setCurrentTimeSec(element.currentTime);
          }
        }
      }
    };
  }, [setCurrentTimeSec, setDurationSec]);
  
  // Event handlers for video element synchronization
  const handleTimeUpdate = useCallback((event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (video && !isNaN(video.currentTime) && isFinite(video.currentTime)) {
      // Use batch update for better performance
      dispatch(batchUpdateVideoState({
        currentTime: video.currentTime,
        displayTime: video.currentTime,
      }));
      currentTimeRef.current = video.currentTime;
    }
  }, [dispatch]);
  
  const handleDurationChange = useCallback((event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (video && !isNaN(video.duration) && isFinite(video.duration)) {
      setDurationSec(video.duration);
    }
  }, [setDurationSec]);
  
  const handleLoadedMetadata = useCallback((event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (video) {
      if (!isNaN(video.duration) && isFinite(video.duration)) {
        setDurationSec(video.duration);
      }
      if (!isNaN(video.currentTime) && isFinite(video.currentTime)) {
        setCurrentTimeSec(video.currentTime);
      }
    }
  }, [setCurrentTimeSec, setDurationSec]);
  
  // Return the same interface as the original VideoTimeContext
  return {
    videoRef: createVideoRef(),
    currentTimeSec: currentTimeRef,
    setCurrentTimeSec,
    durationSec: duration,
    setDurationSec,
  };
};

// Additional utility hook for advanced video time features
export const useAdvancedVideoTime = () => {
  const dispatch = useDispatch();
  
  return {
    // All Redux selectors
    currentTime: useSelector(selectCurrentTime),
    duration: useSelector(selectDuration),
    displayTime: useSelector(selectDisplayTime),
    activeVideoId: useSelector(selectActiveVideoId),
    videoElements: useSelector(selectVideoElements),
    
    // Additional actions
    seekTo: useCallback((time: number) => {
      dispatch(setCurrentTime(time));
      dispatch(setDisplayTime(time));
    }, [dispatch]),
    
    batchUpdate: useCallback((updates: {
      currentTime?: number;
      isPlaying?: boolean;
      volume?: number;
      displayTime?: number;
    }) => {
      dispatch(batchUpdateVideoState(updates));
    }, [dispatch]),
  };
};

export default useVideoTime;