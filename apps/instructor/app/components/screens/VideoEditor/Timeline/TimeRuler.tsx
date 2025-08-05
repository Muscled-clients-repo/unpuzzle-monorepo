'use client'
import React from 'react';
import { calculateTimelineWidth, calculateTimelineDuration, calculatePixelPosition } from './timelineUtils';

interface TimeRulerProps {
  duration: number;
  scale: number;
  className?: string;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ duration, scale, className = '' }) => {
  // Validate and sanitize duration
  const validDuration = isFinite(duration) && !isNaN(duration) && duration >= 0 ? duration : 0;
  
  const formatTime = (timeInSeconds: number) => {
    // Validate the input
    if (!isFinite(timeInSeconds) || isNaN(timeInSeconds) || timeInSeconds < 0) {
      return '0:00';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate tick marks based on duration and scale
  const getTickMarks = () => {
    const ticks = [];
    
    // Calculate the actual timeline duration (matching the timeline width)
    const timelineDuration = calculateTimelineDuration(validDuration);
    
    // If no duration, just show 0:00
    if (timelineDuration <= 0) {
      return [0];
    }
    
    // Dynamic interval based on scale
    let interval = 1;
    if (scale < 0.5) interval = 10;
    else if (scale < 1) interval = 5;
    else if (scale < 2) interval = 2;
    
    // Ensure interval is valid
    if (interval <= 0) interval = 1;
    
    // Limit the number of ticks to prevent performance issues
    const maxTicks = 1000;
    const calculatedTicks = Math.ceil(timelineDuration / interval);
    
    if (calculatedTicks > maxTicks) {
      // Adjust interval to keep ticks under limit
      interval = Math.ceil(timelineDuration / maxTicks);
    }
    
    for (let i = 0; i <= timelineDuration && ticks.length < maxTicks; i += interval) {
      ticks.push(i);
    }
    
    return ticks;
  };

  const tickMarks = getTickMarks();
  const timelineWidth = calculateTimelineWidth(validDuration, scale);

  return (
    <div className={`bg-gray-100 border-b border-gray-200 ${className}`}>
      <div className="flex h-full">
        {/* Spacer to align with track labels */}
        <div className="w-40 flex-shrink-0 border-r border-gray-200 bg-white" />
        
        {/* Ruler */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className="relative h-full"
            style={{ width: `${timelineWidth}px` }}
          >
            {tickMarks.map((time) => {
              // Use the shared calculation function
              const position = calculatePixelPosition(time, scale);
              return (
                <div
                  key={time}
                  className="absolute top-0 h-full"
                  style={{ left: `${position}px` }}
                >
                  {/* Tick mark */}
                  <div className="w-px h-2 bg-gray-400"></div>
                  
                  {/* Time label */}
                  <span className="absolute top-2 left-0 transform -translate-x-1/2 text-xs text-gray-600 select-none">
                    {formatTime(time)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeRuler;