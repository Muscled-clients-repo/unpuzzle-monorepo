/**
 * Snapping utilities for timeline clip alignment
 */

export interface SnapPoint {
  time: number;
  type: 'clip-start' | 'clip-end' | 'playhead' | 'marker';
  clipId?: string;
}

export interface SnapResult {
  snapped: boolean;
  time: number;
  snapPoint?: SnapPoint;
}

const SNAP_THRESHOLD = 0.5; // seconds - how close clips need to be to snap
const SNAP_PIXEL_THRESHOLD = 10; // pixels - visual threshold for snapping

/**
 * Calculate snap points from clips and markers
 */
export function getSnapPoints(
  clips: Array<{ id?: string; start: number; end: number }>,
  currentTime: number,
  markers: number[] = [],
  excludeClipId?: string
): SnapPoint[] {
  const snapPoints: SnapPoint[] = [];

  // Add clip start and end points
  clips.forEach(clip => {
    if (clip.id !== excludeClipId) {
      snapPoints.push({
        time: clip.start,
        type: 'clip-start',
        clipId: clip.id
      });
      snapPoints.push({
        time: clip.end,
        type: 'clip-end',
        clipId: clip.id
      });
    }
  });

  // Add playhead position
  snapPoints.push({
    time: currentTime,
    type: 'playhead'
  });

  // Add markers
  markers.forEach(markerTime => {
    snapPoints.push({
      time: markerTime,
      type: 'marker'
    });
  });

  // Sort by time for efficient searching
  return snapPoints.sort((a, b) => a.time - b.time);
}

/**
 * Find the nearest snap point to a given time
 */
export function findNearestSnapPoint(
  time: number,
  snapPoints: SnapPoint[],
  threshold: number = SNAP_THRESHOLD
): SnapResult {
  let nearestPoint: SnapPoint | undefined;
  let minDistance = Infinity;

  for (const point of snapPoints) {
    const distance = Math.abs(point.time - time);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      nearestPoint = point;
    }
  }

  if (nearestPoint) {
    return {
      snapped: true,
      time: nearestPoint.time,
      snapPoint: nearestPoint
    };
  }

  return {
    snapped: false,
    time: time
  };
}

/**
 * Snap a clip's start and end times to nearby snap points
 */
export function snapClipTimes(
  clipStart: number,
  clipEnd: number,
  snapPoints: SnapPoint[],
  threshold: number = SNAP_THRESHOLD
): { start: number; end: number; startSnapped: boolean; endSnapped: boolean } {
  const startResult = findNearestSnapPoint(clipStart, snapPoints, threshold);
  const endResult = findNearestSnapPoint(clipEnd, snapPoints, threshold);

  return {
    start: startResult.time,
    end: endResult.time,
    startSnapped: startResult.snapped,
    endSnapped: endResult.snapped
  };
}

/**
 * Convert pixel position to time based on scale
 */
export function pixelsToTime(pixels: number, scale: number, pixelsPerSecond: number = 50): number {
  return pixels / (pixelsPerSecond * scale);
}

/**
 * Convert time to pixel position based on scale
 */
export function timeToPixels(time: number, scale: number, pixelsPerSecond: number = 50): number {
  return time * pixelsPerSecond * scale;
}

/**
 * Check if two times are within snapping distance in pixels
 */
export function isWithinSnapDistance(
  time1: number,
  time2: number,
  scale: number,
  pixelThreshold: number = SNAP_PIXEL_THRESHOLD
): boolean {
  const pixel1 = timeToPixels(time1, scale);
  const pixel2 = timeToPixels(time2, scale);
  return Math.abs(pixel1 - pixel2) <= pixelThreshold;
}

/**
 * Get alignment guides for rendering
 */
export interface AlignmentGuide {
  position: number; // pixel position
  type: 'clip-start' | 'clip-end' | 'playhead' | 'marker';
  isActive: boolean;
}

export function getAlignmentGuides(
  snapPoints: SnapPoint[],
  activeSnapPoint: SnapPoint | undefined,
  scale: number
): AlignmentGuide[] {
  return snapPoints.map(point => ({
    position: timeToPixels(point.time, scale),
    type: point.type,
    isActive: activeSnapPoint?.time === point.time
  }));
}

/**
 * Calculate magnetic snap behavior for dragging
 */
export function getMagneticSnapPosition(
  currentPosition: number,
  targetPosition: number,
  scale: number,
  magnetStrength: number = 0.7
): number {
  const distance = Math.abs(currentPosition - targetPosition);
  const maxDistance = SNAP_PIXEL_THRESHOLD;
  
  if (distance > maxDistance) {
    return currentPosition;
  }
  
  // Calculate magnetic pull strength based on distance
  const pullStrength = 1 - (distance / maxDistance);
  const magneticPull = pullStrength * magnetStrength;
  
  // Interpolate between current and target position
  return currentPosition + (targetPosition - currentPosition) * magneticPull;
}

/**
 * Find overlapping clips at a given time
 */
export function findOverlappingClips(
  clips: Array<{ id?: string; start: number; end: number }>,
  start: number,
  end: number,
  excludeId?: string
): Array<{ id?: string; start: number; end: number }> {
  return clips.filter(clip => {
    if (clip.id === excludeId) return false;
    
    // Check if clips overlap
    return !(end <= clip.start || start >= clip.end);
  });
}

/**
 * Adjust clip position to avoid overlaps
 */
export function adjustForOverlaps(
  clipStart: number,
  clipDuration: number,
  existingClips: Array<{ id?: string; start: number; end: number }>,
  excludeId?: string
): number {
  const clipEnd = clipStart + clipDuration;
  const overlaps = findOverlappingClips(existingClips, clipStart, clipEnd, excludeId);
  
  if (overlaps.length === 0) {
    return clipStart;
  }
  
  // Find the nearest gap that can fit the clip
  const sortedClips = [...existingClips]
    .filter(c => c.id !== excludeId)
    .sort((a, b) => a.start - b.start);
  
  // Try to place after the overlapping clip
  for (let i = 0; i < sortedClips.length; i++) {
    const gap = i < sortedClips.length - 1
      ? sortedClips[i + 1].start - sortedClips[i].end
      : Infinity;
    
    if (gap >= clipDuration) {
      return sortedClips[i].end;
    }
  }
  
  // If no gap found, place at the end
  return sortedClips[sortedClips.length - 1].end;
}