import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

interface ActivityLog {
  id: string;
  videoId: string;
  timestamp: number;
  action: string;
  details?: any;
  [key: string]: any;
}

interface ActivityLogsResponse {
  success: boolean;
  data: ActivityLog[];
}

export const activityLogsApi = createApi({
  reducerPath: 'activityLogsApi',
  baseQuery: baseQuery,
  tagTypes: ['ActivityLogs'],
  endpoints: (build) => ({
    getActivityLogs: build.query<ActivityLog[], string>({
      query: (videoId) => ({
        url: `/api/activity-logs?videoId=${encodeURIComponent(videoId)}`,
      }),
      providesTags: ['ActivityLogs'],
      transformResponse: (response: ActivityLogsResponse) => {
        if (response.success) {
          return response.data;
        }
        throw new Error('Failed to fetch activity logs');
      },
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogsApi;