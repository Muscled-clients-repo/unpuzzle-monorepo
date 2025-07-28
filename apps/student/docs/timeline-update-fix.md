# Timeline Maximum Update Depth Fix

## Problem
The TimelineContainer component was experiencing a "Maximum update depth exceeded" React error due to a circular dependency in the useEffect hook that updates the playhead position.

## Root Cause
1. The `useEffect` hook (lines 56-110) included `playheadPosition` in its dependency array
2. Inside the effect, it called `setPlayheadPosition(newPosition)`
3. This created an infinite loop: Effect runs → updates playheadPosition → triggers effect → updates again → infinite loop

## Solution Applied

### 1. Removed Circular Dependency
- Removed `playheadPosition` from the useEffect dependency array
- This breaks the update cycle while maintaining functionality

### 2. Added Ref Tracking
- Added `lastPlayheadPositionRef` to track the last position without triggering re-renders
- Added `isDraggingRef` to prevent conflicts between dragging and automatic updates

### 3. Optimized Update Logic
```typescript
// Before: Direct comparison with state
if (Math.abs(newPosition - playheadPosition) > 0.1) {
  setPlayheadPosition(newPosition);
}

// After: Comparison with ref value
if (Math.abs(newPosition - lastPlayheadPositionRef.current) > 0.1) {
  setPlayheadPosition(newPosition);
  lastPlayheadPositionRef.current = newPosition;
}
```

### 4. Prevented Dragging Conflicts
```typescript
// Skip automatic updates while dragging
if (isDraggingRef.current) {
  animationFrameRef.current = requestAnimationFrame(updatePlayhead);
  return;
}
```

## Benefits
1. **No more infinite loops** - Circular dependency removed
2. **Smooth playhead movement** - requestAnimationFrame still works correctly
3. **Immediate feedback** - Mouse dragging updates work without conflicts
4. **Performance optimized** - Only updates when position actually changes

## Testing
To verify the fix:
1. Load a video in the timeline
2. Play the video - playhead should move smoothly
3. Drag the playhead - should respond immediately
4. Click on timeline - should seek correctly
5. No console errors about maximum update depth