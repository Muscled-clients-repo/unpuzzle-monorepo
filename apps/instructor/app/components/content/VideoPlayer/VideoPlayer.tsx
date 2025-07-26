"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import getBlobDuration from "get-blob-duration";

import { useVideoTime } from "@/context/VideoTimeContext";
import { useGetAllPuzzlePiecesQuery } from "@/redux/services/puzzlePieces.services";
import { useGetAllQuizzesQuery } from "@/redux/services/quizzes.services";
// TODO: Create AudioContainer and QuizContainer components
const AudioContainer = ({ onSkip }: { onSkip: () => void }) => (
  <div className="p-2 bg-gray-100 rounded">
    <p>Audio Container</p>
    <button onClick={onSkip} className="text-blue-600">Skip</button>
  </div>
);

const QuizContainer = ({ quizzes, onComplete }: { quizzes: any[]; onComplete: () => void }) => (
  <div className="p-4 bg-white rounded">
    <p>Quiz Container - {quizzes.length} quizzes</p>
    <button onClick={onComplete} className="bg-blue-600 text-white px-4 py-2 rounded">Complete</button>
  </div>
);
import type {
  Quiz,
  CustomDropdownProps,
  TimelineItem,
} from "@/types/videoannotationsteacher.type";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface VideoPlayerProps {
  // Video source
  videoUrl?: string;
  youtubeId?: string;
  videoType?: 'local' | 'youtube' | 'stream';
  
  // Player configuration
  variant?: 'instructor' | 'student' | 'editor' | 'moderator';
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  
  // Features
  features?: {
    annotations?: boolean;
    quizzes?: boolean;
    timeline?: boolean;
    playbackSpeed?: boolean;
    fullscreen?: boolean;
    pictureInPicture?: boolean;
    chapters?: boolean;
  };
  
  // Timeline data
  timeline?: TimelineItem[];
  videos?: Array<{ title: string; duration: number }>;
  
  // Event handlers
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onSeek?: (time: number) => void;
  
  // Styling
  className?: string;
  width?: number | string;
  height?: number | string;
}

const DEFAULT_FEATURES = {
  annotations: false,
  quizzes: false,
  timeline: false,
  playbackSpeed: true,
  fullscreen: true,
  pictureInPicture: true,
  chapters: false,
};

