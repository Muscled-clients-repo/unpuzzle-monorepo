import { 
  useGetCoursesQuery as useGetCoursesQueryBase,
} from '../services/course.services';

// Wrapper hook for getCourses without authentication
export const useGetCoursesQuery = (options?: any) => {
  return useGetCoursesQueryBase(undefined, options);
};