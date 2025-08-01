import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Chapter } from '@/app/types/course.types';

// Helper function to validate IDs
const isValidId = (id: any): id is string => {
  return id && typeof id === 'string' && id.trim() !== '';
};

export interface CourseFilters {
  category?: string;
  priceRange?: [number, number];
  level?: string;
  sortBy?: 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery?: string;
}

export interface CoursesState {
  // All courses
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: Course[];
  popularCourses: Course[];
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: CourseFilters;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  
  // Cache management
  lastFetch: number | null;
  cacheExpiry: number; // in milliseconds
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  popularCourses: [],
  loading: false,
  error: null,
  filters: {
    sortBy: 'popular',
  },
  currentPage: 1,
  totalPages: 1,
  totalCourses: 0,
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    // Fetch actions
    fetchCoursesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess(state, action: PayloadAction<{
      courses: Course[];
      totalPages?: number;
      totalCourses?: number;
    }>) {
      state.loading = false;
      state.courses = action.payload.courses;
      state.totalPages = action.payload.totalPages || 1;
      state.totalCourses = action.payload.totalCourses || action.payload.courses.length;
      state.lastFetch = Date.now();
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Single course actions
    setCourse(state, action: PayloadAction<Course>) {
      state.currentCourse = action.payload;
    },
    updateCourse(state, action: PayloadAction<Partial<Course>>) {
      const courseId = action.payload.id;
      if (!isValidId(courseId)) {
        console.error('updateCourse: Invalid course ID');
        return;
      }
      
      if (state.currentCourse && state.currentCourse.id === courseId) {
        state.currentCourse = { ...state.currentCourse, ...action.payload };
      }
      const index = state.courses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload };
      }
    },
    
    // Enrolled courses
    setEnrolledCourses(state, action: PayloadAction<Course[]>) {
      state.enrolledCourses = action.payload;
    },
    addEnrolledCourse(state, action: PayloadAction<Course>) {
      const exists = state.enrolledCourses.some(c => c.id === action.payload.id);
      if (!exists) {
        state.enrolledCourses.push(action.payload);
      }
      // Update the course in the main list
      const index = state.courses.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], enrolled: true };
      }
      if (state.currentCourse?.id === action.payload.id) {
        state.currentCourse = { ...state.currentCourse, enrolled: true };
      }
    },
    
    // Popular courses
    setPopularCourses(state, action: PayloadAction<Course[]>) {
      state.popularCourses = action.payload;
    },
    
    // Filters
    setFilters(state, action: PayloadAction<CourseFilters>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    
    // Pagination
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    
    // Cache management
    invalidateCache(state) {
      state.lastFetch = null;
    },
    
    // Clear state
    clearCoursesState(state) {
      return initialState;
    },
    
    // Chapter management
    addChapterToCourse(state, action: PayloadAction<{ courseId: string; chapter: Chapter }>) {
      const { courseId, chapter } = action.payload;
      if (!isValidId(courseId)) {
        console.error('addChapterToCourse: Invalid course ID');
        return;
      }
      
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        course.chapters.push(chapter);
      }
      if (state.currentCourse?.id === courseId) {
        state.currentCourse.chapters.push(chapter);
      }
    },
    updateChapterInCourse(state, action: PayloadAction<{ 
      courseId: string; 
      chapterId: string; 
      updates: Partial<Chapter> 
    }>) {
      const updateChapter = (course: Course) => {
        const chapterIndex = course.chapters.findIndex(ch => ch.id === action.payload.chapterId);
        if (chapterIndex !== -1) {
          course.chapters[chapterIndex] = {
            ...course.chapters[chapterIndex],
            ...action.payload.updates,
          };
        }
      };
      
      const course = state.courses.find(c => c.id === action.payload.courseId);
      if (course) updateChapter(course);
      if (state.currentCourse?.id === action.payload.courseId) {
        updateChapter(state.currentCourse);
      }
    },
    deleteChapterFromCourse(state, action: PayloadAction<{ 
      courseId: string; 
      chapterId: string;
    }>) {
      const deleteChapter = (course: Course) => {
        course.chapters = course.chapters.filter(ch => ch.id !== action.payload.chapterId);
      };
      
      const course = state.courses.find(c => c.id === action.payload.courseId);
      if (course) deleteChapter(course);
      if (state.currentCourse?.id === action.payload.courseId) {
        deleteChapter(state.currentCourse);
      }
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCourse,
  updateCourse,
  setEnrolledCourses,
  addEnrolledCourse,
  setPopularCourses,
  setFilters,
  resetFilters,
  setCurrentPage,
  invalidateCache,
  clearCoursesState,
  addChapterToCourse,
  updateChapterInCourse,
  deleteChapterFromCourse,
} = coursesSlice.actions;

export default coursesSlice.reducer;