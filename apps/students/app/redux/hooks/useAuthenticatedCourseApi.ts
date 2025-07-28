import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { 
  useGetCoursesQuery as useGetCoursesQueryBase,
  useCreateCourseMutation as useCreateCourseMutationBase,
  useDeleteCourseMutation as useDeleteCourseMutationBase,
  useUpdateCourseMutation as useUpdateCourseMutationBase
} from '../services/course.services';

// Wrapper hook for getCourses with optimized token fetching
export const useGetCoursesQuery = (options?: any) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    // Only fetch token if Clerk is loaded and user is signed in
    if (!isLoaded || !isSignedIn) {
      setIsInitializing(false);
      return;
    }

    const fetchToken = async () => {
      try {
        const authToken = await getToken();
        if (process.env.NODE_ENV === 'development') {
          
        }
        setToken(authToken);
        setTokenError(null);
      } catch (error) {
        console.error('Error fetching Clerk token:', error);
        setTokenError('Failed to fetch authentication token');
      } finally {
        setIsInitializing(false);
      }
    };
    
    fetchToken();
  }, [getToken, isLoaded, isSignedIn]);
  
  // If there's a token error, return an error state
  if (tokenError) {
    return {
      data: undefined,
      error: { message: tokenError },
      isLoading: false,
      isError: true,
      isSuccess: false,
      refetch: () => {},
    };
  }
  
  // Show loading state while initializing
  const result = useGetCoursesQueryBase(token || undefined, {
    ...options,
    skip: !token || !isSignedIn || options?.skip,
  });
  
  // Override loading state to include initialization
  return {
    ...result,
    isLoading: isInitializing || result.isLoading,
  };
};

// Wrapper hook for createCourse
export const useCreateCourseMutation = () => {
  const { getToken } = useAuth();
  const [createCourse, result] = useCreateCourseMutationBase();
  
  const createCourseWithAuth = async (coursePayload: any) => {
    const token = await getToken();
    return createCourse({ coursePayload, token: token || undefined });
  };
  
  return [createCourseWithAuth, result] as const;
};

// Wrapper hook for deleteCourse
export const useDeleteCourseMutation = () => {
  const { getToken } = useAuth();
  const [deleteCourse, result] = useDeleteCourseMutationBase();
  
  const deleteCourseWithAuth = async (courseId: string) => {
    const token = await getToken();
    return deleteCourse({ courseId, token: token || undefined });
  };
  
  return [deleteCourseWithAuth, result] as const;
};

// Wrapper hook for updateCourse
export const useUpdateCourseMutation = () => {
  const { getToken } = useAuth();
  const [updateCourse, result] = useUpdateCourseMutationBase();
  
  const updateCourseWithAuth = async ({ courseId, updatedData }: { courseId: string; updatedData: any }) => {
    const token = await getToken();
    return updateCourse({ courseId, updatedData, token: token || undefined });
  };
  
  return [updateCourseWithAuth, result] as const;
};