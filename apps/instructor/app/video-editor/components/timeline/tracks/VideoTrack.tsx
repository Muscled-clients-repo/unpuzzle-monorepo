'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Clips } from '../../../../types/videoeditor.types';
import { updateVideoClip, reorderVideoClips, setSelectedClip } from '../../../../redux/features/videoEditor/videoEditorSlice';
import { calculatePixelPosition, calculateTimeFromPixels } from '../utils/timelineUtils';
import { 
  getSnapPoints, 
  findNearestSnapPoint, 
  snapClipTimes,
  isWithinSnapDistance,
  timeToPixels,
  SnapPoint
} from '../../../../utils/snappingUtils';
import ClipItem from '../clips/ClipItem';

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
  onClipsChange
}) => {
  const dispatch = useDispatch();
  const { 
    selectedClipId, 
    selectedTool,
    currentTime,
    snappingEnabled,
    showAlignmentGuides,
    snapThreshold,
    markers
  } = useSelector((state: RootState) => state.videoEditor);

  const [draggingClip, setDraggingClip] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeSnapPoints, setActiveSnapPoints] = useState<SnapPoint[]>([]);
  const [alignmentGuides, setAlignmentGuides] = useState<{ position: number; type: string }[]>([]);
  
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate snap points whenever relevant data changes
  useEffect(() => {
    if (draggingClip && snappingEnabled) {
      const snapPoints = getSnapPoints(clips, currentTime, markers, draggingClip);
      setActiveSnapPoints(snapPoints);
    } else {
      setActiveSnapPoints([]);
      setAlignmentGuides([]);
    }
  }, [clips, currentTime, markers, draggingClip, snappingEnabled]);

  const handleClipMouseDown = (e: React.MouseEvent, clip: Clips, index: number) => {
    if (selectedTool !== 'selection' || !clip.id) return;
    
    e.stopPropagation();
    setDraggingClip(clip.id);
    
    const clipRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - clipRect.left;
    setDragOffset(clickX);

    const startMouseX = e.clientX;
    const originalStart = clip.start;
    const originalEnd = clip.end;
    const clipDuration = originalEnd - originalStart;

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      
      const trackRect = trackRef.current.getBoundingClientRect();
      const relativeX = e.clientX - trackRect.left - dragOffset;
      const newStartTime = Math.max(0, calculateTimeFromPixels(relativeX, scale));
      
      let finalStartTime = newStartTime;
      let finalEndTime = newStartTime + clipDuration;
      
      // Apply snapping if enabled
      if (snappingEnabled && activeSnapPoints.length > 0) {
        const snapResult = snapClipTimes(
          newStartTime,
          newStartTime + clipDuration,
          activeSnapPoints,
          snapThreshold
        );
        
        if (snapResult.startSnapped || snapResult.endSnapped) {
          if (snapResult.startSnapped) {
            finalStartTime = snapResult.start;
            finalEndTime = finalStartTime + clipDuration;
          } else if (snapResult.endSnapped) {
            finalEndTime = snapResult.end;
            finalStartTime = finalEndTime - clipDuration;
          }
          
          // Update alignment guides
          if (showAlignmentGuides) {
            const guides: { position: number; type: string }[] = [];
            
            activeSnapPoints.forEach(point => {
              if (isWithinSnapDistance(finalStartTime, point.time, scale) ||
                  isWithinSnapDistance(finalEndTime, point.time, scale)) {
                guides.push({
                  position: timeToPixels(point.time, scale),
                  type: point.type
                });
              }
            });
            
            setAlignmentGuides(guides);
          }
        } else {
          setAlignmentGuides([]);
        }
      }
      
      // For dragging, we should reorder clips, not change their source timing
      // Calculate new position in the clip array based on drag position
      const draggedClipDuration = clip.end - clip.start;
      let newPosition = 0;
      let currentTimelinePos = 0;
      
      // Find where this clip should be inserted based on the drag position
      for (let i = 0; i < clips.length; i++) {
        if (clips[i].id === clip.id) continue; // Skip the dragged clip
        
        const clipDuration = clips[i].end - clips[i].start;
        const nextTimelinePos = currentTimelinePos + clipDuration;
        
        // If the drag position is before the midpoint of this clip, insert before it
        if (finalStartTime < currentTimelinePos + clipDuration / 2) {
          break;
        }
        
        newPosition++;
        currentTimelinePos = nextTimelinePos;
      }
      
      // Find current index of the dragged clip
      const currentIndex = clips.findIndex(c => c.id === clip.id);
      
      // Only reorder if position changed
      if (currentIndex !== -1 && currentIndex !== newPosition) {
        // Adjust position if moving right (since we're removing an item)
        const targetIndex = newPosition > currentIndex ? newPosition - 1 : newPosition;
        dispatch(reorderVideoClips({
          fromIndex: currentIndex,
          toIndex: targetIndex
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggingClip(null);
      setAlignmentGuides([]);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={trackRef} className="relative h-full">
      {/* Alignment Guides */}
      {showAlignmentGuides && alignmentGuides.map((guide, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${guide.position}px`,
            width: '2px',
            backgroundColor: guide.type === 'playhead' ? '#ef4444' : '#3b82f6',
            opacity: 0.8
          }}
        >
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs px-1 py-0.5 rounded"
            style={{
              backgroundColor: guide.type === 'playhead' ? '#ef4444' : '#3b82f6',
              color: 'white',
              fontSize: '10px'
            }}
          >
            {guide.type}
          </div>
        </div>
      ))}

      {/* Markers */}
      {markers.map((marker, index) => (
        <div
          key={`marker-${index}`}
          className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 opacity-50 pointer-events-none z-20"
          style={{ left: `${calculatePixelPosition(marker, scale)}px` }}
        />
      ))}

      {/* Video Clips */}
      {clips.map((clip, index) => (
        <div
          key={clip.id || index}
          onMouseDown={(e) => handleClipMouseDown(e, clip, index)}
          style={{ cursor: selectedTool === 'selection' ? 'move' : 'default' }}
        >
          <ClipItem
            clip={clip}
            index={index}
            totalDuration={totalDuration}
            scale={scale}
            isSelected={selectedClipId === clip.id}
            onSelect={() => dispatch(setSelectedClip({ id: clip.id || null, track: 'video' }))}
            selectedTool={selectedTool}
          />
        </div>
      ))}

      {/* Snap Indicators */}
      {snappingEnabled && draggingClip && activeSnapPoints.map((point, index) => (
        <div
          key={`snap-${index}`}
          className="absolute top-0 bottom-0 w-px bg-green-500 opacity-30 pointer-events-none"
          style={{ left: `${timeToPixels(point.time, scale)}px` }}
        />
      ))}
    </div>
  );
};

export default VideoTrack;