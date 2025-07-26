'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Clips } from '../../../../../types/videoeditor.types';
import { splitVideoClip, updateVideoClip, removeVideoClip } from '../../../../../redux/features/videoEditor/videoEditorSlice';
import { calculatePixelPosition, calculateTimeFromPixels } from '../utils/timelineUtils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';

interface ClipItemProps {
  clip: Clips;
  index: number;
  totalDuration: number;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  selectedTool: 'selection' | 'razor' | 'text' | 'transition';
}

const ClipItem: React.FC<ClipItemProps> = ({
  clip,
  index,
  totalDuration,
  scale,
  isSelected,
  onSelect,
  selectedTool
}) => {
  const dispatch = useDispatch();
  const clipRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'start' | 'end' | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [razorPosition, setRazorPosition] = useState<number | null>(null);

  // Get all clips to calculate timeline position
  const allClips = useSelector((state: RootState) => state.videoEditor.videoClips);
  
  // Calculate timeline position based on previous clips
  const getTimelinePosition = () => {
    let position = 0;
    // Find the actual index of this clip in the Redux store
    const actualIndex = allClips.findIndex(c => c.id === clip.id);
    if (actualIndex !== -1) {
      for (let i = 0; i < actualIndex; i++) {
        position += allClips[i].end - allClips[i].start;
      }
    }
    return position;
  };

  const clipDuration = clip.end - clip.start;
  const clipWidth = calculatePixelPosition(clipDuration, scale);
  const timelinePosition = getTimelinePosition();
  
  // Debug logging for timeline position
  React.useEffect(() => {
    console.log(`Clip ${clip.id?.substring(0, 8)} position:`, {
      timelinePosition,
      clipStart: clip.start,
      clipEnd: clip.end,
      clipDuration,
      index: allClips.findIndex(c => c.id === clip.id)
    });
  }, [timelinePosition, clip.start, clip.end, clipDuration, clip.id, allClips]);

  // Handle mouse move for razor tool
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'razor') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setRazorPosition(x);
    }
  };

  const handleMouseLeave = () => {
    setRazorPosition(null);
  };

  // Handle clip click based on selected tool
  const handleClipClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (selectedTool === 'razor' && clip.id) {
      // Split clip at click position
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const splitTime = (relativeX / clipWidth) * clipDuration;
      
      console.log('Razor tool clicked - Debug info:', {
        clipId: clip.id,
        clipStart: clip.start,
        clipEnd: clip.end,
        clipDuration,
        relativeX,
        clipWidth,
        splitTime,
        splitTimeIsValid: splitTime > 0.1 && splitTime < clipDuration - 0.1
      });
      
      // Ensure we have a valid split time
      if (splitTime > 0.1 && splitTime < clipDuration - 0.1 && clip.id) {
        console.log('Dispatching splitVideoClip action...');
        dispatch(splitVideoClip({ 
          clipId: clip.id, 
          splitTime: splitTime 
        }));
      } else {
        console.warn('Invalid split parameters:', {
          hasId: !!clip.id,
          splitTime,
          minTime: 0.1,
          maxTime: clipDuration - 0.1
        });
      }
    } else if (selectedTool === 'selection') {
      onSelect();
    }
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  // Handle trim start
  const handleTrimStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clip.id) return;
    
    setIsResizing('start');

    const startX = e.clientX;
    const originalStart = clip.start;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaTime = calculateTimeFromPixels(deltaX, scale);
      const newStart = Math.max(0, Math.min(clip.end - 0.1, originalStart + deltaTime));
      
      dispatch(updateVideoClip({
        id: clip.id!,
        updates: { start: newStart }
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle trim end
  const handleTrimEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clip.id) return;
    
    setIsResizing('end');

    const startX = e.clientX;
    const originalEnd = clip.end;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaTime = calculateTimeFromPixels(deltaX, scale);
      const newEnd = Math.max(clip.start + 0.1, originalEnd + deltaTime);
      
      dispatch(updateVideoClip({
        id: clip.id!,
        updates: { end: newEnd }
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Context menu actions
  const handleDelete = () => {
    if (clip.id) {
      dispatch(removeVideoClip(clip.id));
    }
    setShowContextMenu(false);
  };

  const handleDuplicate = () => {
    // This would need to be implemented in the Redux slice
    setShowContextMenu(false);
  };

  const handleProperties = () => {
    // Open properties panel
    setShowContextMenu(false);
  };

  return (
    <>
      <div
        ref={clipRef}
        className={`
          absolute h-16 rounded transition-all duration-100
          ${isSelected ? 'ring-2 ring-blue-500 z-20' : 'z-10'}
          ${selectedTool === 'razor' ? 'hover:opacity-90' : 'hover:brightness-110'}
          ${isResizing ? 'cursor-ew-resize' : ''}
        `}
        style={{
          width: `${clipWidth}px`,
          left: `${calculatePixelPosition(timelinePosition, scale)}px`,
          backgroundColor: clip.type === 'video' ? '#3B82F6' : '#10B981',
          cursor: selectedTool === 'razor' ? 'crosshair' : 'pointer'
        }}
        onClick={handleClipClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trim handles */}
        {isSelected && selectedTool === 'selection' && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-50 cursor-ew-resize hover:bg-opacity-80"
              onMouseDown={handleTrimStart}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-50 cursor-ew-resize hover:bg-opacity-80"
              onMouseDown={handleTrimEnd}
            />
          </>
        )}

        {/* Clip content */}
        <div className="p-2 overflow-hidden pointer-events-none">
          <p className="text-xs text-white truncate font-medium">
            {clip.type === 'video' ? '🎬 Video' : '🎵 Audio'} {clip.id ? `(${clip.id.substring(0, 8)})` : '(no id)'}
          </p>
          <p className="text-xs text-white opacity-75">
            {clipDuration.toFixed(2)}s
          </p>
        </div>

        {/* Razor indicator - Shows where the cut will happen */}
        {selectedTool === 'razor' && razorPosition !== null && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-30"
            style={{
              left: `${razorPosition}px`,
              width: '2px',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 4px rgba(239, 68, 68, 0.8)'
            }}
          >
            {/* Razor icon at top */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg py-2 z-50"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            onClick={handleDuplicate}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <span>Duplicate</span>
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            onClick={handleProperties}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
            <span>Properties</span>
          </button>
          <div className="border-t my-1" />
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center space-x-2"
            onClick={handleDelete}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default ClipItem;