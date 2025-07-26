import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  undo,
  redo,
  setIsPlaying,
  setCurrentTime,
  removeVideoClip,
  setSelectedTool,
  clearProject,
  splitVideoClip,
  addMarker,
  setSnappingEnabled
} from '../redux/features/videoEditor/videoEditorSlice';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();
  const {
    currentTime,
    duration,
    isPlaying,
    selectedClipId,
    selectedTool,
    videoClips,
    snappingEnabled
  } = useSelector((state: RootState) => state.videoEditor);

  const shortcuts: KeyboardShortcut[] = [
    // Playback controls
    {
      key: ' ',
      action: () => dispatch(setIsPlaying(!isPlaying)),
      description: 'Play/Pause'
    },
    {
      key: 'ArrowLeft',
      action: () => dispatch(setCurrentTime(Math.max(0, currentTime - 1))),
      description: 'Step backward 1 second'
    },
    {
      key: 'ArrowRight',
      action: () => dispatch(setCurrentTime(Math.min(duration, currentTime + 1))),
      description: 'Step forward 1 second'
    },
    {
      key: 'ArrowLeft',
      shift: true,
      action: () => dispatch(setCurrentTime(Math.max(0, currentTime - 5))),
      description: 'Step backward 5 seconds'
    },
    {
      key: 'ArrowRight',
      shift: true,
      action: () => dispatch(setCurrentTime(Math.min(duration, currentTime + 5))),
      description: 'Step forward 5 seconds'
    },
    {
      key: 'Home',
      action: () => dispatch(setCurrentTime(0)),
      description: 'Go to beginning'
    },
    {
      key: 'End',
      action: () => dispatch(setCurrentTime(duration)),
      description: 'Go to end'
    },

    // Edit controls
    {
      key: 'z',
      ctrl: true,
      action: () => dispatch(undo()),
      description: 'Undo'
    },
    {
      key: 'y',
      ctrl: true,
      action: () => dispatch(redo()),
      description: 'Redo'
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => dispatch(redo()),
      description: 'Redo (alternative)'
    },
    {
      key: 'Delete',
      action: () => {
        if (selectedClipId) {
          dispatch(removeVideoClip(selectedClipId));
        }
      },
      description: 'Delete selected clip'
    },
    {
      key: 'Backspace',
      action: () => {
        if (selectedClipId) {
          dispatch(removeVideoClip(selectedClipId));
        }
      },
      description: 'Delete selected clip (alternative)'
    },

    // Tool selection
    {
      key: 'v',
      action: () => dispatch(setSelectedTool('selection')),
      description: 'Selection tool'
    },
    {
      key: 'c',
      action: () => dispatch(setSelectedTool('razor')),
      description: 'Razor tool'
    },
    {
      key: 't',
      action: () => dispatch(setSelectedTool('text')),
      description: 'Text tool'
    },

    // Split at playhead
    {
      key: 's',
      action: () => {
        // Find clip at current time and split it
        const clipAtTime = videoClips.find(clip => 
          currentTime >= clip.start && currentTime <= clip.end
        );
        if (clipAtTime && clipAtTime.id) {
          const splitTime = currentTime - clipAtTime.start;
          dispatch(splitVideoClip({ clipId: clipAtTime.id, splitTime }));
        }
      },
      description: 'Split clip at playhead'
    },

    // Marker controls
    {
      key: 'm',
      action: () => dispatch(addMarker(currentTime)),
      description: 'Add marker at playhead'
    },

    // Snapping toggle
    {
      key: 's',
      alt: true,
      action: () => dispatch(setSnappingEnabled(!snappingEnabled)),
      description: 'Toggle snapping'
    },

    // Project controls
    {
      key: 's',
      ctrl: true,
      action: () => {
        // Save project (would trigger save action)
        console.log('Save project');
      },
      description: 'Save project'
    },
    {
      key: 'n',
      ctrl: true,
      action: () => {
        if (window.confirm('Create new project? All unsaved changes will be lost.')) {
          dispatch(clearProject());
        }
      },
      description: 'New project'
    },

    // Export
    {
      key: 'e',
      ctrl: true,
      shift: true,
      action: () => {
        // Open export modal
        console.log('Export project');
      },
      description: 'Export video'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key === shortcut.key || 
                      event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || (event.ctrlKey || event.metaKey);
      const shiftMatch = !shortcut.shift || event.shiftKey;
      const altMatch = !shortcut.alt || event.altKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
};

// Export shortcuts for documentation
export const getKeyboardShortcuts = (): KeyboardShortcut[] => [
  // Playback
  { key: 'Space', action: () => {}, description: 'Play/Pause' },
  { key: '←', action: () => {}, description: 'Step backward 1 second' },
  { key: '→', action: () => {}, description: 'Step forward 1 second' },
  { key: 'Shift + ←', action: () => {}, description: 'Step backward 5 seconds' },
  { key: 'Shift + →', action: () => {}, description: 'Step forward 5 seconds' },
  { key: 'Home', action: () => {}, description: 'Go to beginning' },
  { key: 'End', action: () => {}, description: 'Go to end' },
  
  // Edit
  { key: 'Ctrl/Cmd + Z', action: () => {}, description: 'Undo' },
  { key: 'Ctrl/Cmd + Y', action: () => {}, description: 'Redo' },
  { key: 'Delete', action: () => {}, description: 'Delete selected clip' },
  { key: 'S', action: () => {}, description: 'Split clip at playhead' },
  
  // Tools
  { key: 'V', action: () => {}, description: 'Selection tool' },
  { key: 'C', action: () => {}, description: 'Razor tool' },
  { key: 'T', action: () => {}, description: 'Text tool' },
  
  // Project
  { key: 'Ctrl/Cmd + S', action: () => {}, description: 'Save project' },
  { key: 'Ctrl/Cmd + N', action: () => {}, description: 'New project' },
  { key: 'Ctrl/Cmd + Shift + E', action: () => {}, description: 'Export video' },
];