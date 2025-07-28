# Video Editor API Documentation

This document describes the video editor context structure that is sent to the server for video processing and export.

## Overview

The video editor sends a complete context object to the server containing all information needed to reconstruct and export the edited video. All video/audio assets are referenced by their cloud URLs.

## API Endpoints

### 1. Export Video
- **Endpoint**: `POST /api/video/export`
- **Request Body**: `VideoEditorContext` (see structure below)
- **Response**: 
  ```json
  {
    "jobId": "unique-job-identifier",
    "estimatedTime": 120  // estimated processing time in seconds
  }
  ```

### 2. Check Export Status
- **Endpoint**: `GET /api/video/export/{jobId}/status`
- **Response**:
  ```json
  {
    "state": "queued|processing|completed|failed",
    "progress": 45,  // percentage (0-100)
    "error": "error message if failed"
  }
  ```

### 3. Download Exported Video
- **Endpoint**: `GET /api/video/export/{jobId}/download`
- **Response**: Binary video file

## VideoEditorContext Structure

```typescript
interface VideoEditorContext {
  project: {
    id?: string;              // Optional project ID
    name: string;             // Project name
    createdAt: string;        // ISO 8601 timestamp
    lastModified: string;     // ISO 8601 timestamp
  };
  
  timeline: {
    duration: number;         // Total timeline duration in seconds
    currentTime: number;      // Current playhead position in seconds
    scale: number;           // Zoom level of timeline (1 = normal)
  };
  
  tracks: {
    video: VideoClip[];      // Video clips on timeline
    audio: AudioClip[];      // Audio clips
    aiAudio: AudioClip[];    // AI-generated audio clips
    music: AudioClip[];      // Background music clips
  };
  
  effects: {
    transitions: Transition[];   // Transitions between clips
    textOverlays: TextOverlay[]; // Text overlays
  };
  
  export: ExportSettings;    // Export configuration
}
```

## Data Types

### VideoClip
```typescript
interface VideoClip {
  id: string;                // Unique identifier
  url: string;               // Cloud URL of the video file
  start: number;             // Start position on timeline (seconds)
  end: number;               // End position on timeline (seconds)
  trimStart: number;         // Trim start within the clip (seconds)
  trimEnd: number;           // Trim end within the clip (seconds)
  type: 'video';
  metadata?: {
    originalDuration: number; // Original file duration
    width?: number;          // Video width in pixels
    height?: number;         // Video height in pixels
    fps?: number;            // Frames per second
  };
}
```

### AudioClip
```typescript
interface AudioClip {
  id: string;                // Unique identifier
  url: string;               // Cloud URL of the audio file
  start: number;             // Start position on timeline (seconds)
  end: number;               // End position on timeline (seconds)
  trimStart: number;         // Trim start within the clip (seconds)
  trimEnd: number;           // Trim end within the clip (seconds)
  type: 'audio' | 'ai-audio' | 'music';
  volume?: number;           // Volume level (0-100, default: 100)
  metadata?: {
    originalDuration: number; // Original file duration
    sampleRate?: number;     // Audio sample rate (Hz)
    channels?: number;       // Number of audio channels
  };
}
```

### Transition
```typescript
interface Transition {
  id: string;                // Unique identifier
  type: 'fade' | 'dissolve' | 'wipe' | 'slide';
  duration: number;          // Transition duration in seconds
  fromClipId: string;        // ID of the first clip
  toClipId: string;          // ID of the second clip
  startTime: number;         // When transition starts on timeline
}
```

### TextOverlay
```typescript
interface TextOverlay {
  id: string;                // Unique identifier
  text: string;              // Text content
  startTime: number;         // When text appears (seconds)
  endTime: number;           // When text disappears (seconds)
  position: {
    x: number;               // X position (0-100, percentage)
    y: number;               // Y position (0-100, percentage)
  };
  style: {
    fontSize: number;        // Font size in pixels
    fontFamily: string;      // Font family name
    color: string;           // Text color (hex, e.g., "#FFFFFF")
    backgroundColor?: string; // Background color (hex)
    bold?: boolean;          // Bold text
    italic?: boolean;        // Italic text
    align?: 'left' | 'center' | 'right';
  };
  animation?: {
    in?: 'fade' | 'slide' | 'zoom';   // Entry animation
    out?: 'fade' | 'slide' | 'zoom';  // Exit animation
  };
}
```

