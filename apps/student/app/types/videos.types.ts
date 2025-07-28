import { Asset } from './assets.types';
import { AiFile } from './videoeditor.types';

// export interface Video {
//     title: string;
//     duration: string;
//   }
export interface Video {
  id: string;
  title: string;
  duration: number;
  video_url: string;
  yt_video_id: string;
  video_source: string;
  chapter_id: string;
  start_time?: number;
  end_time?: number;
  created_at?: string;
  updated_at?: string;
  instructor?: {
    name?: string;
    avatar?: string;
    bio?: string;
  };
  assets?: Asset[];
  aiFiles?: AiFile[];
}
 export interface Module {
    title: string;
    videos: Video[];
  }

export interface AnnotationButton {
    id: string;
    iconGray: string;
    iconWhite: string;
}

export interface CustomDropdownProps {
    options: string[] | { value: string; label: string }[]; 
    label: string | React.ReactNode;
    handleSpeed: (option: string) => void; 
  }
  
  export interface TextAnnotation {
    id: string;       // Example property: unique identifier
    text: string;     // Example property: the text annotation content
    time: string;
  }

  // export interface CurrentAnnotation {
  //   id?: string;
  //   text?: string
  //   recordedAudioUrl?: string;
  //   recordedVideoUrl?: string;
  //   time?: string;
  // }

  export interface CurrentAnnotation {
    id: string;
    title: string;
    puzzleType: 'audioPuzzle' | 'videoPuzzle' | 'textPuzzle' | 'documentPuzzle'; // Assuming these are the possible types
    startAt: number;
    endAt: number;
    totalCredit: number;
    videoPuzzle: string |  undefined;
    audioPuzzle: string |  undefined; // Blob URL as string or null
    textPuzzle: string |  undefined;
    documentPuzzle: null;
    externalVideo: null;
    videoId: null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }

  export interface AudioAnnotation {
    id: string;       // Example property: unique identifier
    recordedAudioUrl: string;     // URL to the recorded audio file
    time: string;
  }

  export interface VideoAnnotation {
    id: string;       // Example property: unique identifier
    recordedVideoUrl: string;     // URL to the recorded video file
    time: string;
  }

  export interface QuizAnnotation {
  id: string; // Unique identifier for the quiz
  questions: {
    question: string; // The question text
    options: string[];   // The option text
  }[]; // Array of question objects
  time: string; // Time-related information (e.g., timestamp or duration)
}

export interface Quiz {
  id?: string;
  title: string;
  questions: {
    questionText: string;
    choices: string[];
    correctAnswer: number;
  }[];
  time?: string;
}

export interface TimelineItem {
  id: string;
  type: string;
  startTime: number;
  endTime?: number;
  title?: string;
  content?: string | Record<string, unknown>;
}

export interface AnnotationPreviewProps {
  handleRemovePrivew: () => void; // Function type
  time: number | undefined; // String type
  activeTab: string; // String type
  data: string | undefined; // String type
}