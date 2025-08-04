import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

interface AgentRecommendation {
  puzzleHint?: boolean;
  puzzleReflect?: boolean;
  puzzlePath?: boolean;
  puzzleChecks?: boolean;
}

export const aiAgentApi = createApi({
  reducerPath: 'aiAgentApi',
  baseQuery: baseQuery,
  tagTypes: ['AgentRecommendation'],
  endpoints: (build) => ({
    getAgentRecommendation: build.mutation<AgentRecommendation, { videoId: string }>({
      query: ({ videoId }) => ({
        url: '/api/recommend-agent/solution',
        method: 'POST',
        body: { videoId },
      }),
    }),
  }),
});

export const { useGetAgentRecommendationMutation } = aiAgentApi;