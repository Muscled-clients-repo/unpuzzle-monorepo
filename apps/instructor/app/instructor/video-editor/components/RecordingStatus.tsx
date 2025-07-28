'use client'
import React, { useEffect, useState } from 'react';
import { useRecording } from '../../../context/RecordingContext';

const RecordingIndicator: React.FC = () => {
  const { isRecording, recordingStartTime } = useRecording();
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Update recording duration every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && recordingStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - recordingStartTime.getTime()) / 1000);
        setRecordingDuration(duration);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingStartTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        {/* Pulsing red dot */}
        <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold">RECORDING</span>
          <span className="text-xs">{formatDuration(recordingDuration)}</span>
        </div>
        
        {/* Warning icon */}
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      {/* Warning message */}
      <div className="mt-2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded text-xs max-w-xs">
        ⚠️ Refresh protection active. Don't close this tab during recording.
      </div>
    </div>
  );
};

export default RecordingIndicator;