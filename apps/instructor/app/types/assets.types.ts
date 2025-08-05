export interface Asset {
    type: string;
    name: string;
    size: string | null;
    duration: string | null;
    src: string;
    icon: string;
  }
  
export  interface RootState {
    recording: {
      showControls: boolean;
      recordingStarted: boolean;
      countdown: boolean;
    };
    sidebar: {
      isVisible: boolean;
      persistent: boolean;
    };
  }