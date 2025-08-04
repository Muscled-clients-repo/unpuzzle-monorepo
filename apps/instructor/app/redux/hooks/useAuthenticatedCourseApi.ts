import { 
  useGetCoursesQuery as useGetCoursesQueryBase,
  useGetCourseByIdQuery as useGetCourseByIdQueryBase,
  useCreateCourseMutation as useCreateCourseMutationBase,
  useDeleteCourseMutation as useDeleteCourseMutationBase,
  useUpdateCourseMutation as useUpdateCourseMutationBase,
  useGetChaptersByCourseIdQuery as useGetChaptersByCourseIdQueryBase,
  useGetVideosByChapterIdQuery as useGetVideosByChapterIdQueryBase
} from '../services/course.services';

// Wrapper hook for getCourses - bypassing authentication
export const useGetCoursesQuery = (params: { page?: number; limit?: number } = {}, options?: any) => {
  // Direct API call without authentication
  const result = useGetCoursesQueryBase(params, {
    ...options,
    skip: options?.skip,
  });
  
  return result;
};

// Wrapper hook for createCourse
export const useCreateCourseMutation = () => {
  const [createCourse, result] = useCreateCourseMutationBase();
  
  const createCourseWithAuth = async (coursePayload: any) => {
    // Direct API call without authentication
    return createCourse({ coursePayload });
  };
  
  return [createCourseWithAuth, result] as const;
};

// Wrapper hook for deleteCourse
export const useDeleteCourseMutation = () => {
  const [deleteCourse, result] = useDeleteCourseMutationBase();
  
  const deleteCourseWithAuth = async (courseId: string) => {
    // Direct API call without authentication
    return deleteCourse({ courseId });
  };
  
  return [deleteCourseWithAuth, result] as const;
};

// Wrapper hook for updateCourse
export const useUpdateCourseMutation = () => {
  const [updateCourse, result] = useUpdateCourseMutationBase();
  
  const updateCourseWithAuth = async ({ courseId, updatedData }: { courseId: string; updatedData: any }) => {
    // Direct API call without authentication
    return updateCourse({ courseId, updatedData });
  };
  
  return [updateCourseWithAuth, result] as const;
};

// Wrapper hook for getCourseById - bypassing authentication
export const useGetCourseByIdQuery = (params: { id: string }, options?: any) => {
  // Direct API call without authentication
  const result = useGetCourseByIdQueryBase({ id: params.id }, {
    ...options,
    skip: options?.skip,
  });

  return result;
};

// Wrapper hook for getChaptersByCourseId - bypassing authentication
export const useGetChaptersByCourseIdQuery = (params: { courseId: string; page?: number; limit?: number }, options?: any) => {
  // Direct API call without authentication
  const result = useGetChaptersByCourseIdQueryBase(params, {
    ...options,
    skip: options?.skip,
  });

  return result;
};

// Wrapper hook for getVideosByChapterId - bypassing authentication
export const useGetVideosByChapterIdQuery = (params: { chapterId: string; page?: number; limit?: number }, options?: any) => {
  // Direct API call without authentication
  const result = useGetVideosByChapterIdQueryBase(params, {
    ...options,
    skip: options?.skip,
  });

  return result;
};