import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const scriptsApi = createApi({
  reducerPath: 'scriptsApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createScript: builder.mutation({
      query: ({ userId, courseId }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('courseId', courseId);

        return {
          url: '/scripts',
          method: 'POST',
          body: formData,
        };
      },
    }),
    updateScript: builder.mutation({
      query: ({ id, userId, courseId }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('courseId', courseId);

        return {
          url: `/scripts/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
    }),
    getAllScripts: builder.query({
      query: () => ({
        url: '/scripts',
        method: 'GET',
      }),
    }),
    getScriptById: builder.query({
      query: (id) => ({
        url: `/scripts/${id}`,
        method: 'GET',
      }),
    }),
    deleteScript: builder.mutation({
      query: ({ id, userId, courseId }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('courseId', courseId);

        return {
          url: `/scripts/${id}`,
          method: 'DELETE',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useCreateScriptMutation,
  useUpdateScriptMutation,
  useGetAllScriptsQuery,
  useGetScriptByIdQuery,
  useDeleteScriptMutation,
} = scriptsApi;
