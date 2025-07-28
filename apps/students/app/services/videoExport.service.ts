import { Clips } from '../types/videoeditor.types';

// Video Editor Context Types
export interface VideoEditorContext {
  project: {
    id?: string;
    name: string;
    createdAt: string;
    lastModified: string;
  };
  timeline: {
    duration: number; // Total timeline duration in seconds
    currentTime: number; // Current playhead position in seconds
    scale: number; // Zoom level of timeline
  };
  tracks: {
    video: VideoClip[];
    audio: AudioClip[];
    aiAudio: AudioClip[];
    music: AudioClip[];
  };
  effects: {
    transitions: Transition[];
    textOverlays: TextOverlay[];
  };
  export: ExportSettings;
}

export interface VideoClip {
  id: string;
  url: string; // Cloud URL of the video
  start: number; // Start time in the timeline (seconds)
  end: number; // End time in the timeline (seconds)
  trimStart: number; // Start trim point within the clip (seconds)
  trimEnd: number; // End trim point within the clip (seconds)
  type: 'video';
  metadata?: {
    originalDuration: number;
    width?: number;
    height?: number;
    fps?: number;
  };
}

export interface AudioClip {
  id: string;
  url: string; // Cloud URL of the audio
  start: number; // Start time in the timeline (seconds)
  end: number; // End time in the timeline (seconds)
  trimStart: number; // Start trim point within the clip (seconds)
  trimEnd: number; // End trim point within the clip (seconds)
  type: 'audio' | 'ai-audio' | 'music';
  volume?: number; // 0-100
  metadata?: {
    originalDuration: number;
    sampleRate?: number;
    channels?: number;
  };
}

export interface Transition {
  id: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'slide';
  duration: number; // Transition duration in seconds
  fromClipId: string;
  toClipId: string;
  startTime: number; // When the transition starts in timeline
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number; // When text appears (seconds)
  endTime: number; // When text disappears (seconds)
  position: {
    x: number; // Percentage (0-100)
    y: number; // Percentage (0-100)
  };
  style: {
    fontSize: number;
    fontFamily: string;
    color: string; // Hex color
    backgroundColor?: string; // Hex color
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
  };
  animation?: {
    in?: 'fade' | 'slide' | 'zoom';
    out?: 'fade' | 'slide' | 'zoom';
  };
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | '4k';
  resolution: {
    width: number;
    height: number;
  };
  fps: 24 | 30 | 60;
  bitrate?: string; // e.g., "5M"
  includeAudio: boolean;
  preset?: 'fast' | 'medium' | 'slow'; // Encoding speed vs quality
}

interface ExportOptions {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | '4k';
  fps: 24 | 30 | 60;
  includeAudio: boolean;
  resolution: { width: number; height: number };
  onProgress?: (progress: number) => void;
}

class VideoExportService {
  private apiUrl: string;

  constructor() {
    // Configure your server API URL
    this.apiUrl = process.env.NEXT_PUBLIC_CORE_SERVER_URL || 'https://dev.nazmulcodes.org';
  }

  async initialize() {
    // Server-based export doesn't need client-side initialization
    return true;
  }

  /**
   * Converts the current editor state into a context object for server processing
   */
  private createVideoEditorContext(
    videoClips: Clips[],
    audioClips: Clips[],
    textOverlays: any[],
    options: ExportOptions
  ): VideoEditorContext {
    const now = new Date().toISOString();
    
    // Calculate total timeline duration
    const videoDuration = videoClips.reduce((max, clip) => Math.max(max, clip.end), 0);
    const audioDuration = audioClips.reduce((max, clip) => Math.max(max, clip.end), 0);
    const totalDuration = Math.max(videoDuration, audioDuration);

    return {
      project: {
        name: 'Untitled Project',
        createdAt: now,
        lastModified: now
      },
      timeline: {
        duration: totalDuration,
        currentTime: 0,
        scale: 1
      },
      tracks: {
        video: videoClips.map(clip => ({
          id: clip.id || `video-${Date.now()}-${Math.random()}`,
          url: clip.url,
          start: clip.start,
          end: clip.end,
          trimStart: clip.start,
          trimEnd: clip.end,
          type: 'video' as const,
          metadata: {
            originalDuration: clip.end - clip.start
          }
        })),
        audio: [],
        aiAudio: audioClips.filter(clip => (clip as any).type === 'ai-audio').map(clip => ({
          id: clip.id || `audio-${Date.now()}-${Math.random()}`,
          url: clip.url,
          start: clip.start,
          end: clip.end,
          trimStart: clip.start,
          trimEnd: clip.end,
          type: 'ai-audio' as const,
          metadata: {
            originalDuration: clip.end - clip.start
          }
        })),
        music: []
      },
      effects: {
        transitions: [],
        textOverlays: textOverlays.map(overlay => ({
          id: overlay.id || `text-${Date.now()}-${Math.random()}`,
          text: overlay.text,
          startTime: overlay.startTime,
          endTime: overlay.endTime,
          position: overlay.position,
          style: overlay.style,
          animation: overlay.animation
        }))
      },
      export: {
        format: options.format,
        quality: options.quality,
        resolution: options.resolution,
        fps: options.fps,
        includeAudio: options.includeAudio,
        preset: 'medium'
      }
    };
  }

  /**
   * Export video by sending context to server
   */
  async exportVideo(
    videoClips: Clips[],
    audioClips: Clips[],
    textOverlays: any[],
    options: ExportOptions
  ): Promise<Blob> {
    try {
      // Create the video editor context
      const context = this.createVideoEditorContext(
        videoClips,
        audioClips,
        textOverlays,
        options
      );

      // Send export request to server
      const response = await fetch(`${this.apiUrl}/api/video/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Export failed: ${error || response.statusText}`);
      }

      // Get export job ID
      const { jobId, estimatedTime } = await response.json();

      // Poll for export completion
      return await this.pollExportStatus(jobId, options.onProgress);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  /**
   * Poll server for export job status
   */
  private async pollExportStatus(
    jobId: string, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const maxAttempts = 600; // 10 minutes with 1 second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.apiUrl}/api/video/export/${jobId}/status`);
        
        if (!response.ok) {
          throw new Error('Failed to check export status');
        }

        const status = await response.json();

        switch (status.state) {
          case 'completed':
            // Download the exported video
            const downloadResponse = await fetch(`${this.apiUrl}/api/video/export/${jobId}/download`);
            if (!downloadResponse.ok) {
              throw new Error('Failed to download exported video');
            }
            return await downloadResponse.blob();

          case 'failed':
            throw new Error(`Export failed: ${status.error || 'Unknown error'}`);

          case 'processing':
            if (onProgress) {
              onProgress(status.progress || 0);
            }
            break;

          case 'queued':
            if (onProgress) {
              onProgress(0);
            }
            break;
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Poll error:', error);
        throw error;
      }
    }

    throw new Error('Export timeout - job took too long');
  }

  /**
   * Get thumbnail for a video at specific time
   */
  async generateThumbnail(videoUrl: string, time: number = 0): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/api/video/thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl, time })
      });

      if (!response.ok) {
        throw new Error('Failed to generate thumbnail');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      // Return the video URL as fallback
      return videoUrl;
    }
  }

  /**
   * Extract audio from video
   */
  async extractAudio(videoUrl: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiUrl}/api/video/extract-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to extract audio');
      }

      return await response.blob();
    } catch (error) {
      console.error('Audio extraction error:', error);
      throw error;
    }
  }

  /**
   * Add transition between clips
   */
  async addTransition(
    clip1Url: string,
    clip2Url: string,
    transitionType: 'fade' | 'dissolve' | 'wipe',
    duration: number = 1
  ): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiUrl}/api/video/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clip1Url,
          clip2Url,
          transitionType,
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create transition');
      }

      return await response.blob();
    } catch (error) {
      console.error('Transition creation error:', error);
      throw error;
    }
  }

  async terminate() {
    // No cleanup needed for server-based export
    // Method kept for API consistency
  }
}

export const videoExportService = new VideoExportService();