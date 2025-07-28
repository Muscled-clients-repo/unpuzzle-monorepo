import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Clips } from '../../../types/videoeditor.types';

interface VideoEditorState {
  // Timeline
  videoClips: Clips[];
  audioClips: Clips[];
  aiAudioClips: Clips[];
  musicClips: Clips[];
  textOverlays: TextOverlay[];
  transitions: Transition[];
  
  // Playback
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  
  // UI State
  selectedClipId: string | null;
  selectedTrack: 'video' | 'audio' | 'ai' | 'music' | 'text' | null;
  selectedTool: 'selection' | 'razor' | 'text' | 'transition';
  timelineScale: number;
  timelineScrollPosition: number;
  
  // Snapping
  snappingEnabled: boolean;
  showAlignmentGuides: boolean;
  snapThreshold: number;
  markers: number[];
  
  // History (for undo/redo)
  history: HistoryEntry[];
  historyIndex: number;
  
  // Project
  projectName: string;
  projectId: string | null;
  lastSaved: string | null;
  isDirty: boolean;
  
  // Export
  exportSettings: ExportSettings;
  isExporting: boolean;
  exportProgress: number;
}

interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

interface Transition {
  id: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'slide';
  duration: number;
  fromClipId: string;
  toClipId: string;
  startTime: number;
}

interface HistoryEntry {
  action: string;
  state: Partial<VideoEditorState>;
  timestamp: number;
}

interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | '4k';
  fps: 24 | 30 | 60;
  includeAudio: boolean;
  resolution: { width: number; height: number };
}

const initialState: VideoEditorState = {
  // Timeline
  videoClips: [],
  audioClips: [],
  aiAudioClips: [],
  musicClips: [],
  textOverlays: [],
  transitions: [],
  
  // Playback
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  playbackRate: 1,
  
  // UI State
  selectedClipId: null,
  selectedTrack: null,
  selectedTool: 'selection',
  timelineScale: 1,
  timelineScrollPosition: 0,
  
  // Snapping
  snappingEnabled: true,
  showAlignmentGuides: true,
  snapThreshold: 0.5,
  markers: [],
  
  // History
  history: [],
  historyIndex: -1,
  
  // Project
  projectName: 'Untitled Project',
  projectId: null,
  lastSaved: null,
  isDirty: false,
  
  // Export
  exportSettings: {
    format: 'mp4',
    quality: 'high',
    fps: 30,
    includeAudio: true,
    resolution: { width: 1920, height: 1080 }
  },
  isExporting: false,
  exportProgress: 0,
};

const MAX_HISTORY_SIZE = 50;

