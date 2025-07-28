'use client'
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import SidebarTabs from "./SidebarTabs";
import TimelineCanvas from "./timeline/TimelineCanvas";
import VideoPreview, { VideoPlayerRef } from "./player";
import ExportDialog from "./export/ExportDialog";
import TextEditor from "./tools/textoverlay/TextEditor";
import TransitionSelector from "./tools/transitions/TransitionSelector";
import AlignmentControls from "./timeline/controls/AlignmentControls";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";
import { getVideoDuration } from "../../../utils/videoUtils";
import { useVideoTime } from "../../../context/VideoTimeContext";
import { 
  buildPlaybackSegments, 
  timelineToSourceTime, 
  getNextSegment,
  isAtSegmentEnd,
  calculateTimelineDuration 
} from "../../../utils/timelinePlayback";
import {
  addVideoClip,
  addAiAudioClip,
  setClips,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setTimelineScale,
  setSelectedTool,
  loadProject,
  markAsSaved
} from '../../../redux/features/videoEditor/videoEditorSlice';
import './styles/video-editor.css';
import './timeline/utils/timeline-snapping.css';

export default function EditorLayout() {
  const dispatch = useDispatch();
  const {
    videoClips,
    aiAudioClips,
    textOverlays,
    currentTime,
    duration,
    isPlaying,
    timelineScale,
    selectedTool,
    isDirty,
    projectName,
    exportSettings
  } = useSelector((state: RootState) => state.videoEditor);

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showTransitionPicker, setShowTransitionPicker] = useState(false);
  const [transitionPosition, setTransitionPosition] = useState({ x: 0, y: 0, fromClip: '', toClip: '' });
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  
  // Get duration from context
  const { durationSec } = useVideoTime();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  // Update duration when clips change
  useEffect(() => {
    const timelineDuration = calculateTimelineDuration(videoClips);
    dispatch(setDuration(timelineDuration));
    
    console.log('Duration values:', {
      reduxDuration: duration,
      contextDurationSec: durationSec,
      timelineDuration,
      videoClips: videoClips.map(c => ({ id: c.id, duration: c.end - c.start })),
    });
  }, [videoClips, dispatch]);

  // Auto-save to localStorage
  useEffect(() => {
    if (isDirty) {
      const projectData = {
        videoClips,
        aiAudioClips,
        textOverlays,
        projectName,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('unpuzzle-project', JSON.stringify(projectData));
      console.log('Project auto-saved');
    }
  }, [videoClips, aiAudioClips, textOverlays, projectName, isDirty]);

  // Load project on startup
  useEffect(() => {
    const savedProject = localStorage.getItem('unpuzzle-project');
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);
        
        // Warn about blob URLs that won't work after refresh
        const hasBlobUrls = projectData.videoClips?.some((clip: any) => 
          clip.url?.startsWith('blob:')
        );
        
        if (hasBlobUrls) {
          console.warn(
            '⚠️ Project contains blob URLs that are no longer valid after page refresh.',
            '\nTo persist videos across sessions, you need to:',
            '\n1. Upload videos to a server',
            '\n2. Use IndexedDB to store video data',
            '\n3. Or use the File System Access API',
            '\n\nClips will appear in timeline but videos won\'t play.'
          );
        }
        
        dispatch(loadProject(projectData));
        console.log('Project loaded successfully');
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
  }, [dispatch]);

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const jsonData = event.dataTransfer?.getData("application/json");
      
      if (jsonData) {
        const parsedData = JSON.parse(jsonData);
        
        if (!parsedData.url) throw new Error("No video URL found");
        
        let duration = parsedData.duration;
        if (!duration || duration <= 0) {
          duration = await getVideoDuration(parsedData.url);
        }
        
        dispatch(addVideoClip({
          id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: parsedData.url,
          start: 0,
          end: duration,
          type: 'video'
        }));
        
        // Ensure duration is updated
        dispatch(setDuration(duration));
      } else {
        const files = Array.from(event.dataTransfer?.files || []);
        const videoFiles = files.filter(file => file.type.startsWith('video/'));
        
        for (const file of videoFiles) {
          const videoUrl = URL.createObjectURL(file);
          const duration = await getVideoDuration(videoUrl);
          
          dispatch(addVideoClip({
            id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: videoUrl,
            start: 0,
            end: duration,
            type: 'video'
          }));
          
          // Ensure duration is updated
          dispatch(setDuration(duration));
        }
      }
    } catch (error) {
      console.error("Error processing drop:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle video time update - convert source time to timeline time
  const handleVideoTimeUpdate = (sourceTime: number) => {
    if (videoClips.length > 0 && playbackSegments.length > 0) {
      // Find which segment we're in based on the current video source and time
      const currentSegment = playbackSegments.find(segment => 
        segment.clip.url === currentVideoSrc && 
        sourceTime >= segment.sourceStart && 
        sourceTime <= segment.sourceEnd
      );
      
      if (currentSegment) {
        // Calculate timeline position
        const offsetInClip = sourceTime - currentSegment.sourceStart;
        const timelineTime = currentSegment.timelineStart + offsetInClip;
        
        // Update timeline time if significantly different
        if (Math.abs(currentTime - timelineTime) > 0.05) {
          dispatch(setCurrentTime(timelineTime));
        }
        
        // Check if we've reached the end of this clip
        if (Math.abs(sourceTime - currentSegment.sourceEnd) < 0.1) {
          // Find next segment
          const currentSegmentIndex = playbackSegments.indexOf(currentSegment);
          const nextSegment = playbackSegments[currentSegmentIndex + 1];
          
          if (nextSegment && isPlaying) {
            // Jump to next clip if playing
            if (nextSegment.clip.url !== currentVideoSrc) {
              setCurrentVideoSrc(nextSegment.clip.url);
            }
            setTimeout(() => {
              if (videoPlayerRef.current) {
                videoPlayerRef.current.seek(nextSegment.sourceStart);
              }
            }, 50);
          } else if (!nextSegment && isPlaying) {
            // End of timeline
            dispatch(setIsPlaying(false));
            if (videoPlayerRef.current) {
              videoPlayerRef.current.pause();
            }
          }
        }
      }
    }
  };

  // Handle video metadata loading
  const handleVideoLoadedMetadata = (videoDuration: number) => {
    console.log('Video loaded with duration:', videoDuration);
    
    // Update Redux duration with actual video duration
    dispatch(setDuration(videoDuration));
    
    // If we have clips, calculate total timeline duration
    if (videoClips.length > 0) {
      const timelineDuration = videoClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      // Use the maximum of video duration or timeline duration
      const effectiveDuration = Math.max(videoDuration, timelineDuration);
      dispatch(setDuration(effectiveDuration));
    }
  };

  // Handle AI audio generation
  const handleAudioGenerated = (audioClip: any) => {
    dispatch(addAiAudioClip(audioClip));
  };

  // Handle recording completion
  const handleRecordingComplete = async (videoBlob: Blob, duration: number) => {
    const videoUrl = URL.createObjectURL(videoBlob);
    let finalDuration = duration;
    
    console.log('Recording completed:', {
      timerDuration: duration,
      blobSize: videoBlob.size,
      blobType: videoBlob.type
    });
    
    // For WebM recordings, trust the timer duration over metadata
    if (isFinite(duration) && !isNaN(duration) && duration > 0) {
      console.log('Using timer duration:', duration);
      finalDuration = duration;
    } else {
      // Only fallback to metadata extraction if timer failed
      console.log('Timer duration invalid, extracting from video metadata...');
      try {
        finalDuration = await getVideoDuration(videoUrl);
        console.log('Extracted duration from metadata:', finalDuration);
      } catch (error) {
        console.error('Failed to extract duration:', error);
        finalDuration = 10; // Last resort fallback
      }
    }
    
    // Add the video clip first - this will update duration in Redux
    dispatch(addVideoClip({
      id: `recording-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: videoUrl,
      start: 0,
      end: finalDuration,
      type: 'video'
    }));
    
    // Ensure duration is also set explicitly
    dispatch(setDuration(finalDuration));
  };

  // Build playback segments for timeline-aware playback
  const playbackSegments = useMemo(() => {
    return buildPlaybackSegments(videoClips);
  }, [videoClips]);

  // Update video source and position based on timeline time
  useEffect(() => {
    if (videoClips.length > 0 && videoPlayerRef.current) {
      const timelinePosition = timelineToSourceTime(playbackSegments, currentTime);
      
      if (timelinePosition) {
        // Update video source if changed
        if (currentVideoSrc !== timelinePosition.clipUrl) {
          setCurrentVideoSrc(timelinePosition.clipUrl);
        }
        
        // Sync video position with timeline
        const currentVideoTime = videoPlayerRef.current.getCurrentTime();
        if (Math.abs(currentVideoTime - timelinePosition.sourceTime) > 0.1) {
          videoPlayerRef.current.seek(timelinePosition.sourceTime);
        }
        
        // Check if we're at the end of a segment and need to jump to next
        if (isPlaying && isAtSegmentEnd(playbackSegments, currentTime)) {
          const nextSegment = getNextSegment(playbackSegments, currentTime);
          if (nextSegment) {
            // Continue to next segment
            dispatch(setCurrentTime(nextSegment.timelineStart));
          } else {
            // No more segments, pause
            dispatch(setIsPlaying(false));
            videoPlayerRef.current.pause();
          }
        }
      }
    } else {
      setCurrentVideoSrc('');
    }
  }, [videoClips, currentTime, currentVideoSrc, playbackSegments, isPlaying, dispatch]);

  // Format time helper
  const formatTime = (seconds: number): string => {
    // Handle invalid values
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
      return '0:00.000';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-gray-50 text-gray-900 flex flex-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      <video ref={videoRef} preload="metadata" style={{ display: "none" }} />

      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Video Editor Pro</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Project:</span>
            <span className="text-gray-800 font-medium">{projectName}</span>
            {isDirty && <span className="text-xs text-orange-500">• Unsaved</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              dispatch(markAsSaved());
            }}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            <span>Save</span>
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            disabled={videoClips.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <SidebarTabs 
              onAudioGenerated={handleAudioGenerated}
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 bg-gray-100 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <VideoPreview
                ref={videoPlayerRef}
                src={currentVideoSrc}
                className="w-full h-full"
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onPlay={() => dispatch(setIsPlaying(true))}
                onPause={() => dispatch(setIsPlaying(false))}
              />
              
              {/* Text Overlays */}
              {textOverlays.map(overlay => {
                if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
                  return (
                    <div
                      key={overlay.id}
                      className="absolute"
                      style={{
                        left: `${overlay.position.x}%`,
                        top: `${overlay.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${overlay.style.fontSize}px`,
                        fontFamily: overlay.style.fontFamily,
                        color: overlay.style.color,
                        backgroundColor: overlay.style.backgroundColor || 'transparent',
                        padding: overlay.style.backgroundColor ? '8px 12px' : '0',
                        borderRadius: '4px',
                        fontWeight: overlay.style.bold ? 'bold' : 'normal',
                        fontStyle: overlay.style.italic ? 'italic' : 'normal'
                      }}
                    >
                      {overlay.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Properties</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">Quick Actions</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowTextEditor(true)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Add Text Overlay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="min-h-[320px] h-96 bg-gray-50 border-t border-gray-200 flex flex-col">
        {/* Snapping Controls */}
        <AlignmentControls />
        
        {/* Timeline Toolbar */}
        <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <button 
              onClick={() => dispatch(setTimelineScale(Math.max(0.1, timelineScale - 0.1)))}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600" 
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timelineScale}
              onChange={(e) => dispatch(setTimelineScale(parseFloat(e.target.value)))}
              className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
            />
            <button 
              onClick={() => dispatch(setTimelineScale(Math.min(5, timelineScale + 0.1)))}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600" 
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Video Controls */}
            <button 
              onClick={() => {
                if (videoPlayerRef.current) {
                  if (isPlaying) {
                    videoPlayerRef.current.pause();
                  } else {
                    videoPlayerRef.current.play();
                  }
                }
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600" 
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                </svg>
              )}
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Editing Tools */}
            <button 
              onClick={() => dispatch(setSelectedTool('selection'))}
              className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'selection' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
              title="Selection Tool (V)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/>
              </svg>
            </button>
            <button 
              onClick={() => dispatch(setSelectedTool('razor'))}
              className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'razor' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
              title="Razor Tool (C)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
              </svg>
            </button>
            <button 
              onClick={() => dispatch(setSelectedTool('text'))}
              className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
              title="Text Tool (T)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 4v3h5.5v12h3V7H19V4z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            {/* Current Time / Total Duration */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Time:</span>
              <span className="font-mono text-gray-900">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span className="font-mono text-gray-700">{formatTime(duration > 0 ? duration : durationSec)}</span>
            </div>
            
            {/* Duration Tracking Toggle */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPlaying}
                  onChange={() => {
                    if (videoPlayerRef.current) {
                      if (isPlaying) {
                        videoPlayerRef.current.pause();
                      } else {
                        videoPlayerRef.current.play();
                      }
                    }
                  }}
                  className="sr-only"
                />
                <div className={`relative w-10 h-5 rounded-full transition-colors ${isPlaying ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isPlaying ? 'translate-x-5' : ''}`} />
                </div>
                <span className="ml-2 text-gray-600">Track Duration</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Timeline Container */}
        <div className="flex-1 overflow-visible bg-gray-50">
          <TimelineCanvas
            videoClips={videoClips}
            aiAudioClips={aiAudioClips}
            scale={timelineScale}
            selectedTool={selectedTool}
            onClipsChange={(clips) => dispatch(setClips({ videoClips: clips }))}
            onAiAudioChange={(clips) => dispatch(setClips({ aiAudioClips: clips }))}
          />
        </div>
      </div>

      {/* Modals */}
      <ExportDialog
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        videoClips={videoClips}
        aiAudioClips={aiAudioClips}
        onExportComplete={(url) => console.log('Export complete:', url)}
      />

      {showTextEditor && (
        <TextEditor
          onClose={() => setShowTextEditor(false)}
        />
      )}

      {showTransitionPicker && (
        <TransitionSelector
          onClose={() => setShowTransitionPicker(false)}
          fromClipId={transitionPosition.fromClip}
          toClipId={transitionPosition.toClip}
          position={{ x: transitionPosition.x, y: transitionPosition.y }}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Processing video...</span>
          </div>
        </div>
      )}
    </div>
  );
}