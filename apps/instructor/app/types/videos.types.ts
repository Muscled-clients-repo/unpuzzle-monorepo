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
    options: any; 
    label: any;
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
    recordedAudioUrl: any;     // Example property: the text annotation content
    time: string;
  }

  export interface VideoAnnotation {
    id: string;       // Example property: unique identifier
    recordedVideoUrl: any;     // Example property: the text annotation content
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
  



export interface AnnotationPreviewProps {
  handleRemovePrivew: () => void; // Function type
  time: number | undefined; // String type
  activeTab: string; // String type
  data: string | undefined; // String type
}