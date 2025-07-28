import { useCallback, useEffect, useRef } from 'react';
import { useYoutubePlayerContext } from '../context/YoutubePlayerContext';

interface VideoData {
  yt_video_id: string;
  start_time: number;
  end_time: number;
  id: string;
}

interface UseYoutubePlayerReturn {
  // State
  player: any;
  videoId: string;
  startTime: number;
  endTime: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoaded: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  loading: boolean;
  error: string | null;
  
  // Methods
  initializePlayer: (elementId: string, videoData: VideoData) => Promise<void>;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  changeVideo: (videoId: string, options: { startTime?: number; endTime?: number }) => void;
  requestFullscreen: (callback?: (success: boolean) => void) => void;
  exitFullscreen: (callback?: (success: boolean) => void) => void;
  setPlaybackRate: (rate: number) => void;
  setCCEnabled: (enabled: boolean) => void;
  setCCLanguage: (langCode: string) => void;
  getFormattedTime: (time: number) => string;
  getCurrentTime: () => number | null;
  getDuration: () => number | null;
  getVolume: () => number;
  getPlaybackRate: () => number;
  checkIsMuted: () => boolean;
  getAvailableCCLanguages: () => any[];
  getCurrentCCLanguage: () => string | null;
  updateProgressBar: (percent: number) => void;
  resetPlayer: () => void;
  
  // Progress bar handlers
  handleProgressDragStart: (e: React.MouseEvent) => void;
  handleProgressDrag: (e: React.MouseEvent) => void;
  handleProgressDragEnd: (e: React.MouseEvent) => void;
}

export function useYoutubePlayer(): UseYoutubePlayerReturn {
  const context = useYoutubePlayerContext();
  const isDraggingRef = useRef<boolean>(false);

  // Progress bar drag handlers
  const handleProgressDragStart = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    
    const progressContainer = document.getElementById('progressContainer');
    if (!progressContainer) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    // Update visual position
    context.updateProgressBar(percent);
    context.seekTo(context.startTime + (context.endTime - context.startTime) * percent);
    isDraggingRef.current = true;
  }, [context]);

  const handleProgressDrag = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const progressContainer = document.getElementById('progressContainer');
    if (!progressContainer) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    // Update visual position
    context.updateProgressBar(percent);
    context.seekTo(context.startTime + (context.endTime - context.startTime) * percent);
  }, [context]);

  const handleProgressDragEnd = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = false;
  }, []);

  // Set up progress bar event listeners
  useEffect(() => {
    const progressContainer = document.getElementById('progressContainer');
    
    if (progressContainer && context.isLoaded) {
      const handleMouseDown = (e: MouseEvent) => {
        if (isDraggingRef.current) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

        context.updateProgressBar(percent);
        context.seekTo(context.startTime + (context.endTime - context.startTime) * percent);
        isDraggingRef.current = true;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        
        context.updateProgressBar(percent);
        context.seekTo(context.startTime + (context.endTime - context.startTime) * percent);
      };

      const handleMouseUp = (e: MouseEvent) => {
        isDraggingRef.current = false;
      };

      progressContainer.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        progressContainer.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [context.isLoaded, context.startTime, context.endTime, context.updateProgressBar, context.seekTo]);

  // Set up sound slider event listener
  useEffect(() => {
    const soundSlider = document.getElementById('soundSlider');
    const soundValue = document.getElementById('soundValue');
    
    if (soundSlider && soundValue && context.isLoaded) {
      const handleSoundChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const sound = parseFloat(target.value);
        context.setVolume(sound);
        soundValue.textContent = `${sound}%`;
      };

      soundSlider.addEventListener('input', handleSoundChange);

      return () => {
        soundSlider.removeEventListener('input', handleSoundChange);
      };
    }
  }, [context.isLoaded, context.setVolume]);

  return {
    ...context,
    handleProgressDragStart,
    handleProgressDrag,
    handleProgressDragEnd,
  };
} 