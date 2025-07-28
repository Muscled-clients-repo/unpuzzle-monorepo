"use client";

import React, { useRef, useState, useEffect } from "react";
import { useVideoTime } from "../../context/VideoTimeContext";

interface CourseVideoPlayerProps {
  video: {
    id: string;
    title: string;
    url: string;
    duration?: string;
  };
  onNext?: () => void;
  onPrevious?: () => void;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ video, onNext, onPrevious }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { setDurationSec, setCurrentTimeSec } = useVideoTime();

  // Update video time context
  useEffect(() => {
    if (duration > 0) {
      setDurationSec(duration);
    }
  }, [duration, setDurationSec]);

  useEffect(() => {
    setCurrentTimeSec(currentTime);
  }, [currentTime, setCurrentTimeSec]);

  // Load new video when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [video.url]);

  // Handle video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowLeft") {
        skipTime(-10);
      } else if (e.code === "ArrowRight") {
        skipTime(10);
      } else if (e.code === "KeyM") {
        toggleMute();
      } else if (e.code === "KeyF") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + seconds, duration)
      );
    }
  };

  // Seek to specific time
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const container = document.getElementById("video-player-container");
    if (!document.fullscreenElement && container) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Change playback speed
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div
      id="video-player-container"
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full cursor-pointer"
        onClick={togglePlayPause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play/Pause Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        } pointer-events-none`}
      >
        {!isPlaying && (
          <button
            onClick={togglePlayPause}
            className="pointer-events-auto bg-white bg-opacity-90 rounded-full p-6 hover:bg-opacity-100 transition-all transform hover:scale-110"
          >
            <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent transition-all duration-300 ${
          showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 py-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                (currentTime / duration) * 100
              }%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`,
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip backward/forward */}
            <button
              onClick={() => skipTime(-10)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button
              onClick={() => skipTime(10)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fff 0%, #fff ${
                    volume * 100
                  }%, #4B5563 ${volume * 100}%, #4B5563 100%)`,
                }}
              />
            </div>

            {/* Time display */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Previous/Next buttons */}
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="text-white hover:text-gray-300 transition-colors"
                title="Previous video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m0 0l4 4m-4-4l-4 4m14 0V8m0 0l-4 4m4-4l4 4" />
                </svg>
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="text-white hover:text-gray-300 transition-colors"
                title="Next video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8v8m0 0l-4-4m4 4l4-4M7 8v8m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            )}

            {/* Playback speed */}
            <div className="relative group/speed">
              <button className="text-white hover:text-gray-300 transition-colors text-sm font-medium">
                {playbackRate}x
              </button>
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg py-2 opacity-0 group-hover/speed:opacity-100 transition-opacity">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`block w-full px-4 py-1 text-sm text-left hover:bg-gray-700 ${
                      playbackRate === rate ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3B82F6;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3B82F6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default CourseVideoPlayer;