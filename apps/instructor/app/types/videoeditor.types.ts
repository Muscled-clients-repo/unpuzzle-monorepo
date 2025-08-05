export interface Voice {
    id: number;
    name: string;
    avatarFallback: string;
    audioSrc: string; // Path to audio file
    bgColor: string;  // Background color for UI
    textColor: string; // Text color for UI
    voiceId?: string; // ID for API calls (ElevenLabs/OpenAI)
    gender?: string; // Voice gender
    accent?: string; // Voice accent/region
  }

export type Script = string;

export type ProgressType = number;

export interface FileWithMetadata extends File {
    type: string;
    title: string;
    thumbnail: string;
    id: string;
    url: string
    duration: number
  }
  
export type VideoDurations = Record<string, number>;

export type AudioUrlProp = {audioUrl: string}

export interface CourseVideoPlayerProps {
    videoSrc: string | null;
  }

export interface CustomDropdownProps {
    options: number[],
    label: number, 
    handleSpeed: (val: number) => void;
  }

  export interface AiFile {
    id: string;
    type: 'audio' | 'video'; // Adjust if other types are possible
    file: File; // Replace `File` with the appropriate type if this is not a File object
    url: string;
    duration: number;
    cropStart?: number,
    cropEnd?: number,
    thumbnails: any[];
    audio?: {
      url?: any,
      duration: number; // Add other audio-specific properties if needed
    };
  }

// Clips type
export interface Clips{
  start: number,
  end: number,
  url: string,
  fileUrl?: string, // Keep for backward compatibility if needed
  id?: string,
  type?: 'video' | 'audio',
  thumbnails?: string[],
  file?: File
}