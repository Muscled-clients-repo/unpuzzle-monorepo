// Main Components
export { default as EditorContainer } from './EditorContainer';
export { default as EditorLayout } from './EditorLayout';
export { default as RecordingStatus } from './RecordingStatus';
export { default as SidebarTabs } from './SidebarTabs';

// Player Components
export { default as VideoPreview } from './player/VideoPreview';
export { default as PlaybackControls } from './player/PlaybackControls';
export * from './player';

// Timeline Components
export { default as TimelineCanvas } from './timeline/TimelineCanvas';
export { default as ClipItem } from './timeline/clips/ClipItem';
export { default as AlignmentControls } from './timeline/controls/AlignmentControls';
export { default as TimeRuler } from './timeline/controls/TimeRuler';
export { default as VideoTrack } from './timeline/tracks/VideoTrack';
export { default as AudioTrack } from './timeline/tracks/AudioTrack';
export { default as AIVoiceTrack } from './timeline/tracks/AIVoiceTrack';
export { default as MusicTrack } from './timeline/tracks/MusicTrack';

// Sidebar Components
export { default as MediaLibrary } from './sidebar/MediaLibrary';
export { default as ScriptLibrary } from './sidebar/ScriptLibrary';

// Tools Components
export { default as ToolPanel } from './tools/ToolPanel';
export { default as VoiceSelector } from './tools/aivoice/VoiceSelector';
export { default as AudioWaveform } from './tools/aivoice/AudioWaveform';
export { default as ScriptEditor } from './tools/aivoice/ScriptEditor';
export { default as TextEditor } from './tools/textoverlay/TextEditor';
export { default as TransitionSelector } from './tools/transitions/TransitionSelector';

// Recording Components
export { default as RecordingPanel } from './recording/RecordingPanel';

// Export Components
export { default as ExportDialog } from './export/ExportDialog';

// Utils
export * from './timeline/utils/timelineUtils';