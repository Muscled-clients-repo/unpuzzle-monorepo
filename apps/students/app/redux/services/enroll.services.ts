import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../config/api.config';

export const enrollApi = createApi({
  reducerPath: 'enrollApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINTS.BASE + '/' }),
  tagTypes: ['Enrolls'], // Add tag to manage UI updates
  endpoints: (builder) => ({
    // Create Enroll
    createEnroll: builder.mutation<void, { userId: string; courseId: string }>({
      query: (body) => ({
        url: 'enroll',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Enrolls'], // Refresh enrollments after creation
    }),


    // Get All Enrolls
    getAllEnrolls: builder.query<any[], void>({
      query: () => ({
        url: 'enroll',
        method: 'GET',
      }),
      providesTags: ['Enrolls'], // Ensure enroll list updates on change
    }),

    // Get Enroll by ID
    getEnrollById: builder.query<any, string>({
      query: (id) => ({
        url: `enroll/${id}`,
        method: 'GET',
      }),
      providesTags: ['Enrolls'],
    }),

    // Cancel enrollment (delete enrollment)
    cancelEnrollment: builder.mutation<void, string>({
      query: (id) => ({
        url: `enroll/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrolls'], 
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateEnrollMutation,
  useGetAllEnrollsQuery,
  useGetEnrollByIdQuery,
  useCancelEnrollmentMutation,
} = enrollApi;
