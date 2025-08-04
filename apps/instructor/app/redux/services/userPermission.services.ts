import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const userPermissionApi = createApi({
  reducerPath: 'userPermissionApi',
  baseQuery: baseQuery,
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
