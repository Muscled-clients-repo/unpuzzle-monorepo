# YouTube Player Context & Hook

This module provides a React context and hook for managing YouTube video players in Next.js applications. It converts the vanilla JavaScript YouTube Player API into a modern React architecture.

## Features

- **Full YouTube IFrame API Integration**: Complete support for YouTube's IFrame API
- **Progress Bar Control**: Draggable progress bar with seek functionality
- **Volume Control**: Volume slider with percentage display
- **Playback Rate Control**: Adjustable playback speed (0.25x to 2x)
- **Fullscreen Support**: Request and exit fullscreen modes
- **Closed Captions**: Enable/disable and language selection for captions
- **Local Storage Integration**: Automatic resume from last played position
- **Event System**: Custom events for playing, paused, and ended states
- **Error Handling**: Retry mechanism for failed player initialization

## Setup

### 1. Wrap your app with the provider

```tsx
// app/layout.tsx or your root component
import { YoutubePlayerProvider } from './context/YoutubePlayerContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <YoutubePlayerProvider>
      {children}
    </YoutubePlayerProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';

function VideoPlayer() {
  const {
    initializePlayer,
    play,
    pause,
    isPlaying,
    isLoaded,
    // ... other methods and state
  } = useYoutubePlayer();

  useEffect(() => {
    initializePlayer('video-container', {
      yt_video_id: 'dQw4w9WgXcQ',
      start_time: 0,
      end_time: 60,
      id: 'video-1'
    });
  }, []);

  return (
    <div>
      <div id="video-container" />
      <button onClick={play} disabled={!isLoaded}>
        Play
      </button>
      <button onClick={pause} disabled={!isLoaded}>
        Pause
      </button>
    </div>
  );
}
```

## API Reference

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `player` | `any` | YouTube player instance |
| `videoId` | `string` | Current video ID |
| `startTime` | `number` | Start time in seconds |
| `endTime` | `number` | End time in seconds |
| `currentTime` | `number` | Current playback time |
| `duration` | `number` | Total video duration |
| `isPlaying` | `boolean` | Whether video is playing |
| `isLoaded` | `boolean` | Whether player is loaded |
| `isMuted` | `boolean` | Whether video is muted |
| `volume` | `number` | Current volume (0-100) |
| `playbackRate` | `number` | Current playback rate |
| `loading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message if any |

### Methods

#### Player Control
- `initializePlayer(elementId: string, videoData: VideoData)`: Initialize the player
- `play()`: Start or resume playback
- `pause()`: Pause playback
- `seekTo(seconds: number)`: Seek to specific time
- `changeVideo(videoId: string, options)`: Change to different video

#### Volume Control
- `setVolume(volume: number)`: Set volume (0-100)
- `mute()`: Mute the video
- `unMute()`: Unmute the video
- `getVolume()`: Get current volume

#### Playback Rate
- `setPlaybackRate(rate: number)`: Set playback rate (0.25-2)
- `getPlaybackRate()`: Get current playback rate

#### Fullscreen
- `requestFullscreen(callback?)`: Enter fullscreen mode
- `exitFullscreen(callback?)`: Exit fullscreen mode

#### Closed Captions
- `setCCEnabled(enabled: boolean)`: Enable/disable captions
- `setCCLanguage(langCode: string)`: Set caption language
- `getAvailableCCLanguages()`: Get available languages
- `getCurrentCCLanguage()`: Get current language

#### Utility Methods
- `getFormattedTime(time: number)`: Format seconds to HH:MM:SS
- `getCurrentTime()`: Get current playback time
- `getDuration()`: Get total duration
- `checkIsMuted()`: Check if muted
- `updateProgressBar(percent: number)`: Update progress bar
- `resetPlayer()`: Reset player state

#### Progress Bar Handlers
- `handleProgressDragStart(e: React.MouseEvent)`: Start dragging
- `handleProgressDrag(e: React.MouseEvent)`: Handle dragging
- `handleProgressDragEnd(e: React.MouseEvent)`: End dragging

## Video Data Interface

```typescript
interface VideoData {
  yt_video_id: string;  // YouTube video ID
  start_time: number;    // Start time in seconds
  end_time: number;      // End time in seconds
  id: string;           // Unique identifier
}
```

## Events

The player dispatches custom events that you can listen to:

```tsx
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
  document.addEventListener('video:paused', handleVideoPaused);
  document.addEventListener('video:ended', handleVideoEnded);

  return () => {
    document.removeEventListener('video:playing', handleVideoPlaying);
    document.removeEventListener('video:paused', handleVideoPaused);
    document.removeEventListener('video:ended', handleVideoEnded);
  };
}, []);
```

## HTML Structure Requirements

The player expects certain HTML elements to be present for full functionality:

```html
<!-- Video container -->
<div id="your-video-container-id" />

<!-- Progress bar -->
<div id="progressContainer" class="progress-bar-container">
  <div id="progressBar" class="progress-bar" />
  <div id="progressHandle" class="progress-handle" />
</div>

<!-- Time display -->
<span class="video-playback-time">00:00</span>
<span class="total-duration">00:00</span>

<!-- Volume control -->
<input id="soundSlider" type="range" min="0" max="100" />
<span id="soundValue">100%</span>
```

## Example Usage

See `app/components/YoutubePlayerExample.tsx` for a complete example of how to use the YouTube Player context and hook.

## Notes

- The player automatically saves playback position to localStorage
- Progress bar dragging is handled automatically by the hook
- Volume slider updates are handled automatically
- The player retries initialization up to 3 times on failure
- All YouTube IFrame API features are supported 