import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery,
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
