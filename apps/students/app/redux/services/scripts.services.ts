import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../config/api.config';

export const scriptsApi = createApi({
  reducerPath: 'scriptsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINTS.BASE }),
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
