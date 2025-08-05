'use client'
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useVideoTime } from "../../../hooks/useVideoTime";
import VideoEditorTabs from "./VideoEditorTabs";
import VideoEditorTimeline from "./VideoEditorTimeline"
import TimelineContainer from "./Timeline/TimelineContainer"
import Tools from "./Tools"
import TimelineBar from "./TimelineBar";
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer";
import ExportModal from "./Export/ExportModal";
import {Clips} from "../../../types/videoeditor.types"
import './video-editor.css';

export class VideoProcessor {
  constructor() {}

  async getVideoDuration(videoUrl: string, videoRef: any): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const video = videoRef.current;
        if (!video) {
          reject(new Error('Video element not available'));
          return;
        }

        video.preload = "metadata";
        video.src = videoUrl;

        video.onloadedmetadata = () => {
          console.log('Video duration:', video.duration);
          resolve(video.duration);
          URL.revokeObjectURL(video.src);
        };

        video.onerror = () => {
          reject(new Error('Failed to load video'));
        };

        video.load();
      } catch (error) {
        console.error("Error loading video:", error);
        reject(error);
      }
    });
  }
}


export default function VideoEditorTools() {
  const [clips, setClips] = useState<Array<Clips>>([])
  const [totalDuration, setTotalDuration] = useState(0)
  const [scale, setScale]=useState<number>(1)
  const [minScale, setMinScale]=useState<number>(0.1)
  const [currentMedia, setCurrentMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [aiAudioClips, setAiAudioClips] = useState<any[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'selection' | 'razor' | 'text'>('selection')
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const { setDurationSec, currentTimeSec, setCurrentTimeSec } = useVideoTime();
  
  // Update total duration when clips change
  useEffect(() => {
    const videoDuration = clips.reduce((total, clip) => total + (clip.end - clip.start), 0);
    const audioDuration = aiAudioClips.reduce((total, clip) => total + (clip.end - clip.start), 0);
    const duration = Math.max(videoDuration, audioDuration);
    setTotalDuration(duration);
    setDurationSec(duration); // Update the context duration
    
    // Update scale if needed
    if (duration > 0) {
      const newScale = Math.min(Math.max(1, duration / 300), 10); // Scale between 1 and 10
      setScale(newScale);
      setMinScale(0.1);
    }
  }, [clips, aiAudioClips, setDurationSec]);

  // Load project on startup
  useEffect(() => {
    const savedProject = localStorage.getItem('unpuzzle-project');
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);
        if (projectData.clips && Array.isArray(projectData.clips)) {
          setClips(projectData.clips);
        }
        if (projectData.aiAudioClips && Array.isArray(projectData.aiAudioClips)) {
          setAiAudioClips(projectData.aiAudioClips);
        }
        console.log('Project loaded successfully');
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
  }, []);



  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Required to allow drop
  };

   // 1️⃣ Add a New Clip
   const addClip = (newClip: Clips) => {
    setClips((prevClips) => [...prevClips, newClip]);
  };

  // 2️⃣ Remove a Clip by Index
  const removeClipByIndex = (index: number) => {
    setClips((prevClips) => prevClips.filter((_, i) => i !== index));
  };

  // 3️⃣ Move a Clip to a New Position
  const moveClip = (oldIndex: number, newIndex: number) => {
    setClips((prevClips) => {
      if (newIndex < 0 || newIndex >= prevClips.length) {
        console.warn("Invalid new position");
        return prevClips;
      }

      const updatedClips = [...prevClips];
      const [movedClip] = updatedClips.splice(oldIndex, 1); // Remove from old position
      updatedClips.splice(newIndex, 0, movedClip); // Insert at new position

      return updatedClips;
    });
  };

  // Extract video duration from file or URL
  const getVideoDuration = async (videoUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true; // Mute to allow autoplay
      
      const timeoutId = setTimeout(() => {
        video.src = ''; // Clear source
        video.remove();
        reject(new Error('Video loading timeout'));
      }, 15000);
      
      const cleanup = () => {
        clearTimeout(timeoutId);
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.remove();
      };
      
      video.onloadedmetadata = async () => {
        let duration = video.duration;
        console.log('Initial video duration:', duration);
        
        // Handle Infinity duration (common with webm recordings)
        if (duration === Infinity || duration === 0) {
          console.log('Duration is invalid, attempting workarounds...');
          
          try {
            // Method 1: Try seeking to end
            video.currentTime = Number.MAX_SAFE_INTEGER;
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (video.duration !== Infinity && video.duration > 0) {
              duration = video.duration;
              console.log('Duration after seek:', duration);
              cleanup();
              resolve(duration);
              return;
            }
            
            // Method 2: Try playing the video briefly
            video.currentTime = 0;
            await video.play();
            await new Promise(resolve => setTimeout(resolve, 100));
            video.pause();
            
            if (video.duration !== Infinity && video.duration > 0) {
              duration = video.duration;
              console.log('Duration after play:', duration);
              cleanup();
              resolve(duration);
              return;
            }
            
            // Method 3: Use buffered range if available
            if (video.buffered.length > 0) {
              duration = video.buffered.end(video.buffered.length - 1);
              if (duration > 0 && isFinite(duration)) {
                console.log('Duration from buffered:', duration);
                cleanup();
                resolve(duration);
                return;
              }
            }
            
          } catch (error) {
            console.error('Workaround failed:', error);
          }
          
          cleanup();
          reject(new Error('Invalid video duration - all workarounds failed'));
          return;
        }
        
        // Validate duration
        if (!isFinite(duration) || isNaN(duration) || duration <= 0) {
          console.error('Invalid video duration:', duration);
          cleanup();
          reject(new Error('Invalid video duration'));
          return;
        }
        
        console.log('Valid duration found:', duration);
        cleanup();
        resolve(duration);
      };
      
      video.onerror = (e) => {
        console.error('Error loading video metadata:', e);
        cleanup();
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = videoUrl;
    });
  };

  // Handle drop event
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLoading(true)
  
    try {
      // First try to get JSON data (from drag between components)
      const jsonData = event.dataTransfer?.getData("application/json");
      
      if (jsonData) {
        // Handle internal drag and drop
        const parsedData = JSON.parse(jsonData);
        
        if (!parsedData.url) throw new Error("No video URL found in dropped data.");
        
        console.log("Dropped from internal:", parsedData);
        
        // Extract duration if not provided
        let duration = parsedData.duration;
        if (!duration || duration <= 0) {
          duration = await getVideoDuration(parsedData.url);
        }
        
        addClip({
          url: parsedData.url,
          start: 0,
          end: duration
        });
      } else {
        // Handle file drops from outside
        const files = Array.from(event.dataTransfer?.files || []);
        const videoFiles = files.filter(file => file.type.startsWith('video/'));
        
        if (videoFiles.length === 0) {
          throw new Error("No video files found in drop event.");
        }
        
        // Process each video file
        for (const file of videoFiles) {
          const videoUrl = URL.createObjectURL(file);
          const duration = await getVideoDuration(videoUrl);
          
          console.log("Dropped file:", file.name, "Duration:", duration);
          
          addClip({
            url: videoUrl,
            start: 0,
            end: duration
          });
        }
      }
  
    } catch (error) {
      console.error("Error processing drop:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCallback=(evant:any)=>{

  }

  // Video Player Event Handlers
  const handleVideoTimeUpdate = (time: number) => {
    // Convert video time back to timeline time
    if (clips.length > 0) {
      let timeAccumulator = 0;
      let activeClip = null;
      let clipStartTime = 0;
      
      // Find the current active clip
      for (const clip of clips) {
        const clipDuration = clip.end - clip.start;
        if (currentTimeSec >= timeAccumulator && currentTimeSec < timeAccumulator + clipDuration) {
          activeClip = clip;
          clipStartTime = timeAccumulator;
          break;
        }
        timeAccumulator += clipDuration;
      }
      
      if (activeClip) {
        // Calculate timeline time from video time
        const timelineTime = clipStartTime + (time - activeClip.start);
        
        // Only update if the difference is significant to avoid loops
        if (Math.abs(currentTimeSec - timelineTime) > 0.1) {
          setCurrentTimeSec(timelineTime);
        }
      }
    }
  };

  const handleVideoLoadedMetadata = (duration: number) => {
    console.log('Video loaded with duration:', duration);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Handle AI audio generation
  const handleAudioGenerated = (audioClip: any) => {
    setAiAudioClips(prev => [...prev, audioClip]);
  };

  // Handle recording completion
  const handleRecordingComplete = async (videoBlob: Blob, duration: number) => {
    const videoUrl = URL.createObjectURL(videoBlob);
    
    // Validate duration, extract if needed
    let finalDuration = duration;
    
    // First, trust the recording time if it's valid
    if (isFinite(duration) && !isNaN(duration) && duration > 0) {
      console.log('Using recording time as duration:', duration);
      finalDuration = duration;
    } else {
      console.warn('Invalid duration received:', duration, 'Attempting to extract from video...');
      try {
        finalDuration = await getVideoDuration(videoUrl);
        console.log('Successfully extracted duration:', finalDuration);
      } catch (error) {
        console.error('Failed to extract duration from recorded video:', error);
        
        // If we still don't have a valid duration, use estimation
        if (!isFinite(finalDuration) || isNaN(finalDuration) || finalDuration <= 0) {
          // Use a more reasonable fallback based on blob size
          // Rough estimate: 1MB = ~5 seconds for typical webm recording
          const estimatedDuration = Math.max(5, Math.min(300, videoBlob.size / (200 * 1024)));
          finalDuration = estimatedDuration;
          console.warn('Using estimated duration based on file size:', finalDuration);
        }
      }
    }
    
    // Final validation
    if (!isFinite(finalDuration) || isNaN(finalDuration) || finalDuration <= 0) {
      finalDuration = 10; // Last resort fallback
      console.error('All duration extraction methods failed, using default:', finalDuration);
    }
    
    const newClip: Clips = {
      url: videoUrl,
      start: 0,
      end: finalDuration,
    };
    
    console.log('Adding new clip to timeline:', newClip);
    setClips(prev => [...prev, newClip]);
  };

  // Handle export completion
  const handleExportComplete = (exportedVideoUrl: string) => {
    console.log('Video exported successfully:', exportedVideoUrl);
    // You could add functionality here to download the video or show a success message
  };

  // Update video source and sync with timeline
  useEffect(() => {
    if (clips.length > 0) {
      // Find which clip should be playing based on current time
      let timeAccumulator = 0;
      let activeClip = clips[0];
      let clipStartTime = 0;
      
      for (const clip of clips) {
        const clipDuration = clip.end - clip.start;
        if (currentTimeSec >= timeAccumulator && currentTimeSec < timeAccumulator + clipDuration) {
          activeClip = clip;
          clipStartTime = timeAccumulator;
          break;
        }
        timeAccumulator += clipDuration;
      }
      
      // Update video source if it changed
      if (currentVideoSrc !== activeClip.url) {
        setCurrentVideoSrc(activeClip.url);
      }
      
      // Seek to correct position within the clip
      if (videoPlayerRef.current && currentVideoSrc === activeClip.url) {
        const positionInClip = currentTimeSec - clipStartTime + activeClip.start;
        const currentVideoTime = videoPlayerRef.current.getCurrentTime();
        
        // Only seek if the difference is significant (avoid constant seeking)
        if (Math.abs(currentVideoTime - positionInClip) > 0.1) {
          videoPlayerRef.current.seek(positionInClip);
        }
      }
    } else {
      setCurrentVideoSrc('');
    }
  }, [clips, currentTimeSec, currentVideoSrc]);

  // Format time helper with milliseconds
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  // Update duration
    useEffect(()=>{
      console.log(clips)
    }, [clips])


    return (
      <div className={`w-full h-screen bg-gray-50 text-gray-900 flex flex-col`} onDragOver={handleDragOver} onDrop={handleDrop}>
        <video ref={videoRef} preload="metadata" style={{ display: "none" }}>
          <source src="+" type="video/mp4" />
        </video>

        {/* Professional Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">Video Editor Pro</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Project:</span>
              <span className="text-gray-800 font-medium">Untitled</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Save Project Button */}
            <button 
              onClick={() => {
                // Save project to localStorage
                const projectData = {
                  clips,
                  aiAudioClips,
                  totalDuration,
                  timestamp: new Date().toISOString()
                };
                localStorage.setItem('unpuzzle-project', JSON.stringify(projectData));
                console.log('Project saved successfully');
                // You could show a toast notification here
              }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              <span>Save</span>
            </button>
            
            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              disabled={clips.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Main Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Source/Tools */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-hidden">
              <VideoEditorTabs 
                onAudioGenerated={handleAudioGenerated}
                onRecordingComplete={handleRecordingComplete}
              />
            </div>
          </div>

          {/* Center Panel - Preview */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <VideoPlayer
                  ref={videoPlayerRef}
                  src={currentVideoSrc}
                  className="w-full h-full"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Properties/Effects */}
          <div className="w-80 bg-white border-l border-gray-200">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Properties</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">Clip Info</p>
                  <p className="text-xs text-gray-500">Select a clip to view properties</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="h-80 bg-gray-50 border-t border-gray-200">
          {/* Timeline Toolbar */}
          <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button 
                onClick={() => setScale(Math.max(minScale, scale - 0.1))}
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
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
              />
              <button 
                onClick={() => setScale(Math.min(5, scale + 0.1))}
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
                    const newTime = Math.max(0, currentTimeSec - (1/30)); // Go back one frame (1/30 second)
                    videoPlayerRef.current.seek(newTime);
                    setCurrentTimeSec(newTime);
                  }
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600" 
                title="Previous Frame"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  if (videoPlayerRef.current) {
                    if (isPlaying) {
                      videoPlayerRef.current.pause();
                      setIsPlaying(false);
                    } else {
                      videoPlayerRef.current.play();
                      setIsPlaying(true);
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
              
              <button 
                onClick={() => {
                  if (videoPlayerRef.current) {
                    const newTime = Math.min(totalDuration, currentTimeSec + (1/30)); // Go forward one frame (1/30 second)
                    videoPlayerRef.current.seek(newTime);
                    setCurrentTimeSec(newTime);
                  }
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600" 
                title="Next Frame"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              {/* Editing Tools */}
              <button 
                onClick={() => setSelectedTool('selection')}
                className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'selection' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
                title="Selection Tool"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/>
                </svg>
              </button>
              <button 
                onClick={() => setSelectedTool('razor')}
                className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'razor' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
                title="Razor Tool (Split Clips)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
                </svg>
              </button>
              <button 
                onClick={() => setSelectedTool('text')}
                className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`} 
                title="Text Tool"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 4v3h5.5v12h3V7H19V4z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-mono text-gray-900">{formatTime(totalDuration)}</span>
            </div>
          </div>
          
          {/* Timeline Container */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <TimelineContainer
              videoClips={clips}
              aiAudioClips={aiAudioClips}
              scale={scale}
              selectedTool={selectedTool}
              onClipsChange={setClips}
              onAiAudioChange={setAiAudioClips}
            />
          </div>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          videoClips={clips}
          aiAudioClips={aiAudioClips}
          onExportComplete={handleExportComplete}
        />
      </div>
  );
}
