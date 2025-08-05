import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PuzzleAgent {
  id: string;
  video_id: string;
  user_id: string;
  timestamp: number;
  content: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface PuzzleHintData {
  message?: string;
  error?: string;
  [key: string]: any;
}

interface PuzzleReflectData {
  completion?: any[];
  error?: string;
  [key: string]: any;
}

interface PuzzleCheckData {
  completion?: any[];
  message?: string;
  error?: string;
  [key: string]: any;
}

interface VideoData {
  id: string;
  puzzlePaths?: any[];
  [key: string]: any;
}

interface PuzzleAgentState {
  hints: {
    data: PuzzleAgent[];
    currentData: PuzzleHintData | null;
    streamData: string;
    count: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
  };
  checks: {
    data: PuzzleAgent[];
    currentData: PuzzleCheckData | null;
    streamData: string;
    score: number;
    totalScore: number;
    index: number;
    count: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
  };
  reflects: {
    data: PuzzleAgent[];
    currentData: PuzzleReflectData | null;
    score: number;
    totalScore: number;
    count: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
  };
  paths: {
    data: PuzzleAgent[];
    currentData: VideoData | null;
    count: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
  };
  selectedVideoId: string | null;
}

const initialAgentState = {
  data: [],
  count: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

const initialState: PuzzleAgentState = {
  hints: { 
    ...initialAgentState,
    currentData: null,
    streamData: '',
  },
  checks: { 
    ...initialAgentState,
    currentData: null,
    streamData: '',
    score: 0,
    totalScore: 0,
    index: 0,
  },
  reflects: { 
    ...initialAgentState,
    currentData: null,
    score: 0,
    totalScore: 0,
  },
  paths: { 
    ...initialAgentState,
    currentData: null,
  },
  selectedVideoId: null,
};

const puzzleAgentsSlice = createSlice({
  name: 'puzzleAgents',
  initialState,
  reducers: {
    // Set selected video ID
    setSelectedVideoId: (state, action: PayloadAction<string>) => {
      state.selectedVideoId = action.payload;
    },
    
    // Clear all puzzle agent data
    clearAllPuzzleAgents: (state) => {
      state.hints = { 
        ...initialAgentState,
        currentData: null,
        streamData: '',
      };
      state.checks = { 
        ...initialAgentState,
        currentData: null,
        streamData: '',
        score: 0,
        totalScore: 0,
        index: 0,
      };
      state.reflects = { 
        ...initialAgentState,
        currentData: null,
        score: 0,
        totalScore: 0,
      };
      state.paths = { 
        ...initialAgentState,
        currentData: null,
      };
      state.selectedVideoId = null;
    },
    
    // Puzzle Hint actions
    setPuzzleHintsLoading: (state, action: PayloadAction<boolean>) => {
      state.hints.loading = action.payload;
    },
    setPuzzleHintsData: (state, action: PayloadAction<{ data: PuzzleAgent[]; count: number; totalPages: number; currentPage: number }>) => {
      state.hints.data = action.payload.data;
      state.hints.count = action.payload.count;
      state.hints.totalPages = action.payload.totalPages;
      state.hints.currentPage = action.payload.currentPage;
      state.hints.loading = false;
      state.hints.error = null;
    },
    setPuzzleHintsError: (state, action: PayloadAction<string>) => {
      state.hints.error = action.payload;
      state.hints.loading = false;
    },
    setCurrentHintData: (state, action: PayloadAction<PuzzleHintData | null>) => {
      state.hints.currentData = action.payload;
    },
    setHintStreamData: (state, action: PayloadAction<string>) => {
      state.hints.streamData = action.payload;
    },
    
    // Puzzle Check actions
    setPuzzleChecksLoading: (state, action: PayloadAction<boolean>) => {
      state.checks.loading = action.payload;
    },
    setPuzzleChecksData: (state, action: PayloadAction<{ data: PuzzleAgent[]; count: number; totalPages: number; currentPage: number }>) => {
      state.checks.data = action.payload.data;
      state.checks.count = action.payload.count;
      state.checks.totalPages = action.payload.totalPages;
      state.checks.currentPage = action.payload.currentPage;
      state.checks.loading = false;
      state.checks.error = null;
    },
    setPuzzleChecksError: (state, action: PayloadAction<string>) => {
      state.checks.error = action.payload;
      state.checks.loading = false;
    },
    setCurrentCheckData: (state, action: PayloadAction<PuzzleCheckData | null>) => {
      state.checks.currentData = action.payload;
    },
    setCheckStreamData: (state, action: PayloadAction<string>) => {
      state.checks.streamData = action.payload;
    },
    setCheckScore: (state, action: PayloadAction<{ score: number; totalScore: number; index: number }>) => {
      state.checks.score = action.payload.score;
      state.checks.totalScore = action.payload.totalScore;
      state.checks.index = action.payload.index;
    },
    
    // Puzzle Reflect actions
    setPuzzleReflectsLoading: (state, action: PayloadAction<boolean>) => {
      state.reflects.loading = action.payload;
    },
    setPuzzleReflectsData: (state, action: PayloadAction<{ data: PuzzleAgent[]; count: number; totalPages: number; currentPage: number }>) => {
      state.reflects.data = action.payload.data;
      state.reflects.count = action.payload.count;
      state.reflects.totalPages = action.payload.totalPages;
      state.reflects.currentPage = action.payload.currentPage;
      state.reflects.loading = false;
      state.reflects.error = null;
    },
    setPuzzleReflectsError: (state, action: PayloadAction<string>) => {
      state.reflects.error = action.payload;
      state.reflects.loading = false;
    },
    setCurrentReflectData: (state, action: PayloadAction<PuzzleReflectData | null>) => {
      state.reflects.currentData = action.payload;
    },
    setReflectScore: (state, action: PayloadAction<{ score: number; totalScore: number }>) => {
      state.reflects.score = action.payload.score;
      state.reflects.totalScore = action.payload.totalScore;
    },
    resetPuzzleReflect: (state) => {
      state.reflects.currentData = null;
      state.reflects.score = 0;
      state.reflects.totalScore = 0;
    },
    
    // Puzzle Path actions
    setPuzzlePathsLoading: (state, action: PayloadAction<boolean>) => {
      state.paths.loading = action.payload;
    },
    setPuzzlePathsData: (state, action: PayloadAction<{ data: PuzzleAgent[]; count: number; totalPages: number; currentPage: number }>) => {
      state.paths.data = action.payload.data;
      state.paths.count = action.payload.count;
      state.paths.totalPages = action.payload.totalPages;
      state.paths.currentPage = action.payload.currentPage;
      state.paths.loading = false;
      state.paths.error = null;
    },
    setPuzzlePathsError: (state, action: PayloadAction<string>) => {
      state.paths.error = action.payload;
      state.paths.loading = false;
    },
    setCurrentPathData: (state, action: PayloadAction<VideoData | null>) => {
      state.paths.currentData = action.payload;
    },
  },
});

export const {
  setSelectedVideoId,
  clearAllPuzzleAgents,
  setPuzzleHintsLoading,
  setPuzzleHintsData,
  setPuzzleHintsError,
  setCurrentHintData,
  setHintStreamData,
  setPuzzleChecksLoading,
  setPuzzleChecksData,
  setPuzzleChecksError,
  setCurrentCheckData,
  setCheckStreamData,
  setCheckScore,
  setPuzzleReflectsLoading,
  setPuzzleReflectsData,
  setPuzzleReflectsError,
  setCurrentReflectData,
  setReflectScore,
  resetPuzzleReflect,
  setPuzzlePathsLoading,
  setPuzzlePathsData,
  setPuzzlePathsError,
  setCurrentPathData,
} = puzzleAgentsSlice.actions;

export default puzzleAgentsSlice.reducer;