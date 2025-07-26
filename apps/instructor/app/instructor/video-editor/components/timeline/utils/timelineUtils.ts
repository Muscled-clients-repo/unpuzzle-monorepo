// Timeline calculation utilities

export const PIXELS_PER_SECOND = 100;
export const MIN_TIMELINE_WIDTH = 1200;

export const calculateTimelineWidth = (duration: number, scale: number): number => {
  const calculatedWidth = duration * scale * PIXELS_PER_SECOND;
  return Math.max(MIN_TIMELINE_WIDTH, calculatedWidth);
};

export const calculateTimelineDuration = (duration: number): number => {
  // Minimum duration based on minimum width
  const minDuration = MIN_TIMELINE_WIDTH / PIXELS_PER_SECOND;
  return Math.max(minDuration, duration);
};

export const calculatePixelPosition = (time: number, scale: number): number => {
  return time * PIXELS_PER_SECOND * scale;
};

export const calculateTimeFromPixels = (pixels: number, scale: number): number => {
  return pixels / (PIXELS_PER_SECOND * scale);
};