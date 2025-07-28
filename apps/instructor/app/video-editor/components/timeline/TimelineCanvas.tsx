'use client'
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setCurrentTime } from '../../../redux/features/videoEditor/videoEditorSlice';
import { useVideoTime } from '../../../context/VideoTimeContext';
import VideoTrack from './tracks/VideoTrack';
import AudioTrack from './tracks/AudioTrack';
import AIVoiceTrack from './tracks/AIVoiceTrack';
import MusicTrack from './tracks/MusicTrack';
import TimeRuler from './controls/TimeRuler';
import { Clips } from '../../../types/videoeditor.types';
import { calculateTimelineWidth, calculatePixelPosition, calculateTimeFromPixels } from './utils/timelineUtils';

interface TimelineCanvasProps {
  videoClips: Clips[];
  aiAudioClips: any[];
  scale: number;
  selectedTool?: 'selection' | 'razor' | 'text' | 'transition';
  onClipsChange: (clips: Clips[]) => void;
  onAiAudioChange: (clips: any[]) => void;
}

const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  videoClips,
  aiAudioClips,
  scale,
  selectedTool = 'selection',
  onClipsChange,
  onAiAudioChange,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tracksContainerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastPlayheadPositionRef = useRef(0);

  const { currentTimeSec, setCurrentTimeSec, durationSec, videoRef } = useVideoTime();
  
  // Import Redux state for timeline-aware playback
  const dispatch = useDispatch();
  const { currentTime: reduxCurrentTime } = useSelector((state: RootState) => state.videoEditor);

  // Calculate total duration from all clips
  useEffect(() => {
    const duration = videoClips.reduce((total, clip) => total + (clip.end - clip.start), 0);
    setTotalDuration(duration); // Duration is 0 if no clips
  }, [videoClips]);


  // Update playhead position with millisecond precision using requestAnimationFrame
  useEffect(() => {
    const updatePlayhead = (timestamp: number) => {
      // Skip updates while dragging to prevent conflicts
      if (isDraggingRef.current) {
        animationFrameRef.current = requestAnimationFrame(updatePlayhead);
        return;
      }

      if (!tracksContainerRef.current || !videoRef.current) {
        animationFrameRef.current = requestAnimationFrame(updatePlayhead);
        return;
      }

      // Use timeline duration (sum of all clips)
      const effectiveDuration = totalDuration;
      
      if (effectiveDuration === 0) {
        // No clips on timeline, playhead stays at position 0
        if (lastPlayheadPositionRef.current !== 0) {
          setPlayheadPosition(0);
          lastPlayheadPositionRef.current = 0;
        }
      } else {
        // Use Redux currentTime which is timeline-aware
        const timelineTime = reduxCurrentTime;
        
        // Calculate pixel position using the same function as timeline elements
        const pixelPosition = calculatePixelPosition(timelineTime, scale);
        const maxPosition = calculatePixelPosition(effectiveDuration, scale);
        const newPosition = Math.min(pixelPosition, maxPosition);
        
        // Only update if position changed significantly (sub-pixel precision)
        if (Math.abs(newPosition - lastPlayheadPositionRef.current) > 0.1) {
          setPlayheadPosition(newPosition);
          lastPlayheadPositionRef.current = newPosition;
          
          // Auto-scroll to keep playhead in view
          if (scrollContainerRef.current && tracksContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const viewWidth = scrollContainerRef.current.clientWidth;
            const trackLabelWidth = 160; // Width of the track labels
            const visibleStart = scrollLeft;
            const visibleEnd = scrollLeft + viewWidth - trackLabelWidth;
            const padding = 100; // Keep playhead 100px from edges
            
            if (newPosition < visibleStart + padding) {
              scrollContainerRef.current.scrollLeft = Math.max(0, newPosition - padding);
            } else if (newPosition > visibleEnd - padding) {
              scrollContainerRef.current.scrollLeft = newPosition - viewWidth + trackLabelWidth + padding;
            }
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updatePlayhead);
    };
    
    animationFrameRef.current = requestAnimationFrame(updatePlayhead);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scale, totalDuration, reduxCurrentTime]); // Removed playheadPosition from dependencies

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tracksContainerRef.current) return;
    
    // Don't allow seeking if no video is loaded
    const effectiveDuration = durationSec > 0 ? durationSec : totalDuration;
    if (effectiveDuration === 0) return;
    
    // Don't handle clicks on child elements (like clips)
    if (e.target !== e.currentTarget && !e.currentTarget.classList.contains('track-row')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = tracksContainerRef.current.parentElement?.scrollLeft || 0;
    const clickX = e.clientX - rect.left + scrollLeft;
    
    // Calculate maximum position based on actual video duration
    const maxTimePosition = calculatePixelPosition(effectiveDuration, scale);
    const newPosition = Math.max(0, Math.min(clickX, maxTimePosition));
    
    // Update position
    setPlayheadPosition(newPosition);
    lastPlayheadPositionRef.current = newPosition;
    
    // Update timeline time (not video time)
    const newTime = Math.max(0, Math.min(calculateTimeFromPixels(newPosition, scale), effectiveDuration));
    
    if (isFinite(newTime) && !isNaN(newTime)) {
      // Update Redux state which will trigger proper video seeking
      dispatch(setCurrentTime(newTime));
    }
  };

  // Handle playhead dragging
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Don't allow dragging if no video is loaded
    const effectiveDuration = durationSec > 0 ? durationSec : totalDuration;
    if (effectiveDuration === 0) {
      // Visual feedback that dragging is disabled
      return;
    }
    
    setIsDragging(true);
    isDraggingRef.current = true;
    
    const startX = e.clientX;
    const startPos = playheadPosition;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!tracksContainerRef.current) return;
      
      const rect = tracksContainerRef.current.getBoundingClientRect();
      const scrollLeft = tracksContainerRef.current.parentElement?.scrollLeft || 0;
      const x = e.clientX - rect.left + scrollLeft;
      
      // Calculate maximum position based on actual video duration
      const maxTimePosition = calculatePixelPosition(effectiveDuration, scale);
      const newPosition = Math.max(0, Math.min(x, maxTimePosition));
      
      // Update position directly for immediate feedback
      setPlayheadPosition(newPosition);
      lastPlayheadPositionRef.current = newPosition;
      
      // Update timeline time (not video time)
      const newTime = Math.max(0, Math.min(calculateTimeFromPixels(newPosition, scale), effectiveDuration));
      
      if (isFinite(newTime) && !isNaN(newTime)) {
        // Update Redux state which will trigger proper video seeking
        dispatch(setCurrentTime(newTime));
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Sync ruler scroll with timeline scroll
  useEffect(() => {
    const handleScroll = () => {
      if (rulerRef.current && scrollContainerRef.current) {
        rulerRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Check if there are no video clips
  const hasNoVideos = videoClips.length === 0;

  return (
    <div className="h-full flex bg-white">
      {/* Timeline Container */}
      <div 
        className="flex-1 flex overflow-x-auto overflow-y-hidden light-scrollbar" 
        ref={scrollContainerRef}
        style={{
          scrollBehavior: 'smooth',
          paddingBottom: '4px' // Space for scrollbar
        }}
      >
        {/* Track Labels */}
        <div className="sticky left-0 z-10 bg-white border-r border-gray-200 w-40 flex-shrink-0">
          <div className="space-y-0">
            {/* Time Ruler Label */}
            <div className="h-8 border-b border-gray-200 flex items-center px-4 bg-gray-50">
              <span className="text-xs text-gray-600 font-medium">Timeline</span>
            </div>
            
            {/* Video Track Label */}
            <div className="h-20 border-b border-gray-200 flex items-center px-4">
              <div className="track-header bg-gray-100 text-gray-700">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                <span className="text-sm font-medium">Video</span>
              </div>
            </div>
            
            {/* Audio Track Label */}
            <div className="h-20 border-b border-gray-200 flex items-center px-4">
              <div className="track-header bg-gray-100 text-gray-700">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="text-sm font-medium">Audio</span>
              </div>
            </div>
            
            {/* AI Voice Track Label */}
            <div className="h-20 border-b border-gray-200 flex items-center px-4">
              <div className="track-header bg-gray-100 text-gray-700">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 9v6h4l5 5V4l-5 5H9zm-2 0H5v6h2V9z"/>
                </svg>
                <span className="text-sm font-medium">AI Voice</span>
              </div>
            </div>
            
            {/* Music Track Label */}
            <div className="h-20 flex items-center px-4">
              <div className="track-header bg-gray-100 text-gray-700">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="text-sm font-medium">Music</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline Tracks */}
        <div 
          ref={timelineRef}
          className="flex-1 relative bg-gray-50 select-none"
          style={{ 
            minWidth: `${hasNoVideos ? 1200 : calculateTimelineWidth(totalDuration, scale)}px`, 
            zIndex: 20 
          }}
        >
          {/* Playhead - Now spans ruler and tracks */}
          <div
            className="timeline-playhead"
            style={{ 
              position: 'absolute',
              left: `${playheadPosition}px`,
              top: '0',
              width: '2px',
              height: '100%',
              zIndex: 50,
              pointerEvents: 'none'
            }}
          >
            {/* Playhead Handle - Triangle shape pointing downward */}
            <div
              className="timeline-playhead-handle"
              onMouseDown={handlePlayheadMouseDown}
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                position: 'absolute',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: `16px solid ${(durationSec === 0 && totalDuration === 0) ? '#9ca3af' : '#ef4444'}`,
                cursor: (durationSec === 0 && totalDuration === 0) ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                opacity: (durationSec === 0 && totalDuration === 0) ? 0.5 : 1,
                pointerEvents: 'all',
                zIndex: 1000,
                transition: isDragging ? 'none' : 'all 0.1s ease',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                if (durationSec > 0 || totalDuration > 0) {
                  e.currentTarget.style.borderTopColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (durationSec > 0 || totalDuration > 0) {
                  e.currentTarget.style.borderTopColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateX(-50%)';
                } else {
                  e.currentTarget.style.borderTopColor = '#9ca3af';
                }
              }}
            />
            
            {/* Playhead Line */}
            <div 
              className="timeline-playhead-line"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '2px',
                height: '100%',
                background: (durationSec === 0 && totalDuration === 0) ? '#9ca3af' : '#ef4444',
                boxShadow: '0 0 4px rgba(239, 68, 68, 0.6)',
                opacity: (durationSec === 0 && totalDuration === 0) ? 0.5 : 1
              }}
            />
          </div>

          {/* Time Ruler at the top */}
          <div className="h-8 border-b border-gray-200 bg-white sticky top-0 z-30">
            <TimeRuler
              duration={totalDuration}
              scale={scale}
              className="h-full"
            />
          </div>
          
          {/* Tracks */}
          <div 
            ref={tracksContainerRef}
            className="tracks-container timeline-grid-light"
            onClick={handleTimelineClick}
          >
            {/* Empty State Message */}
            {hasNoVideos && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-40">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-medium">No videos imported</p>
                  <p className="text-gray-400 text-xs mt-1">Drag and drop video files to begin</p>
                </div>
              </div>
            )}
            
            {/* Video Track */}
            <div className="h-20 border-b border-gray-200 relative bg-white track-row" onClick={handleTimelineClick}>
              <VideoTrack
                clips={videoClips}
                totalDuration={totalDuration}
                scale={scale}
                onClipsChange={onClipsChange}
              />
            </div>
            
            {/* Audio Track */}
            <div className="h-20 border-b border-gray-200 relative bg-white track-row" onClick={handleTimelineClick}>
              <AudioTrack
                clips={videoClips}
                totalDuration={totalDuration}
                scale={scale}
                onClipsChange={onClipsChange}
              />
            </div>
            
            {/* AI Voice Track */}
            <div className="h-20 border-b border-gray-200 relative bg-white track-row" onClick={handleTimelineClick}>
              <AIVoiceTrack
                clips={aiAudioClips}
                totalDuration={totalDuration}
                scale={scale}
                onClipsChange={onAiAudioChange}
              />
            </div>
            
            {/* Music Track */}
            <div className="h-20 relative bg-white track-row" onClick={handleTimelineClick}>
              <MusicTrack
                clips={[]}
                totalDuration={totalDuration}
                scale={scale}
                onClipsChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCanvas;