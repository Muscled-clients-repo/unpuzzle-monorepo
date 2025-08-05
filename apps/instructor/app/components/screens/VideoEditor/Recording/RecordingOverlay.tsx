'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRecording } from '../../../../context/RecordingContext';

interface RecordingOverlayProps {
  webcamStream?: MediaStream | null;
  webcamPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onStop?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
  recordingTime?: number;
}

const RecordingOverlay: React.FC<RecordingOverlayProps> = ({
  webcamStream,
  webcamPosition = 'bottom-right',
  onStop,
  onPause,
  onResume,
  isPaused = false,
  recordingTime = 0,
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [webcamPos, setWebcamPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (webcamRef.current && webcamStream) {
      webcamRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWebcamPositionStyles = () => {
    const positions = {
      'bottom-right': { bottom: 20, right: 20 },
      'bottom-left': { bottom: 20, left: 20 },
      'top-right': { top: 20, right: 20 },
      'top-left': { top: 20, left: 20 },
    };
    return positions[webcamPosition];
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Recording Controls */}
      <div 
        className={`fixed top-4 right-4 pointer-events-auto transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 shadow-xl">
          <div className="flex items-center space-x-4">
            {/* Recording Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-mono text-lg">{formatTime(recordingTime)}</span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              {isPaused ? (
                <button
                  onClick={onResume}
                  className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                  title="Resume Recording"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={onPause}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors"
                  title="Pause Recording"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </button>
              )}

              <button
                onClick={onStop}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                title="Stop Recording"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-2 text-xs text-gray-300">
            {isPaused ? 'Recording Paused' : 'Recording...'}
          </div>
        </div>
      </div>

      {/* Webcam Preview */}
      {webcamStream && (
        <div
          className="fixed pointer-events-auto"
          style={{
            ...getWebcamPositionStyles(),
            transform: isDragging ? `translate(${webcamPos.x}px, ${webcamPos.y}px)` : undefined,
          }}
        >
          <div className="relative group">
            <video
              ref={webcamRef}
              autoPlay
              muted
              playsInline
              className="w-48 h-36 bg-black rounded-lg shadow-2xl border-2 border-gray-800"
            />
            
            {/* Drag Handle */}
            <div
              className="absolute inset-0 cursor-move opacity-0 group-hover:opacity-100 bg-black/20 rounded-lg flex items-center justify-center transition-opacity"
              onMouseDown={(e) => {
                setIsDragging(true);
                const startX = e.clientX;
                const startY = e.clientY;
                const startPosX = webcamPos.x;
                const startPosY = webcamPos.y;

                const handleMouseMove = (e: MouseEvent) => {
                  setWebcamPos({
                    x: startPosX + (e.clientX - startX),
                    y: startPosY + (e.clientY - startY),
                  });
                };

                const handleMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Recording Border */}
      <div className="fixed inset-0 border-4 border-red-500/30 rounded-lg pointer-events-none animate-pulse" />
    </div>
  );
};

export default RecordingOverlay;