### ExportSettings
```typescript
interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | '4k';
  resolution: {
    width: number;           // Output width in pixels
    height: number;          // Output height in pixels
  };
  fps: 24 | 30 | 60;        // Frames per second
  bitrate?: string;          // Video bitrate (e.g., "5M")
  includeAudio: boolean;     // Include audio tracks
  preset?: 'fast' | 'medium' | 'slow'; // Encoding preset
}
```

## Quality Presets

| Quality | Resolution | Bitrate | Use Case |
|---------|------------|---------|----------|
| low     | 854x480    | 1 Mbps  | Web streaming, quick preview |
| medium  | 1280x720   | 2.5 Mbps| Social media, general use |
| high    | 1920x1080  | 5 Mbps  | High quality, professional |
| 4k      | 3840x2160  | 20 Mbps | Ultra HD, archival |

## Example Request

```json
{
  "project": {
    "name": "My Video Project",
    "createdAt": "2024-01-20T10:30:00Z",
    "lastModified": "2024-01-20T11:45:00Z"
  },
  "timeline": {
    "duration": 120.5,
    "currentTime": 45.2,
    "scale": 1.5
  },
  "tracks": {
    "video": [
      {
        "id": "video-1",
        "url": "https://storage.example.com/videos/clip1.mp4",
        "start": 0,
        "end": 30,
        "trimStart": 5,
        "trimEnd": 35,
        "type": "video",
        "metadata": {
          "originalDuration": 60,
          "width": 1920,
          "height": 1080,
          "fps": 30
        }
      },
      {
        "id": "video-2",
        "url": "https://storage.example.com/videos/clip2.mp4",
        "start": 30,
        "end": 60,
        "trimStart": 0,
        "trimEnd": 30,
        "type": "video"
      }
    ],
    "audio": [],
    "aiAudio": [
      {
        "id": "ai-audio-1",
        "url": "https://storage.example.com/audio/narration.mp3",
        "start": 10,
        "end": 50,
        "trimStart": 0,
        "trimEnd": 40,
        "type": "ai-audio",
        "volume": 80
      }
    ],
    "music": []
  },
  "effects": {
    "transitions": [
      {
        "id": "trans-1",
        "type": "fade",
        "duration": 1,
        "fromClipId": "video-1",
        "toClipId": "video-2",
        "startTime": 29
      }
    ],
    "textOverlays": [
      {
        "id": "text-1",
        "text": "Welcome to my video",
        "startTime": 5,
        "endTime": 10,
        "position": { "x": 50, "y": 80 },
        "style": {
          "fontSize": 48,
          "fontFamily": "Arial",
          "color": "#FFFFFF",
          "backgroundColor": "#000000",
          "bold": true,
          "align": "center"
        },
        "animation": {
          "in": "fade",
          "out": "fade"
        }
      }
    ]
  },
  "export": {
    "format": "mp4",
    "quality": "high",
    "resolution": {
      "width": 1920,
      "height": 1080
    },
    "fps": 30,
    "includeAudio": true,
    "preset": "medium"
  }
}
```

## Server Processing Flow

1. **Receive Context**: Server receives the VideoEditorContext
2. **Validate**: Validate all URLs are accessible and data is complete
3. **Queue Job**: Create export job and return jobId
4. **Process**:
   - Download video/audio files from cloud URLs
   - Apply trims to each clip
   - Arrange clips on timeline according to start/end times
   - Apply transitions between clips
   - Add text overlays with specified timing
   - Mix audio tracks (respecting volume levels)
   - Encode final video with specified settings
5. **Upload Result**: Store exported video and make available for download
6. **Cleanup**: Remove temporary files

## Error Handling

The server should handle these common scenarios:
- Invalid or inaccessible URLs
- Unsupported file formats
- Clips with gaps or overlaps
- Invalid trim points
- Export timeout
- Insufficient server resources

## Notes for Server Implementation

1. **URL Access**: Ensure server has permission to access all cloud URLs
2. **Caching**: Consider caching downloaded files for repeated exports
3. **Progress Updates**: Update job progress regularly for client polling
4. **Resource Limits**: Set maximum timeline duration and file size limits
5. **Cleanup**: Implement automatic cleanup of completed/failed jobs
6. **Security**: Validate all inputs and sanitize text overlays