'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Clips } from '../../../../types/videoeditor.types';
import { calculatePixelPosition, PIXELS_PER_SECOND } from './timelineUtils';

interface VideoTrackProps {
  clips: Clips[];
  totalDuration: number;
  scale: number;
  onClipsChange: (clips: Clips[]) => void;
}

const VideoTrack: React.FC<VideoTrackProps> = ({
  clips,
  totalDuration,
  scale,
  onClipsChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<{ index: number; edge: 'start' | 'end' } | null>(null);
  const [selectedClipIndex, setSelectedClipIndex] = useState<number | null>(null);

  // Snap to grid settings
  const snapToGrid = true;
  const gridSize = 5; // pixels
  const snapThreshold = 10; // pixels

  const snapToNearestGrid = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const getClipWidth = (clip: Clips) => {
    const duration = clip.end - clip.start;
    return Math.max(duration * PIXELS_PER_SECOND * scale, 50); // Minimum 50px width
  };

  const getClipPosition = (clipIndex: number) => {
    let position = 0;
    for (let i = 0; i < clipIndex; i++) {
      const duration = clips[i].end - clips[i].start;
      position += duration * PIXELS_PER_SECOND * scale;
    }
    return position;
  };

  const handleClipDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleClipDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleClipDelete = (index: number) => {
    const newClips = clips.filter((_, i) => i !== index);
    onClipsChange(newClips);
  };

  const handleClipSplit = (index: number, splitTime: number) => {
    const clip = clips[index];
    const actualSplitTime = clip.start + splitTime;
    
    if (actualSplitTime <= clip.start || actualSplitTime >= clip.end) return;
    
    const firstPart: Clips = {
      ...clip,
      end: actualSplitTime,
    };
    
    const secondPart: Clips = {
      ...clip,
      start: actualSplitTime,
    };
    
    const newClips = [
      ...clips.slice(0, index),
      firstPart,
      secondPart,
      ...clips.slice(index + 1),
    ];
    
    onClipsChange(newClips);
  };

  const handleResizeStart = (index: number, edge: 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing({ index, edge });

    const startX = e.clientX;
    const originalClip = clips[index];

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaTime = deltaX / (100 * scale);

      const newClips = [...clips];
      if (edge === 'start') {
        newClips[index] = {
          ...originalClip,
          start: Math.max(0, originalClip.start + deltaTime),
        };
      } else {
        newClips[index] = {
          ...originalClip,
          end: Math.min(totalDuration, originalClip.end + deltaTime),
        };
      }
      onClipsChange(newClips);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-full p-2">
      {clips.map((clip, index) => (
        <div
          key={`video-${index}`}
          className={`track-clip group absolute h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-md cursor-move shadow-md transition-all duration-100 ${
            selectedClipIndex === index ? 'selected' : ''
          } ${draggedIndex === index ? 'drag-ghost' : ''} ${
            isResizing?.index === index ? 'cursor-ew-resize' : ''
          }`}
          style={{
            left: `${snapToNearestGrid(getClipPosition(index))}px`,
            width: `${getClipWidth(clip)}px`,
            top: '2px',
          }}
          draggable
          onDragStart={() => handleClipDragStart(index)}
          onDragEnd={handleClipDragEnd}
          onClick={() => setSelectedClipIndex(index)}
          onDoubleClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clipDuration = clip.end - clip.start;
            const splitTime = (clickX / rect.width) * clipDuration;
            handleClipSplit(index, splitTime);
          }}
        >
          {/* Resize handles */}
          <div
            className="resize-handle left"
            onMouseDown={(e) => handleResizeStart(index, 'start', e)}
          />
          <div
            className="resize-handle right"
            onMouseDown={(e) => handleResizeStart(index, 'end', e)}
          />

          {/* Clip content */}
          <div className="relative h-full overflow-hidden rounded-md">
            {/* Thumbnail background */}
            <div className="absolute inset-0 bg-blue-600 opacity-10" />
            
            {/* Clip info */}
            <div className="relative h-full p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-semibold truncate pr-2">
                  Video {index + 1}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipDelete(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white hover:text-red-300 transition-all"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-white/90">
                <span>{Math.round(clip.end - clip.start)}s</span>
                <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Clip tooltip */}
          <div className="clip-tooltip">
            {Math.round(clip.start)}s - {Math.round(clip.end)}s
          </div>
        </div>
      ))}

      {/* Drop zone indicator when empty */}
      {clips.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-400 text-sm flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            <span>Drop video clips here</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTrack;