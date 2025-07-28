/**
 * Video utility functions for handling video files and metadata
 */

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps?: number;
}

/**
 * Extracts video duration using multiple fallback methods
 * Handles edge cases like WebM files with infinite duration
 */
export async function getVideoDuration(videoUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Video loading timeout'));
    }, 30000); // 30 second timeout
    
    const cleanup = () => {
      clearTimeout(timeoutId);
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    };
    
    video.onloadedmetadata = async () => {
      try {
        let duration = video.duration;
        
        // Handle Infinity duration (common with WebM recordings)
        if (!isFinite(duration) || duration === 0) {

          // Method 1: Seek to a large time
          video.currentTime = Number.MAX_SAFE_INTEGER;
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (isFinite(video.duration) && video.duration > 0) {
            duration = video.duration;
          } else {
            // Method 2: Play and pause
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              await playPromise;
              await new Promise(resolve => setTimeout(resolve, 100));
              video.pause();
            }
            
            if (isFinite(video.duration) && video.duration > 0) {
              duration = video.duration;
            } else if (video.buffered.length > 0) {
              // Method 3: Use buffered range
              duration = video.buffered.end(video.buffered.length - 1);
            }
          }
        }
        
        // Validate final duration
        if (!isFinite(duration) || isNaN(duration) || duration <= 0) {
          throw new Error('Unable to extract valid duration');
        }
        
        cleanup();
        resolve(duration);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };
    
    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video'));
    };
    
    video.src = videoUrl;
  });
}

/**
 * Extract video metadata including dimensions and frame rate
 */
export async function getVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
  const duration = await getVideoDuration(videoUrl);
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    
    video.onloadedmetadata = () => {
      const metadata: VideoMetadata = {
        duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      
      // Try to extract FPS (not always available)
      if ('getVideoPlaybackQuality' in video && video.getVideoPlaybackQuality) {
        const quality = video.getVideoPlaybackQuality();
        if (quality.totalVideoFrames && duration > 0) {
          metadata.fps = Math.round(quality.totalVideoFrames / duration);
        }
      }
      
      video.remove();
      resolve(metadata);
    };
    
    video.onerror = () => {
      video.remove();
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = videoUrl;
  });
}

/**
 * Generate video thumbnails at specified intervals
 */
export async function generateVideoThumbnails(
  videoUrl: string,
  count: number = 10,
  maxWidth: number = 160,
  maxHeight: number = 90
): Promise<string[]> {
  const metadata = await getVideoMetadata(videoUrl);
  const interval = metadata.duration / count;
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    // Calculate thumbnail dimensions maintaining aspect ratio
    const aspectRatio = metadata.width / metadata.height;
    let width = maxWidth;
    let height = maxWidth / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = maxHeight * aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const thumbnails: string[] = [];
    let currentIndex = 0;
    
    const captureFrame = () => {
      ctx.drawImage(video, 0, 0, width, height);
      thumbnails.push(canvas.toDataURL('image/jpeg', 0.7));
      
      currentIndex++;
      if (currentIndex < count) {
        video.currentTime = currentIndex * interval;
      } else {
        video.remove();
        canvas.remove();
        resolve(thumbnails);
      }
    };
    
    video.onseeked = captureFrame;
    
    video.onloadeddata = () => {
      video.currentTime = 0;
    };
    
    video.onerror = () => {
      video.remove();
      canvas.remove();
      reject(new Error('Failed to load video for thumbnails'));
    };
    
    video.src = videoUrl;
  });
}

/**
 * Convert video file to blob URL
 */
export function createVideoBlobUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Clean up blob URL to free memory
 */
export function revokeVideoBlobUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Check if a file is a supported video format
 */
export function isSupportedVideoFormat(file: File): boolean {
  const supportedFormats = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];
  
  return supportedFormats.includes(file.type);
}

/**
 * Get video file extension from MIME type
 */
export function getVideoFileExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv'
  };
  
  return mimeToExt[mimeType] || 'mp4';
}