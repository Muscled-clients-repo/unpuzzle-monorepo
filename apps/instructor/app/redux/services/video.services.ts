import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const videosApi = createApi({
  reducerPath: 'videosApi',
  baseQuery: baseQuery,
  tagTypes: ['Videos'], 
  endpoints: (builder) => ({
    // Create Video
    createVideo: builder.mutation<void, { userId: string; courseId: string }>({
      query: (body) => ({
        url: 'videos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Videos'],
    }),

    // Update Video
    updateVideo: builder.mutation<void, { id: string; userId: string; courseId: string }>({
      query: ({ id, userId, courseId }) => ({
        url: `videos/${id}`,
        method: 'PUT',
        body: { userId, courseId },
      }),
      invalidatesTags: ['Videos'],
    }),

    // Get All Videos
    getAllVideos: builder.query<any[], void>({
      query: () => ({
        url: 'videos',
        method: 'GET',
      }),
      providesTags: ['Videos'],
    }),

    // Get Video by ID
    getVideoById: builder.query<any, string>({
      query: (id) => ({
        url: `videos/${id}`,
        method: 'GET',
      }),
      providesTags: ['Videos'],
    }),

    // Delete Video
    deleteVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Videos'],
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  useDeleteVideoMutation,
} = videosApi;
