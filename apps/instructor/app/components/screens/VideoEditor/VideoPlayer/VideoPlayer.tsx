'use client'
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import VideoControls from './VideoControls';
import { useVideoTime } from '../../../../hooks/useVideoTime';

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
}

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  src,
  poster,
  className = '',
  onTimeUpdate,
  onLoadedMetadata,
  onPlay,
  onPause,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    setCurrentTimeSec,
    setDurationSec,
    currentTimeSec,
  } = useVideoTime();

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    seek: (time: number) => {
      if (videoRef.current && isFinite(time) && !isNaN(time)) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
        setCurrentTimeSec(time);
      }
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0;
    },
    getDuration: () => {
      return videoRef.current?.duration || 0;
    },
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRateState(rate);
      }
    },
  }));

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      setCurrentTimeSec(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setDurationSec(dur);
      onLoadedMetadata?.(dur);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setCurrentTimeSec(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRateState(rate);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && videoRef.current?.parentElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sync with external timeline updates
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTimeSec) > 0.1) {
      videoRef.current.currentTime = currentTimeSec;
      setCurrentTime(currentTimeSec);
    }
  }, [currentTimeSec]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className} ${isFullscreen ? 'h-full w-full' : ''}`}>
      <video
        ref={videoRef}
        src={src || undefined}
        poster={poster || undefined}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true);
          onPlay?.();
        }}
        onPause={() => {
          setIsPlaying(false);
          onPause?.();
        }}
        preload="metadata"
      />
      
      {/* Video Controls Overlay */}
      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        isFullscreen={isFullscreen}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMute={handleMute}
        onPlaybackRateChange={handlePlaybackRateChange}
        onFullscreen={handleFullscreen}
      />
      
      {/* Loading/No Video State */}
      {!src && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p>Add video clips to preview</p>
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;