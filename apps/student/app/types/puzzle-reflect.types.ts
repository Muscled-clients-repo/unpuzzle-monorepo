export interface PuzzleReflectData {
  completion?: PuzzleReflectItem[];
  error?: string;
  totalReflections?: number;
  completedReflections?: number;
  [key: string]: any;
}

export interface PuzzleReflectItem {
  id: number;
  type: 'reflection' | 'audio' | 'file' | 'loom-link';
  title: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
  feedback?: string;
  transcription?: string;
  insights?: string[];
  duration?: string;
  fileSize?: number;
  [key: string]: any;
}

export interface AudioReflectData {
  id: number;
  type: "audio";
  title: string;
  description: string;
  timestamp: number;
  status: "completed";
  fileSize: number;
  duration: string;
  transcription: string;
  insights: string[];
  score: number;
  feedback: string;
} 