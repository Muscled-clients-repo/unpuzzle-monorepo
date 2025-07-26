'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RecordingContextType {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  recordingStartTime: Date | null;
  setRecordingStartTime: (time: Date | null) => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
};

interface RecordingProviderProps {
  children: ReactNode;
}

export const RecordingProvider: React.FC<RecordingProviderProps> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);

  // Prevent browser refresh/navigation during recording
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isRecording) {
        event.preventDefault();
        // Standard message for most browsers
        const message = 'Recording in progress. Are you sure you want to leave? Your recording will be lost.';
        event.returnValue = message;
        return message;
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (isRecording) {
        event.preventDefault();
        const confirmed = window.confirm(
          'Recording in progress. Are you sure you want to navigate away? Your recording will be lost.'
        );
        if (!confirmed) {
          // Push the current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Add event listeners when recording starts
    if (isRecording) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push current state to history stack for popstate handling
      window.history.pushState(null, '', window.location.href);
    } else {
      // Remove event listeners when recording stops
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isRecording]);

  // Keyboard shortcut to show recording status
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + R to show recording status
      if (isRecording && (event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        const duration = recordingStartTime 
          ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000)
          : 0;
        
        alert(`Recording in progress for ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, recordingStartTime]);

  const value = {
    isRecording,
    setIsRecording,
    recordingStartTime,
    setRecordingStartTime,
  };

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
};