const videoEditorSlice = createSlice({
  name: 'videoEditor',
  initialState,
  reducers: {
    // Timeline Actions
    addVideoClip: (state, action: PayloadAction<Clips>) => {
      state.videoClips.push({ ...action.payload, id: action.payload.id || Date.now().toString() });
      state.isDirty = true;
      // Update duration - always recalculate from all clips
      const videoDuration = state.videoClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      const audioDuration = state.aiAudioClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      state.duration = Math.max(videoDuration, audioDuration, state.duration);
    },
    
    removeVideoClip: (state, action: PayloadAction<string>) => {
      state.videoClips = state.videoClips.filter(clip => clip.id !== action.payload);
      state.isDirty = true;
      // Recalculate duration
      const videoDuration = state.videoClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      const audioDuration = state.aiAudioClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      state.duration = Math.max(videoDuration, audioDuration);
    },
    
    updateVideoClip: (state, action: PayloadAction<{ id: string; updates: Partial<Clips> }>) => {
      const clipIndex = state.videoClips.findIndex(clip => clip.id === action.payload.id);
      if (clipIndex !== -1) {
        state.videoClips[clipIndex] = { ...state.videoClips[clipIndex], ...action.payload.updates };
        state.isDirty = true;
      }
    },
    
    splitVideoClip: (state, action: PayloadAction<{ clipId: string; splitTime: number }>) => {
      
      const clipIndex = state.videoClips.findIndex(clip => clip.id === action.payload.clipId);

      if (clipIndex !== -1) {
        const clip = state.videoClips[clipIndex];
        const relativeTime = action.payload.splitTime;
        
        if (relativeTime > 0 && relativeTime < (clip.end - clip.start)) {
          const firstPart: Clips = {
            ...clip,
            end: clip.start + relativeTime
          };
          
          const secondPart: Clips = {
            ...clip,
            id: `${clip.id}-split-${Date.now()}`,
            start: clip.start + relativeTime
          };

          state.videoClips.splice(clipIndex, 1, firstPart, secondPart);
          state.isDirty = true;
        }
      }
    },
    
    reorderVideoClips: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedClip] = state.videoClips.splice(fromIndex, 1);
      state.videoClips.splice(toIndex, 0, movedClip);
      state.isDirty = true;
    },
    
    // AI Audio Actions
    addAiAudioClip: (state, action: PayloadAction<Clips>) => {
      state.aiAudioClips.push({ ...action.payload, id: action.payload.id || Date.now().toString() });
      state.isDirty = true;
      // Update duration
      const audioDuration = state.aiAudioClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      state.duration = Math.max(state.duration, audioDuration);
    },
    
    removeAiAudioClip: (state, action: PayloadAction<string>) => {
      state.aiAudioClips = state.aiAudioClips.filter(clip => clip.id !== action.payload);
      state.isDirty = true;
    },
    
    // Text Overlay Actions
    addTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
      state.textOverlays.push(action.payload);
      state.isDirty = true;
    },
    
    updateTextOverlay: (state, action: PayloadAction<{ id: string; updates: Partial<TextOverlay> }>) => {
      const overlayIndex = state.textOverlays.findIndex(overlay => overlay.id === action.payload.id);
      if (overlayIndex !== -1) {
        state.textOverlays[overlayIndex] = { ...state.textOverlays[overlayIndex], ...action.payload.updates };
        state.isDirty = true;
      }
    },
    
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.textOverlays = state.textOverlays.filter(overlay => overlay.id !== action.payload);
      state.isDirty = true;
    },
    
    // Transition Actions
    addTransition: (state, action: PayloadAction<Transition>) => {
      state.transitions.push(action.payload);
      state.isDirty = true;
    },
    
    removeTransition: (state, action: PayloadAction<string>) => {
      state.transitions = state.transitions.filter(transition => transition.id !== action.payload);
      state.isDirty = true;
    },
    
    // Playback Actions
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = Math.max(0, action.payload);
    },
    
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },
    
    // UI Actions
    setSelectedClip: (state, action: PayloadAction<{ id: string | null; track: VideoEditorState['selectedTrack'] }>) => {
      state.selectedClipId = action.payload.id;
      state.selectedTrack = action.payload.track;
    },
    
    setSelectedTool: (state, action: PayloadAction<VideoEditorState['selectedTool']>) => {
      state.selectedTool = action.payload;
    },
    
    setTimelineScale: (state, action: PayloadAction<number>) => {
      state.timelineScale = Math.max(0.1, Math.min(5, action.payload));
    },
    
    setTimelineScrollPosition: (state, action: PayloadAction<number>) => {
      state.timelineScrollPosition = action.payload;
    },
    
    // History Actions
    addToHistory: (state, action: PayloadAction<{ action: string; state: Partial<VideoEditorState> }>) => {
      // Remove any history after current index
      state.history = state.history.slice(0, state.historyIndex + 1);
      
      // Add new entry
      state.history.push({
        action: action.payload.action,
        state: action.payload.state,
        timestamp: Date.now()
      });
      
      // Limit history size
      if (state.history.length > MAX_HISTORY_SIZE) {
        state.history = state.history.slice(-MAX_HISTORY_SIZE);
      }
      
      state.historyIndex = state.history.length - 1;
    },
    
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const previousState = state.history[state.historyIndex].state;
        Object.assign(state, previousState);
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex].state;
        Object.assign(state, nextState);
      }
    },
    
    // Project Actions
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
      state.isDirty = true;
    },
    
    setProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    
    markAsSaved: (state) => {
      state.lastSaved = new Date().toISOString();
      state.isDirty = false;
    },
    
    loadProject: (state, action: PayloadAction<Partial<VideoEditorState>>) => {
      Object.assign(state, action.payload);
      state.isDirty = false;
    },
    
    // Export Actions
    setExportSettings: (state, action: PayloadAction<Partial<ExportSettings>>) => {
      state.exportSettings = { ...state.exportSettings, ...action.payload };
    },
    
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    
    setExportProgress: (state, action: PayloadAction<number>) => {
      state.exportProgress = action.payload;
    },
    
    // Snapping Actions
    setSnappingEnabled: (state, action: PayloadAction<boolean>) => {
      state.snappingEnabled = action.payload;
    },
    
    setShowAlignmentGuides: (state, action: PayloadAction<boolean>) => {
      state.showAlignmentGuides = action.payload;
    },
    
    setSnapThreshold: (state, action: PayloadAction<number>) => {
      state.snapThreshold = action.payload;
    },
    
    addMarker: (state, action: PayloadAction<number>) => {
      if (!state.markers.includes(action.payload)) {
        state.markers.push(action.payload);
        state.markers.sort((a, b) => a - b);
        state.isDirty = true;
      }
    },
    
    removeMarker: (state, action: PayloadAction<number>) => {
      state.markers = state.markers.filter(marker => marker !== action.payload);
      state.isDirty = true;
    },
    
    clearMarkers: (state) => {
      state.markers = [];
      state.isDirty = true;
    },
    
    // Batch Actions
    setClips: (state, action: PayloadAction<{ videoClips?: Clips[]; aiAudioClips?: Clips[] }>) => {
      if (action.payload.videoClips) {
        state.videoClips = action.payload.videoClips;
      }
      if (action.payload.aiAudioClips) {
        state.aiAudioClips = action.payload.aiAudioClips;
      }
      state.isDirty = true;
      
      // Recalculate duration
      const videoDuration = state.videoClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      const audioDuration = state.aiAudioClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
      state.duration = Math.max(videoDuration, audioDuration);
    },
    
    clearProject: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  // Timeline
  addVideoClip,
  removeVideoClip,
  updateVideoClip,
  splitVideoClip,
  reorderVideoClips,
  addAiAudioClip,
  removeAiAudioClip,
  
  // Text Overlays
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  
  // Transitions
  addTransition,
  removeTransition,
  
  // Playback
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setPlaybackRate,
  
  // UI
  setSelectedClip,
  setSelectedTool,
  setTimelineScale,
  setTimelineScrollPosition,
  
  // Snapping
  setSnappingEnabled,
  setShowAlignmentGuides,
  setSnapThreshold,
  addMarker,
  removeMarker,
  clearMarkers,
  
  // History
  addToHistory,
  undo,
  redo,
  
  // Project
  setProjectName,
  setProjectId,
  markAsSaved,
  loadProject,
  
  // Export
  setExportSettings,
  setIsExporting,
  setExportProgress,
  
  // Batch
  setClips,
  clearProject
} = videoEditorSlice.actions;

export default videoEditorSlice.reducer;