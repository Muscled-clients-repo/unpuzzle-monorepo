import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, Chapter, Video } from "@/app/types/course.types";

interface CourseState {
  // Current course being viewed in detail
  currentCourse: Course | null;
  
  // Selected chapter and video for navigation
  selectedChapter: Chapter | null;
  selectedVideo: Video | null;
  selectedChapterId: string | null;
  selectedVideoId: string | null;
  
  // UI state
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  currentCourse: null,
  selectedChapter: null,
  selectedVideo: null,
  selectedChapterId: null,
  selectedVideoId: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Set current course (typically from API response)
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
      state.error = null;
      
      // Auto-select first chapter with videos based on order_index
      if (action.payload?.chapters?.length) {
        // Sort chapters by order_index
        const sortedChapters = [...action.payload.chapters].sort(
          (a, b) => (a.order_index || 0) - (b.order_index || 0)
        );
        
        // Find first chapter that has videos
        const firstChapterWithVideos = sortedChapters.find(
          chapter => chapter.videos && chapter.videos.length > 0
        );
        
        if (firstChapterWithVideos) {
          state.selectedChapter = firstChapterWithVideos;
          state.selectedChapterId = firstChapterWithVideos.id;
          
          // Select first video from this chapter
          const firstVideo = firstChapterWithVideos.videos[0];
          state.selectedVideo = firstVideo;
          state.selectedVideoId = firstVideo.id;
        } else {
          // No chapters have videos, just select first chapter
          const firstChapter = sortedChapters[0];
          state.selectedChapter = firstChapter;
          state.selectedChapterId = firstChapter.id;
          state.selectedVideo = null;
          state.selectedVideoId = null;
        }
      }
    },

    // Set selected chapter (for navigation)
    setSelectedChapter: (state, action: PayloadAction<{ chapterId: string }>) => {
      const { chapterId } = action.payload;
      
      if (state.currentCourse?.chapters) {
        const chapter = state.currentCourse.chapters.find(ch => ch.id === chapterId);
        if (chapter) {
          state.selectedChapter = chapter;
          state.selectedChapterId = chapterId;
          
          // Auto-select first video in chapter
          if (chapter.videos?.length) {
            const firstVideo = chapter.videos[0];
            state.selectedVideo = firstVideo;
            state.selectedVideoId = firstVideo.id;
          } else {
            state.selectedVideo = null;
            state.selectedVideoId = null;
          }
        }
      }
    },

    // Set selected video (for navigation)
    setSelectedVideo: (state, action: PayloadAction<{ videoId: string }>) => {
      const { videoId } = action.payload;
      
      if (state.selectedChapter?.videos) {
        const video = state.selectedChapter.videos.find(v => v.id === videoId);
        if (video) {
          state.selectedVideo = video;
          state.selectedVideoId = videoId;
        }
      }
    },

    // Set chapter and video together (from URL params)
    setSelectedChapterAndVideo: (
      state, 
      action: PayloadAction<{ chapterId?: string; videoId?: string }>
    ) => {
      const { chapterId, videoId } = action.payload;
      
      if (!state.currentCourse?.chapters) return;
      
      // Find target chapter
      let targetChapter: Chapter | null = null;
      if (chapterId) {
        targetChapter = state.currentCourse.chapters.find(ch => ch.id === chapterId) || null;
      } else {
        // No chapterId specified - find first chapter with videos based on order_index
        const sortedChapters = [...state.currentCourse.chapters].sort(
          (a, b) => (a.order_index || 0) - (b.order_index || 0)
        );
        targetChapter = sortedChapters.find(ch => ch.videos && ch.videos.length > 0) || sortedChapters[0] || null;
      }
      
      if (targetChapter) {
        state.selectedChapter = targetChapter;
        state.selectedChapterId = targetChapter.id;
        
        // Find target video within chapter
        let targetVideo: Video | null = null;
        if (videoId && targetChapter.videos) {
          targetVideo = targetChapter.videos.find(v => v.id === videoId) || null;
        } else if (targetChapter.videos?.length) {
          targetVideo = targetChapter.videos[0];
        }
        
        if (targetVideo) {
          state.selectedVideo = targetVideo;
          state.selectedVideoId = targetVideo.id;
        } else {
          state.selectedVideo = null;
          state.selectedVideoId = null;
        }
      }
    },

    // Clear all course state
    clearCourseState: (state) => {
      state.currentCourse = null;
      state.selectedChapter = null;
      state.selectedVideo = null;
      state.selectedChapterId = null;
      state.selectedVideoId = null;
      state.error = null;
    },

    // Set loading state
    setCourseLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setCourseError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentCourse,
  setSelectedChapter,
  setSelectedVideo,
  setSelectedChapterAndVideo,
  clearCourseState,
  setCourseLoading,
  setCourseError,
} = courseSlice.actions;

// Selectors
export const selectCurrentCourse = (state: any) => state.course.currentCourse;
export const selectSelectedChapter = (state: any) => state.course.selectedChapter;
export const selectSelectedVideo = (state: any) => state.course.selectedVideo;
export const selectSelectedChapterId = (state: any) => state.course.selectedChapterId;
export const selectSelectedVideoId = (state: any) => state.course.selectedVideoId;
export const selectCourseLoading = (state: any) => state.course.loading;
export const selectCourseError = (state: any) => state.course.error;

// Utility selector for YouTube embed URL transformation
export const selectYouTubeEmbedUrl = (state: any) => (url: string): string => {
  try {
    const parsedUrl = new URL(url);

    // If already in embed format
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return url;
    }

    // Handle watch?v=VIDEO_ID format
    const videoId = parsedUrl.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtu.be short links
    if (parsedUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsedUrl.pathname}`;
    }

    return url; // Return original if format is unknown
  } catch (err) {
    console.error("Invalid URL", err);
    return url;
  }
};

export default courseSlice.reducer;