import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:3001';

export const userPermissionApi = createApi({
  reducerPath: 'userPermissionApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    addUserPermission: build.mutation({
      query: ({ userId, permissionId }) => ({
        url: `/api/userpermission/add`,
        method: 'POST',
        body: { userId, permissionId },
      }),
    }),
    removeUserPermission: build.mutation({
      query: ({ userId, permission }) => ({
        url: `/api/user/${userId}/permission`,
        method: 'DELETE',
        body: { permission },
      }),
    }),
  }),
});


export const {
  useAddUserPermissionMutation,
  useRemoveUserPermissionMutation,
} = userPermissionApi;
