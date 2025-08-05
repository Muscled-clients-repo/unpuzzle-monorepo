import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const enrollApi = createApi({
  reducerPath: 'enrollApi',
  baseQuery: baseQuery,
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

    // Update Enroll
    updateEnroll: builder.mutation<void, { id: string; userId: string; courseId: string }>({
      query: ({ id, userId, courseId }) => ({
        url: `enroll/${id}`,
        method: 'PUT',
        body: { userId, courseId },
      }),
      invalidatesTags: ['Enrolls'], // Refresh enrollments after update
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

    deleteEnroll: builder.mutation<void, string>({
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
  useUpdateEnrollMutation,
  useGetAllEnrollsQuery,
  useGetEnrollByIdQuery,
  useDeleteEnrollMutation,
} = enrollApi;
