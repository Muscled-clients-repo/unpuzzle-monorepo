import React, { useEffect } from 'react';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';

interface YoutubePlayerExampleProps {
  elementId: string;
  videoData: {
    yt_video_id: string;
    start_time: number;
    end_time: number;
    id: string;
  };
}

export const YoutubePlayerExample: React.FC<YoutubePlayerExampleProps> = ({ 
  elementId, 
  videoData 
}) => {
  const {
    // State
    player,
    videoId,
    startTime,
    endTime,
    currentTime,
    duration,
    isPlaying,
    isLoaded,
    isMuted,
    volume,
    playbackRate,
    loading,
    error,
    
    // Methods
    initializePlayer,
    play,
    pause,
    seekTo,
    setVolume,
    mute,
    unMute,
    changeVideo,
    requestFullscreen,
    exitFullscreen,
    setPlaybackRate,
    setCCEnabled,
    setCCLanguage,
    getFormattedTime,
    getCurrentTime,
    getDuration,
    getVolume,
    getPlaybackRate,
    checkIsMuted,
    getAvailableCCLanguages,
    getCurrentCCLanguage,
    updateProgressBar,
    resetPlayer,
    
    // Progress bar handlers
    handleProgressDragStart,
    handleProgressDrag,
    handleProgressDragEnd,
  } = useYoutubePlayer();

  // Initialize player when component mounts
  useEffect(() => {
    if (elementId && videoData) {
      initializePlayer(elementId, videoData);
    }
  }, [elementId, videoData, initializePlayer]);

  // Handle video events
  useEffect(() => {
    const handleVideoPlaying = () => {
      console.log('Video started playing');
    };

    const handleVideoPaused = (event: CustomEvent) => {
      console.log('Video paused at:', event.detail);
    };

    const handleVideoEnded = () => {
      console.log('Video ended');
    };

    document.addEventListener('video:playing', handleVideoPlaying);
    document.addEventListener('video:paused', handleVideoPaused as EventListener);
    document.addEventListener('video:ended', handleVideoEnded);

    return () => {
      document.removeEventListener('video:playing', handleVideoPlaying);
      document.removeEventListener('video:paused', handleVideoPaused as EventListener);
      document.removeEventListener('video:ended', handleVideoEnded);
    };
  }, []);

  if (loading) {
    return <div>Loading YouTube player...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="youtube-player-container">
      {/* Video Player Container */}
      <div id={elementId} className="video-player" />
      
      {/* Controls */}
      <div className="video-controls">
        <div className="control-buttons">
          <button onClick={play} disabled={!isLoaded}>
            Play
          </button>
          <button onClick={pause} disabled={!isLoaded}>
            Pause
          </button>
          <button onClick={mute} disabled={!isLoaded}>
            Mute
          </button>
          <button onClick={unMute} disabled={!isLoaded}>
            Unmute
          </button>
          <button onClick={() => requestFullscreen()}>
            Fullscreen
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div 
            id="progressContainer" 
            className="progress-bar-container"
            onMouseDown={handleProgressDragStart}
            onMouseMove={handleProgressDrag}
            onMouseUp={handleProgressDragEnd}
          >
            <div id="progressBar" className="progress-bar" />
            <div id="progressHandle" className="progress-handle" />
          </div>
        </div>

        {/* Time Display */}
        <div className="time-display">
          <span className="video-playback-time">
            {getFormattedTime(currentTime - startTime)}
          </span>
          <span> / </span>
          <span className="total-duration">
            {getFormattedTime(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <input
            id="soundSlider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <span id="soundValue">{volume}%</span>
        </div>

        {/* Playback Rate Control */}
        <div className="playback-rate-control">
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>

        {/* Status Display */}
        <div className="status-display">
          <p>Video ID: {videoId}</p>
          <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
          <p>Loaded: {isLoaded ? 'Yes' : 'No'}</p>
          <p>Muted: {isMuted ? 'Yes' : 'No'}</p>
          <p>Volume: {getVolume()}%</p>
          <p>Playback Rate: {getPlaybackRate()}x</p>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayerExample; 