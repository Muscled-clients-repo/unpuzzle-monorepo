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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  
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
      // Immediate refresh after successful creation
      setTimeout(async () => {
        await fetchCourses({ force: true });
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

  // Update course
  const updateCourseData = useCallback(async (courseId: string, updates: Partial<Course>) => {
    const response = await api.put<Course>(`/courses/${courseId}`, updates);
    
    if (response.success && response.data) {
      dispatch(updateCourse(response.data));
      // Refresh data after successful update
      setTimeout(async () => {
        await fetchCourses({ force: true });
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

  // Delete course
  const deleteCourse = useCallback(async (courseId: string) => {
    const response = await api.delete(`/courses/${courseId}`);
    
    if (response.success) {
      dispatch(invalidateCache());
      // Immediate refresh after successful deletion
      setTimeout(async () => {
        await fetchCourses({ force: true });
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

  // Enroll in course
  const enrollInCourse = useCallback(async (courseId: string) => {
    const response = await api.post<Course>(`/courses/${courseId}/enroll`);
    
    if (response.success && response.data) {
      dispatch(addEnrolledCourse(response.data));
      // Refresh main courses data after successful enrollment
      setTimeout(async () => {
        await fetchCourses({ force: true });
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourses]);

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
      // Refresh course data after adding chapter
      setTimeout(async () => {
        await fetchCourseById(courseId);
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourseById]);

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
      // Refresh course data after updating chapter
      setTimeout(async () => {
        await fetchCourseById(courseId);
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourseById]);

  const deleteChapter = useCallback(async (courseId: string, chapterId: string) => {
    const response = await api.delete(`/courses/${courseId}/chapters/${chapterId}`);
    
    if (response.success) {
      dispatch(deleteChapterFromCourse({ courseId, chapterId }));
      // Refresh course data after deleting chapter
      setTimeout(async () => {
        await fetchCourseById(courseId);
      }, 100);
    }
    
    return response;
  }, [api, dispatch, fetchCourseById]);

  // Update filters with immediate fetch
  const updateFilters = useCallback((newFilters: CourseFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1)); // Reset to first page when filters change
    dispatch(invalidateCache());
    // Trigger immediate fetch after filter change
    setTimeout(() => {
      fetchCourses({ force: true }).catch(console.error);
    }, 50);
  }, [dispatch, fetchCourses]);

  // Pagination with immediate fetch
  const goToPage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(invalidateCache());
    // Trigger immediate fetch after page change
    setTimeout(() => {
      fetchCourses({ force: true }).catch(console.error);
    }, 50);
  }, [dispatch, fetchCourses]);

  // Search function that updates filters and fetches immediately
  const performSearch = useCallback((searchQuery: string) => {
    const newFilters = { ...filters, searchQuery };
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1));
    dispatch(invalidateCache());
    // Immediate fetch for search
    setTimeout(() => {
      fetchCourses({ force: true }).catch(console.error);
    }, 50);
  }, [dispatch, filters, fetchCourses]);

  // Initial fetch on mount only
  useEffect(() => {
    if (!hasInitialized && !loading && courses.length === 0) {
      setHasInitialized(true);
      fetchCourses({ force: true }).catch(console.error);
    }
  }, [hasInitialized, loading, courses.length, fetchCourses]);

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
    performSearch,
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

// Hook for user's enrolled courses with pagination
export const useMyCourses = (page = 1, limit = 12) => {
  const api = useBaseApi();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(false);
  const [myCoursesError, setMyCoursesError] = useState<string | null>(null);
  const [totalMyCoursesPages, setTotalMyCoursesPages] = useState(1);
  const [totalMyCourses, setTotalMyCourses] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const fetchMyCourses = useCallback(async (options?: { 
    searchQuery?: string; 
    category?: string; 
    sortBy?: string;
    page?: number;
  }) => {
    setMyCoursesLoading(true);
    setMyCoursesError(null);
    
    const params: Record<string, any> = {
      page: options?.page || page,
      limit,
      mycourse: true, // Use the query parameter as requested
      ...(options?.searchQuery && { search: options.searchQuery }),
      ...(options?.category && { category: options.category }),
      ...(options?.sortBy && { sort: options.sortBy }),
    };
    
    try {
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
      
      if (response.success && response.data) {
        const apiBody = response.data.body || response.data;
        const coursesData = apiBody.data || [];
        
        setMyCourses(coursesData);
        setTotalMyCoursesPages(apiBody.total_page || 1);
        setTotalMyCourses(apiBody.count || coursesData.length);
      } else {
        setMyCoursesError(response.error || 'Failed to fetch my courses');
      }
    } catch (error) {
      console.error('Failed to fetch my courses:', error);
      setMyCoursesError('Failed to fetch my courses');
    } finally {
      setMyCoursesLoading(false);
    }
  }, [api, page, limit]);

  // Course management functions with auto-refresh
  const updateMyCourse = useCallback(async (courseId: string, updates: Partial<Course>) => {
    const response = await api.put<Course>(`/courses/${courseId}`, updates);
    
    if (response.success && response.data) {
      // Refresh my courses data after successful update
      setTimeout(() => {
        fetchMyCourses();
      }, 100);
    }
    
    return response;
  }, [api, fetchMyCourses]);

  const unenrollFromCourse = useCallback(async (courseId: string) => {
    const response = await api.delete(`/courses/${courseId}/enroll`);
    
    if (response.success) {
      // Refresh my courses data after successful unenrollment
      setTimeout(() => {
        fetchMyCourses();
      }, 100);
    }
    
    return response;
  }, [api, fetchMyCourses]);

  const updateCourseProgress = useCallback(async (courseId: string, progress: number) => {
    const response = await api.put(`/courses/${courseId}/progress`, { progress });
    
    if (response.success) {
      // Refresh my courses data after progress update
      setTimeout(() => {
        fetchMyCourses();
      }, 100);
    }
    
    return response;
  }, [api, fetchMyCourses]);
  
  // Auto-fetch on mount only once
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchMyCourses();
    }
  }, [hasInitialized, fetchMyCourses]);
  
  return {
    myCourses,
    myCoursesLoading,
    myCoursesError,
    totalMyCoursesPages,
    totalMyCourses,
    fetchMyCourses,
    refetchMyCourses: () => fetchMyCourses(),
    // New mutation functions with auto-refresh
    updateMyCourse,
    unenrollFromCourse,
    updateCourseProgress,
  };
};