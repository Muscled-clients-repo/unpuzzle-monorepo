/**
 * Video Editor Context Types
 * These types define the structure of data sent from the video editor to the server
 * for processing and exporting videos.
 */

/**
 * Main context object containing all video editor state
 */
export interface VideoEditorContext {
  project: ProjectInfo;
  timeline: TimelineInfo;
  tracks: TracksInfo;
  effects: EffectsInfo;
  export: ExportSettings;
}

/**
 * Project metadata
 */
export interface ProjectInfo {
  id?: string;
  name: string;
  createdAt: string; // ISO 8601
  lastModified: string; // ISO 8601
}

/**
 * Timeline state information
 */
export interface TimelineInfo {
  duration: number; // Total duration in seconds
  currentTime: number; // Playhead position in seconds
  scale: number; // Zoom level (1 = normal)
}

/**
 * All tracks containing clips
 */
export interface TracksInfo {
  video: VideoClip[];
  audio: AudioClip[];
  aiAudio: AudioClip[];
  music: AudioClip[];
}

/**
 * Video clip on timeline
 */
export interface VideoClip {
  id: string;
  url: string; // Cloud URL
  start: number; // Timeline position (seconds)
  end: number; // Timeline position (seconds)
  trimStart: number; // Trim within clip (seconds)
  trimEnd: number; // Trim within clip (seconds)
  type: 'video';
  metadata?: VideoMetadata;
}

/**
 * Audio clip on timeline
 */
export interface AudioClip {
  id: string;
  url: string; // Cloud URL
  start: number; // Timeline position (seconds)
  end: number; // Timeline position (seconds)
  trimStart: number; // Trim within clip (seconds)
  trimEnd: number; // Trim within clip (seconds)
  type: 'audio' | 'ai-audio' | 'music';
  volume?: number; // 0-100
  metadata?: AudioMetadata;
}

/**
 * Video file metadata
 */
export interface VideoMetadata {
  originalDuration: number;
  width?: number;
  height?: number;
  fps?: number;
  codec?: string;
  bitrate?: number;
}

/**
 * Audio file metadata
 */
export interface AudioMetadata {
  originalDuration: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  bitrate?: number;
}

/**
 * Effects applied to the timeline
 */
export interface EffectsInfo {
  transitions: Transition[];
  textOverlays: TextOverlay[];
}

/**
 * Transition between two clips
 */
export interface Transition {
  id: string;
  type: TransitionType;
  duration: number; // Seconds
  fromClipId: string;
  toClipId: string;
  startTime: number; // Timeline position
}

export type TransitionType = 'fade' | 'dissolve' | 'wipe' | 'slide';

/**
 * Text overlay on video
 */
export interface TextOverlay {
  id: string;
  text: string;
  startTime: number; // Seconds
  endTime: number; // Seconds
  position: Position;
  style: TextStyle;
  animation?: TextAnimation;
}

/**
 * Position as percentage of video dimensions
 */
export interface Position {
  x: number; // 0-100
  y: number; // 0-100
}

/**
 * Text styling options
 */
export interface TextStyle {
  fontSize: number; // Pixels
  fontFamily: string;
  color: string; // Hex color
  backgroundColor?: string; // Hex color
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

/**
 * Text animation options
 */
export interface TextAnimation {
  in?: AnimationType;
  out?: AnimationType;
  inDuration?: number; // Seconds
  outDuration?: number; // Seconds
}

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'rotate';

/**
 * Export configuration
 */
export interface ExportSettings {
  format: VideoFormat;
  quality: QualityPreset;
  resolution: Resolution;
  fps: FrameRate;
  bitrate?: string; // e.g., "5M"
  includeAudio: boolean;
  preset?: EncodingPreset;
  watermark?: Watermark;
}

export type VideoFormat = 'mp4' | 'webm' | 'mov';
export type QualityPreset = 'low' | 'medium' | 'high' | '4k';
export type FrameRate = 24 | 30 | 60;
export type EncodingPreset = 'fast' | 'medium' | 'slow';

/**
 * Video resolution
 */
export interface Resolution {
  width: number;
  height: number;
}

/**
 * Optional watermark settings
 */
export interface Watermark {
  type: 'text' | 'image';
  content: string; // Text or image URL
  position: Position;
  opacity: number; // 0-100
  scale?: number; // For image watermarks
}

/**
 * Export job status response
 */
export interface ExportJobStatus {
  jobId: string;
  state: JobState;
  progress: number; // 0-100
  error?: string;
  resultUrl?: string; // Available when completed
  createdAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
}

export type JobState = 'queued' | 'processing' | 'completed' | 'failed';

/**
 * Export request response
 */
export interface ExportResponse {
  jobId: string;
  estimatedTime: number; // Seconds
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}