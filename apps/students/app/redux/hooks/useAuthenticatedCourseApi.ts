import { 
  useGetCoursesQuery as useGetCoursesQueryBase,
  useCreateCourseMutation as useCreateCourseMutationBase,
  useDeleteCourseMutation as useDeleteCourseMutationBase,
  useUpdateCourseMutation as useUpdateCourseMutationBase
} from '../services/course.services';

// Wrapper hook for getCourses without authentication
export const useGetCoursesQuery = (options?: any) => {
  return useGetCoursesQueryBase(undefined, options);
};

// Wrapper hook for createCourse
export const useCreateCourseMutation = () => {
  const [createCourse, result] = useCreateCourseMutationBase();
  
  const createCourseWithAuth = async (coursePayload: any) => {
    return createCourse({ coursePayload, token: undefined });
  };
  
  return [createCourseWithAuth, result] as const;
};

// Wrapper hook for deleteCourse
export const useDeleteCourseMutation = () => {
  const [deleteCourse, result] = useDeleteCourseMutationBase();
  
  const deleteCourseWithAuth = async (courseId: string) => {
    return deleteCourse({ courseId, token: undefined });
  };
  
  return [deleteCourseWithAuth, result] as const;
};

// Wrapper hook for updateCourse
export const useUpdateCourseMutation = () => {
  const [updateCourse, result] = useUpdateCourseMutationBase();
  
  const updateCourseWithAuth = async ({ courseId, updatedData }: { courseId: string; updatedData: any }) => {
    return updateCourse({ courseId, updatedData, token: undefined });
  };
  
  return [updateCourseWithAuth, result] as const;
};