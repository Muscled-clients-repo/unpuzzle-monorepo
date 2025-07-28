import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:3001';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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
