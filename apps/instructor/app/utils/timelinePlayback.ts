/**
 * Timeline-aware playback utilities for handling split and deleted clips
 */

import { Clips } from '../types/videoeditor.types';

export interface PlaybackSegment {
  clip: Clips;
  timelineStart: number;  // When this clip starts on the timeline
  timelineEnd: number;    // When this clip ends on the timeline
  sourceStart: number;    // Start time in the source video
  sourceEnd: number;      // End time in the source video
}

/**
 * Build a map of timeline positions to source video positions
 */
export function buildPlaybackSegments(clips: Clips[]): PlaybackSegment[] {
  const segments: PlaybackSegment[] = [];
  let timelinePosition = 0;

  for (const clip of clips) {
    const clipDuration = clip.end - clip.start;
    segments.push({
      clip,
      timelineStart: timelinePosition,
      timelineEnd: timelinePosition + clipDuration,
      sourceStart: clip.start,
      sourceEnd: clip.end
    });
    timelinePosition += clipDuration;
  }

  return segments;
}

/**
 * Get the active segment at a specific timeline time
 */
export function getActiveSegmentAtTime(
  segments: PlaybackSegment[],
  timelineTime: number
): PlaybackSegment | null {
  return segments.find(
    segment => timelineTime >= segment.timelineStart && timelineTime < segment.timelineEnd
  ) || null;
}

/**
 * Convert timeline time to source video time
 */
export function timelineToSourceTime(
  segments: PlaybackSegment[],
  timelineTime: number
): { sourceTime: number; clipUrl: string } | null {
  const segment = getActiveSegmentAtTime(segments, timelineTime);
  
  if (!segment) return null;
  
  const offsetInSegment = timelineTime - segment.timelineStart;
  const sourceTime = segment.sourceStart + offsetInSegment;
  
  return {
    sourceTime,
    clipUrl: segment.clip.url
  };
}

/**
 * Get the next segment after current timeline time
 */
export function getNextSegment(
  segments: PlaybackSegment[],
  currentTimelineTime: number
): PlaybackSegment | null {
  const currentSegment = getActiveSegmentAtTime(segments, currentTimelineTime);
  if (!currentSegment) return null;
  
  const currentIndex = segments.indexOf(currentSegment);
  return segments[currentIndex + 1] || null;
}

/**
 * Check if we're at the end of a segment
 */
export function isAtSegmentEnd(
  segments: PlaybackSegment[],
  timelineTime: number,
  threshold: number = 0.1
): boolean {
  const segment = getActiveSegmentAtTime(segments, timelineTime);
  if (!segment) return false;
  
  return Math.abs(timelineTime - segment.timelineEnd) < threshold;
}

/**
 * Calculate total timeline duration from clips
 */
export function calculateTimelineDuration(clips: Clips[]): number {
  return clips.reduce((total, clip) => total + (clip.end - clip.start), 0);
}

/**
 * Group clips by source URL for efficient playback
 */
export function groupClipsBySource(clips: Clips[]): Map<string, Clips[]> {
  const grouped = new Map<string, Clips[]>();
  
  for (const clip of clips) {
    if (!grouped.has(clip.url)) {
      grouped.set(clip.url, []);
    }
    grouped.get(clip.url)!.push(clip);
  }
  
  return grouped;
}

/**
 * Calculate the timeline position for a clip based on its index
 * This accounts for all previous clips' durations
 */
export function getClipTimelinePosition(clips: Clips[], clipIndex: number): number {
  let position = 0;
  for (let i = 0; i < clipIndex && i < clips.length; i++) {
    position += clips[i].end - clips[i].start;
  }
  return position;
}