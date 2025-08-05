import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiClientBaseQuery } from "./baseQuery";
import { CoursesApiResponse, EnrolledCourse } from "../../types/course.types";

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQuery, // Now uses centralized apiClient with automatic token handling
  tagTypes: ["Courses"],
  endpoints: (build) => ({
    getCourses: build.query<
      CoursesApiResponse,
      { page?: number; limit?: number }
    >({
      query: (params = {}) => {
        const { page = 1, limit = 10 } = params;
        return {
          url: `/api/courses/?page=${page}&limit=${limit}`,
        };
      },
      providesTags: ["Courses"],
      transformResponse: (response: any): CoursesApiResponse => {
        console.log("-----------------response-----------------:", response);
        // Handle new API structure with body.data
        if (response && response.success && response.body) {
          return {
            data: response.body.data as EnrolledCourse[],
            count: response.body.count,
            totalPages: response.body.total_page,
          };
        }
        return response;
      },
    }),
    getCourseById: build.query({
      query: ({ id }: { id: string }) => ({
        url: `/api/courses/${id}`,
      }),
      providesTags: ["Courses"],
      transformResponse: (response: any) => {
        // If the response has a body property, return just the body
        if (response && response.success && response.body) {
          return response.body;
        }
        // If the response has a data property (old format), return just the data
        if (response && response.success && response.data) {
          return response.data;
        }
        // Otherwise return the response as is
        return response;
      },
    }),
    createCourse: build.mutation({
      query: ({ coursePayload }: { coursePayload: any }) => ({
        url: "/api/courses",
        method: "POST",
        body: coursePayload,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: build.mutation({
      query: ({ courseId }: { courseId: string }) => ({
        url: `/api/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: build.mutation({
      query: ({
        courseId,
        updatedData,
      }: {
        courseId: string;
        updatedData: any;
      }) => ({
        url: `/api/courses/${courseId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Courses"], // Ensure UI updates after update
    }),
    getChaptersByCourseId: build.query({
      query: ({
        courseId,
        page = 1,
        limit = 10,
      }: {
        courseId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/chapters?course_id=${courseId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["Courses"],
      transformResponse: (response: any) => {
        // Handle new API structure with body.data
        if (response && response.success && response.body) {
          return {
            data: response.body.data,
            count: response.body.count,
            totalPages: response.body.total_page,
          };
        }
        return response;
      },
    }),
    getVideosByChapterId: build.query({
      query: ({
        chapterId,
        page = 1,
        limit = 10,
      }: {
        chapterId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/videos?chapter_id=${chapterId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["Courses"],
      transformResponse: (response: any) => {
        // Handle new API structure with body.data
        if (response && response.success && response.body) {
          return {
            data: response.body.data,
            count: response.body.count,
            totalPages: response.body.total_page,
          };
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useGetChaptersByCourseIdQuery,
  useGetVideosByChapterIdQuery,
} = courseApi;

// Usage:
// 1. After login, dispatch setToken(token) to Redux.
// 2. Use useGetCoursesQuery() in your component. The token will be sent automatically.
