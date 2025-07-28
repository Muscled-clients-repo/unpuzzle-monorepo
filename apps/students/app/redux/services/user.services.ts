import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api.config';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (userPayload) => ({
        url: '/api/user',
        method: 'POST',
        body: userPayload,
      }),
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/api/user/${userId}`,
        method: 'DELETE',
      }),
    }),
    updateUser: build.mutation({
      query: ({ userId, userPayload }) => ({
        url: `/api/user/${userId}`,
        method: 'PUT',
        body: userPayload,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;
