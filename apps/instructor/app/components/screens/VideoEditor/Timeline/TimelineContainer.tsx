'use client'
import React, { useRef, useEffect, useState } from 'react';
import { useVideoTime } from '../../../../hooks/useVideoTime';
import VideoTrack from './VideoTrack';
import AudioTrack from './AudioTrack';
import AIVoiceTrack from './AIVoiceTrack';
import MusicTrack from './MusicTrack';
import TimeRuler from './TimeRuler';
import { Clips } from '../../../../types/videoeditor.types';
import { calculateTimelineWidth, calculatePixelPosition, calculateTimeFromPixels, PIXELS_PER_SECOND } from './timelineUtils';

interface TimelineContainerProps {
  videoClips: Clips[];
  aiAudioClips: any[];
  scale: number;
  selectedTool?: 'selection' | 'razor' | 'text';
  onClipsChange: (clips: Clips[]) => void;
  onAiAudioChange: (clips: any[]) => void;
}

const TimelineContainer: React.FC<TimelineContainerProps> = ({
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

  const { currentTimeSec, setCurrentTimeSec, durationSec } = useVideoTime();

  // Calculate total duration from all clips
  useEffect(() => {
    const duration = videoClips.reduce((total, clip) => total + (clip.end - clip.start), 0);
    setTotalDuration(duration); // Duration is 0 if no clips
  }, [videoClips]);


  // Update playhead position when current time changes
  useEffect(() => {
    if (tracksContainerRef.current) {
      if (totalDuration === 0) {
        // No clips, playhead stays at position 0
        setPlayheadPosition(0);
      } else {
        // Calculate position based on current time relative to total duration
        const newPosition = Math.min(calculatePixelPosition(currentTimeSec.current, scale), tracksContainerRef.current.scrollWidth - 1);
        
        // Only set position if it's a valid finite number
        if (isFinite(newPosition) && !isNaN(newPosition)) {
          setPlayheadPosition(newPosition);
        }
      }
    }
  }, [currentTimeSec, totalDuration, scale]);

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tracksContainerRef.current) return;
    
    // Don't handle clicks on child elements (like clips)
    if (e.target !== e.currentTarget && !e.currentTarget.classList.contains('track-row')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = tracksContainerRef.current.parentElement?.scrollLeft || 0;
    const clickX = e.clientX - rect.left + scrollLeft;
    
    // Get the actual width of the tracks container
    const containerWidth = tracksContainerRef.current.scrollWidth;
    
    // Limit to container width minus 50px
    const maxPosition = containerWidth - 50;
    const newPosition = Math.max(0, Math.min(clickX, maxPosition));
    
    // Update position
    setPlayheadPosition(newPosition);
    
    // Update time if we have duration
    if (totalDuration > 0) {
      const newTime = Math.max(0, Math.min(calculateTimeFromPixels(newPosition, scale), totalDuration));
      
      // Only set time if it's a valid finite number
      if (isFinite(newTime) && !isNaN(newTime)) {
        setCurrentTimeSec(newTime);
      }
    }
  };

  // Handle playhead dragging
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Allow dragging even if duration is 0 for testing
    setIsDragging(true);
    
    const startX = e.clientX;
    const startPos = playheadPosition;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!tracksContainerRef.current) return;
      
      const rect = tracksContainerRef.current.getBoundingClientRect();
      const scrollLeft = tracksContainerRef.current.parentElement?.scrollLeft || 0;
      const x = e.clientX - rect.left + scrollLeft;
      
      // Get the actual width of the tracks container
      const containerWidth = tracksContainerRef.current.scrollWidth;
      
      // Limit to container width minus 50px
      const maxPosition = containerWidth - 50;
      const newPosition = Math.max(0, Math.min(x, maxPosition));
      
      // Update position directly for immediate feedback
      setPlayheadPosition(newPosition);
      
      // Also update time if we have duration
      if (totalDuration > 0) {
        const newTime = Math.max(0, Math.min(calculateTimeFromPixels(newPosition, scale), totalDuration));
        
        // Only set time if it's a valid finite number
        if (isFinite(newTime) && !isNaN(newTime)) {
          setCurrentTimeSec(newTime);
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Time Ruler */}
      <div className="h-8 border-b border-gray-200 overflow-x-auto overflow-y-hidden" 
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           ref={rulerRef}>
        <TimeRuler
          duration={totalDuration}
          scale={scale}
          className="h-full"
        />
      </div>
      
      {/* Timeline Container */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden light-scrollbar" ref={scrollContainerRef}>
        {/* Track Labels */}
        <div className="sticky left-0 z-10 bg-white border-r border-gray-200 w-40 flex-shrink-0">
          <div className="space-y-0">
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
          className="flex-1 relative bg-gray-50 timeline-grid-light select-none"
          style={{ minWidth: `${calculateTimelineWidth(totalDuration, scale)}px`, zIndex: 20 }}
        >
          {/* Tracks */}
          <div 
            ref={tracksContainerRef}
            className="tracks-container"
            onClick={handleTimelineClick}
          >
            {/* Playhead */}
            <div
              className="timeline-playhead"
              style={{ 
                position: 'absolute',
                left: `${playheadPosition}px`,
                width: '2px',
                height: '100%',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              {/* Playhead Handle - Positioned at top of tracks */}
              <div
                className="timeline-playhead-handle"
                onMouseDown={handlePlayheadMouseDown}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Playhead clicked!');
                }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '28px',
                  background: '#ef4444',
                  borderRadius: '4px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                  pointerEvents: 'all',
                  zIndex: 1000,
                  transition: isDragging ? 'none' : 'all 0.1s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.transform = 'translateX(-50%)';
                }}
              >
                {/* Drag indicator lines */}
                <div style={{
                  width: '8px',
                  height: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around'
                }}>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.6)' }} />
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.6)' }} />
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.6)' }} />
                </div>
              </div>
              
              {/* Playhead Line */}
              <div 
                className="timeline-playhead-line"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '2px',
                  height: '100%',
                  background: '#ef4444',
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.6)'
                }}
              />
            </div>
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

export default TimelineContainer;