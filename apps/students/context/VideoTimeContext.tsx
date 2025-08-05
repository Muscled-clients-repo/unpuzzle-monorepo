"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  RefObject,
  MutableRefObject
} from "react";

type VideoTimeContextType = {
  videoRef: MutableRefObject<HTMLVideoElement | null>; // Include videoRef
  currentTimeSec: MutableRefObject<number>; // Current time of the video in seconds
  setCurrentTimeSec: (newTime: number) => void; // Setter for current time
  durationSec: number; // Video duration in seconds
  setDurationSec: (newDuration: number) => void; // Setter for video duration
};

const VideoTimeContext = createContext<VideoTimeContextType | undefined>(
  undefined
);

type VideoTimeProviderProps = {
  children: ReactNode;
};

export const VideoTimeProvider: React.FC<VideoTimeProviderProps> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTimeSec = useRef<number>(0); // Use ref instead of state
  const [durationSec, setDurationSec] = useState(0); // Initialize duration as 0

  const setCurrentTimeSec = (newTime: number) => {
    currentTimeSec.current = newTime;
  };
  
  return (
    <VideoTimeContext.Provider
      value={{
        videoRef,
        currentTimeSec,
        setCurrentTimeSec,
        durationSec,
        setDurationSec,
      }}
    >
      {children}
    </VideoTimeContext.Provider>
  );
};

// Custom hook to use the context
export const useVideoTime = (): VideoTimeContextType => {
  const context = useContext(VideoTimeContext);
  if (!context) {
    throw new Error("useVideoTime must be used within a VideoTimeProvider");
  }
  return context;
};
