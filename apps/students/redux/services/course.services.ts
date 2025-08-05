import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

const BASE_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL || 'https://dev.nazmulcodes.org';

// Create a dynamic base query that accepts token as parameter
const dynamicBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  // Extract token from the args if it's passed
  let token: string | undefined;
  let actualArgs = args;
  
  if (typeof args === 'object' && args !== null && 'token' in args) {
    token = (args as any).token;
    // Remove token from args before passing to fetchBaseQuery
    const { token: _, ...restArgs } = args as any;
    actualArgs = restArgs;
  }
  
  // Remove verbose logging in production
  
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  
  try {
    const result = await rawBaseQuery(actualArgs, api, extraOptions);
    return result;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Courses'],
  endpoints: (build) => ({
    getCourses: build.query({
      query: (token?: string) => ({
        url: '/api/courses',
        ...(token && { token }),
      }),
      providesTags: ['Courses'],
    }),
  }),
});

export const { useGetCoursesQuery } = courseApi;

// Usage:
// 1. After login, dispatch setToken(token) to Redux.
// 2. Use useGetCoursesQuery() in your component. The token will be sent automatically.
