import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/' }),
  endpoints: (builder) => ({
    // Create Permission
    createPermission: builder.mutation<void, { name: string }>({
      query: (body) => ({
        url: 'permission',
        method: 'POST',
        body: { name: body.name },
      }),
    }),

    // Update Permission
    updatePermission: builder.mutation<void, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `permission/${id}`,
        method: 'PUT',
        body: { name },
      }),
    }),

    // Get All Permissions
    getAllPermissions: builder.query<any[], void>({
      query: () => ({
        url: 'permission',
        method: 'GET',
      }),
    }),

    // Get Permission by ID
    getPermissionById: builder.query<any, string>({
      query: (id) => ({
        url: `permission/${id}`,
        method: 'GET',
      }),
    }),

    // Delete Permission
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({
        url: `permission/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useGetAllPermissionsQuery,
  useGetPermissionByIdQuery,
  useDeletePermissionMutation,
} = permissionApi;