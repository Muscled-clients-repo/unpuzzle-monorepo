export interface AddCourseChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChapter: any;
  
}
export interface AddCourseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideos: (videos: Video[]) => void;
}

// Define the video type
export interface Video {
  title: string;
  time: string;
}

export type AnnotationButton = {
  id: any;
  iconGray: string;
  iconWhite: string;
};

export type Quiz = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
} | null;

export interface CustomDropdownProps {
  options: any; 
  label: any;
  handleSpeed: (option: string) => void; 
}


export interface TimelineItem  {
  type: string ;
  title: string;
  timestamp: number;
  audio?: {
    title: string;
    duration: number;
  };
  quiz?: {
    title: string;
    questions: {
      index: number;
      questionText: string;
      choices: string[];
      correctAnswer: number;
    }[];
  };
};