import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBaseApi } from './useBaseApi';
import { RootState } from '@/app/redux/store';
import {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCourse,
  updateCourse,
  setEnrolledCourses,
  addEnrolledCourse,
  setPopularCourses,
  setFilters,
  setCurrentPage,
  invalidateCache,
  addChapterToCourse,
  updateChapterInCourse,
  deleteChapterFromCourse,
  CourseFilters,
} from '@/app/redux/features/courses/coursesSlice';
import { Course, Chapter } from '@/app/types/course.types';

export const useCourses = () => {
  const dispatch = useDispatch();
  const api = useBaseApi();
  
  const {
    courses,
    currentCourse,
    enrolledCourses,
    popularCourses,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalCourses,
    lastFetch,
    cacheExpiry,
  } = useSelector((state: RootState) => state.courses);

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < cacheExpiry;
  }, [lastFetch, cacheExpiry]);

  // Fetch all courses with filters
  const fetchCourses = useCallback(async (options?: { filters?: CourseFilters; page?: number; force?: boolean }) => {
    const { filters: customFilters, page: customPage, force = false } = options || {};
    
    if (!force && isCacheValid()) {
      console.log('Debug - Using cached data');
      return; // Use cached data
    }

    // Use page from options if provided, otherwise use currentPage from state
    const pageToUse = customPage !== undefined ? customPage : currentPage;

    console.log('Debug - Fetching courses with params:', {
      pageToUse,
      currentPage,
      filters,
      customFilters,
      force
    });

    dispatch(fetchCoursesStart());
    
    const params: Record<string, any> = {
      page: pageToUse,
      limit: 15,
      ...(filters.category && { category: filters.category }),
      ...(filters.searchQuery && { search: filters.searchQuery }),
      ...(filters.sortBy && { sort: filters.sortBy }),
      ...(filters.priceRange && {
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      }),
      ...(filters.level && { level: filters.level }),
      ...customFilters,
    };

    console.log('Debug - API params:', params);
    console.log('Debug - Full API URL:', `/courses?${new URLSearchParams(params).toString()}`);

    const response = await api.get<{ 
      body: { 
        data: Course[]; 
        total_page: number; 
        count: number; 
      }; 
      message: string; 
      success: boolean; 
    }>(
      '/courses',
      { params }
    );

    console.log('Debug - API response:', response);

    if (response.success && response.data) {
      // The API returns data in response.data.body.data format
      const apiBody = response.data.body || response.data;
      const coursesData = apiBody.data || [];
      
      console.log('Debug - Processing successful response:', {
        dataExists: !!response.data,
        bodyExists: !!response.data.body,
        coursesArray: coursesData,
        coursesLength: coursesData.length,
        pageFromResponse: apiBody.page,
        totalPagesFromResponse: apiBody.total_page,
        countFromResponse: apiBody.count,
        firstCourseId: coursesData[0]?.id,
        lastCourseId: coursesData[coursesData.length - 1]?.id,
        requestedPage: pageToUse
      });
      
      dispatch(fetchCoursesSuccess({
        courses: coursesData,
        totalPages: apiBody.total_page || 1,
        totalCourses: apiBody.count || coursesData.length,
      }));
    } else {
      console.log('Debug - API call failed:', response.error);
      dispatch(fetchCoursesFailure(response.error || 'Failed to fetch courses'));
    }
  }, [api, dispatch, currentPage, filters, isCacheValid]);

  // Fetch single course by ID
  const fetchCourseById = useCallback(async (courseId: string) => {
    dispatch(fetchCoursesStart());
    
    const response = await api.get<Course>(`/courses/${courseId}`);
    
    if (response.success && response.data) {
      dispatch(setCourse(response.data));
      dispatch(fetchCoursesFailure(''));
    } else {
      dispatch(fetchCoursesFailure(response.error || 'Failed to fetch course'));
    }
    
    return response;
  }, [api, dispatch]);

  // Create new course
  const createCourse = useCallback(async (courseData: Partial<Course>) => {
    const response = await api.post<Course>('/courses', courseData);
    
    if (response.success && response.data) {
      dispatch(invalidateCache());
      await fetchCourses({ force: true });
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

  // Update course
  const updateCourseData = useCallback(async (courseId: string, updates: Partial<Course>) => {
    const response = await api.put<Course>(`/courses/${courseId}`, updates);
    
    if (response.success && response.data) {
      dispatch(updateCourse(response.data));
    }
    
    return response;
  }, [api, dispatch]);

  // Delete course
  const deleteCourse = useCallback(async (courseId: string) => {
    const response = await api.delete(`/courses/${courseId}`);
    
    if (response.success) {
      dispatch(invalidateCache());
      await fetchCourses({ force: true });
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

  // Enroll in course
  const enrollInCourse = useCallback(async (courseId: string) => {
    const response = await api.post<Course>(`/courses/${courseId}/enroll`);
    
    if (response.success && response.data) {
      dispatch(addEnrolledCourse(response.data));
    }
    
    return response;
  }, [api, dispatch]);

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    const response = await api.get<Course[]>('/courses/enrolled');
    
    if (response.success && response.data) {
      dispatch(setEnrolledCourses(response.data));
    }
    
    return response;
  }, [api, dispatch]);

  // Fetch popular courses
  const fetchPopularCourses = useCallback(async (limit = 8) => {
    const response = await api.get<{ 
      body: { 
        data: Course[]; 
        total_page: number; 
        count: number; 
      }; 
      message: string; 
      success: boolean; 
    }>('/courses', {
      params: { 
        limit,
        sort: 'popular',
        page: 1
      },
    });
    
    if (response.success && response.data) {
      const apiBody = response.data.body || response.data;
      const coursesData = apiBody.data || [];
      dispatch(setPopularCourses(coursesData));
    }
    
    return response;
  }, [api, dispatch]);

  // Chapter management
  const addChapter = useCallback(async (courseId: string, chapterData: Partial<Chapter>) => {
    const response = await api.post<Chapter>(`/courses/${courseId}/chapters`, chapterData);
    
    if (response.success && response.data) {
      dispatch(addChapterToCourse({ courseId, chapter: response.data }));
    }
    
    return response;
  }, [api, dispatch]);

  const updateChapter = useCallback(async (
    courseId: string,
    chapterId: string,
    updates: Partial<Chapter>
  ) => {
    const response = await api.put<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}`,
      updates
    );
    
    if (response.success && response.data) {
      dispatch(updateChapterInCourse({ courseId, chapterId, updates: response.data }));
    }
    
    return response;
  }, [api, dispatch]);

  const deleteChapter = useCallback(async (courseId: string, chapterId: string) => {
    const response = await api.delete(`/courses/${courseId}/chapters/${chapterId}`);
    
    if (response.success) {
      dispatch(deleteChapterFromCourse({ courseId, chapterId }));
    }
    
    return response;
  }, [api, dispatch]);

  // Update filters
  const updateFilters = useCallback((newFilters: CourseFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1)); // Reset to first page when filters change
  }, [dispatch]);

  // Pagination
  const goToPage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    // Invalidate cache to force new fetch
    dispatch(invalidateCache());
  }, [dispatch]);

  // Auto-fetch courses when filters or page changes (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses().catch(console.error);
    }, 100); // Small debounce to prevent rapid-fire requests
    
    return () => clearTimeout(timeoutId);
  }, [filters, currentPage, fetchCourses]);

  return {
    // State
    courses,
    currentCourse,
    enrolledCourses,
    popularCourses,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalCourses,
    
    // Actions
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse: updateCourseData,
    deleteCourse,
    enrollInCourse,
    fetchEnrolledCourses,
    fetchPopularCourses,
    
    // Chapter actions
    addChapter,
    updateChapter,
    deleteChapter,
    
    // UI actions
    updateFilters,
    goToPage,
    refreshCourses: () => {
      dispatch(invalidateCache());
      return fetchCourses({ force: true });
    },
  };
};

// Hook for single course details
export const useCourseDetails = (courseId: string) => {
  const { currentCourse, fetchCourseById, loading, error } = useCourses();
  
  useEffect(() => {
    if (courseId && (!currentCourse || currentCourse.id !== courseId)) {
      fetchCourseById(courseId);
    }
  }, [courseId, currentCourse, fetchCourseById]);
  
  return {
    course: currentCourse,
    loading,
    error,
    refetch: () => fetchCourseById(courseId),
  };
};

// Hook for enrolled courses
export const useEnrolledCourses = () => {
  const { enrolledCourses, fetchEnrolledCourses, loading, error } = useCourses();
  
  useEffect(() => {
    if (enrolledCourses.length === 0) {
      fetchEnrolledCourses();
    }
  }, [enrolledCourses.length, fetchEnrolledCourses]);
  
  return {
    enrolledCourses,
    loading,
    error,
    refetch: fetchEnrolledCourses,
  };
};

// Hook for popular courses
export const usePopularCourses = (limit = 8) => {
  const { popularCourses, fetchPopularCourses, loading, error } = useCourses();
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  useEffect(() => {
    // Only fetch once per component lifecycle, regardless of errors
    if (!fetchAttempted && popularCourses.length === 0 && !loading) {
      setFetchAttempted(true);
      fetchPopularCourses(limit).catch((err) => {
        console.error('Failed to fetch popular courses:', err);
        // Don't retry automatically - user can manually refetch
      });
    }
  }, [fetchAttempted, popularCourses.length, fetchPopularCourses, limit, loading]);
  
  return {
    popularCourses,
    loading,
    error,
    refetch: () => {
      setFetchAttempted(false); // Allow refetch
      return fetchPopularCourses(limit);
    },
  };
};