const DEFAULT_VIDEOS = [
  { title: "Video 1", duration: 16 },
  { title: "Video 2", duration: 8 },
  { title: "Video 3", duration: 8 },
  { title: "Video 4", duration: 6 },
];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  youtubeId,
  videoType = 'local',
  variant = 'student',
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  features = DEFAULT_FEATURES,
  timeline = [],
  videos = DEFAULT_VIDEOS,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onSeek,
  className = '',
  width = "100%",
  height = "auto",
}) => {
  // Video refs and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timeline and annotations state
  const [activeAnnotations, setActiveAnnotations] = useState<TimelineItem[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  
  // API queries
  const { data: puzzlePieces } = useGetAllPuzzlePiecesQuery(undefined, {
    skip: !features.annotations,
  });
  const { data: quizzes } = useGetAllQuizzesQuery(undefined, {
    skip: !features.quizzes,
  });
  
  // Context
  const { setCurrentTimeSec: setContextTime } = useVideoTime();

  // Initialize player based on type
  useEffect(() => {
    if (videoType === 'youtube' && youtubeId) {
      initializeYouTubePlayer();
    } else if (videoType === 'local' && videoRef.current && videoUrl) {
      initializeLocalPlayer();
    }
  }, [videoType, youtubeId, videoUrl]);

  // Initialize YouTube player
  const initializeYouTubePlayer = useCallback(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        createYouTubePlayer();
      };
    } else {
      createYouTubePlayer();
    }
  }, [youtubeId]);

  const createYouTubePlayer = () => {
    if (!youtubeId) return;
    
    playerRef.current = new window.YT.Player('youtube-player', {
      height: typeof height === 'number' ? height : '315',
      width: typeof width === 'number' ? width : '560',
      videoId: youtubeId,
      playerVars: {
        controls: controls ? 1 : 0,
        autoplay: autoplay ? 1 : 0,
        mute: muted ? 1 : 0,
        loop: loop ? 1 : 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event: any) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event: any) => {
    const state = event.data;
    if (state === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      onPlay?.();
      startTimeTracking();
    } else if (state === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      onPause?.();
      stopTimeTracking();
    } else if (state === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      onEnded?.();
      stopTimeTracking();
    }
  };

  // Initialize local video player
  const initializeLocalPlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      setContextTime(time);
      onTimeUpdate?.(time);
      checkAnnotations(time);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, onTimeUpdate, onPlay, onPause, onEnded]);

  // Time tracking for YouTube player
  const startTimeTracking = () => {
    const trackTime = () => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        setContextTime(time);
        onTimeUpdate?.(time);
        checkAnnotations(time);
        requestAnimationFrame(trackTime);
      }
    };
    requestAnimationFrame(trackTime);
  };

  const stopTimeTracking = () => {
    // Time tracking stopped automatically when isPlaying becomes false
  };

  // Check for annotations at current time
  const checkAnnotations = useCallback((time: number) => {
    if (!features.annotations && !features.quizzes) return;
    
    const activeItems = timeline.filter(item => {
      const itemTime = item.timestamp || 0;
      return Math.abs(time - itemTime) < 0.5; // 0.5 second tolerance
    });
    
    setActiveAnnotations(activeItems);
    
    // Handle quiz display
    const quizItem = activeItems.find(item => item.type === 'quiz' && item.quiz);
    if (quizItem && quizItem.quiz && !showQuiz) {
      setCurrentQuiz(quizItem.quiz);
      setShowQuiz(true);
      pause(); // Pause video when quiz appears
    }
  }, [timeline, features.annotations, features.quizzes, showQuiz]);

  // Player control methods
  const play = () => {
    if (videoType === 'youtube' && playerRef.current) {
      playerRef.current.playVideo();
    } else if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const pause = () => {
    if (videoType === 'youtube' && playerRef.current) {
      playerRef.current.pauseVideo();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const seekTo = (time: number) => {
    if (videoType === 'youtube' && playerRef.current) {
      playerRef.current.seekTo(time);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    onSeek?.(time);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const element = videoType === 'youtube' 
        ? document.getElementById('youtube-player')
        : videoRef.current;
      element?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoType === 'youtube' && playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Format time helper
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`video-player-container ${className}`} style={{ width, height }}>
      {/* Video Element */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {videoType === 'youtube' ? (
          <div id="youtube-player" />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            className="w-full h-full"
            style={{ height: typeof height === 'string' ? height : `${height}px` }}
          />
        )}

        {/* Custom Controls Overlay */}
        {!controls && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-opacity"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-2 text-white text-sm">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="flex-1 bg-gray-600 h-1 rounded cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seekTo(duration * percent);
              }}
            >
              <div 
                className="bg-blue-500 h-full rounded transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
            
            {/* Player Controls */}
            <div className="flex items-center space-x-2">
              {features.playbackSpeed && (
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(Number(e.target.value))}
                  className="bg-transparent text-white text-xs"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              )}
              
              {features.fullscreen && (
                <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Annotations */}
      {features.annotations && activeAnnotations.length > 0 && (
        <div className="mt-4 space-y-2">
          {activeAnnotations.map((annotation, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h4 className="font-semibold text-blue-900">{annotation.title}</h4>
              {annotation.audio && (
                <AudioContainer
                  onSkip={() => {
                    // Handle skip functionality for audio annotation
                    console.log('Skipping audio annotation');
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal */}
      {features.quizzes && showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <QuizContainer
              quizzes={currentQuiz ? [currentQuiz] : []}
              onComplete={() => {
                setShowQuiz(false);
                setCurrentQuiz(null);
                play(); // Resume video after quiz completion
              }}
            />
          </div>
        </div>
      )}

      {/* Timeline Display */}
      {features.timeline && timeline.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Timeline</h3>
          <div className="space-y-2">
            {timeline.map((item, index) => (
              <button
                key={index}
                onClick={() => seekTo(item.timestamp || 0)}
                className="flex items-center space-x-3 w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                <span className="text-sm text-gray-500 font-mono">
                  {formatTime(item.timestamp || 0)}
                </span>
                <span className="flex-1">{item.title}</span>
                <span className="text-xs text-gray-400 capitalize">{item.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;