import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiClientBaseQuery } from "./baseQuery";

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

// TypeScript interfaces for Puzzle Check
export interface PuzzleCheckItem {
  id: string;
  answer: string;
  choices: string[];
  question: string;
  created_at: string;
  updated_at: string | null;
  puzzlecheck_id: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  end_time: number;
  video_url: string;
  chapter_id: string;
  created_at: string;
  start_time: number;
  updated_at: string;
  yt_video_id: string;
  video_source: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role?: string;
  title?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface PuzzleCheckDetail {
  id: string;
  topic: string;
  created_at: string;
  updated_at: string;
  video_id: string;
  duration: number;
  user_id: string;
  total_checks: number;
  correct_checks_count: number | null;
  checks: PuzzleCheckItem[];
  video: VideoInfo;
  user: UserInfo;
}

export interface PuzzleCheckResponse {
  success: boolean;
  body: PuzzleCheckDetail;
  message?: string;
}

// Legacy interface for backward compatibility
export interface PuzzleCheck {
  id: string;
  video_id: string;
  user_id: string;
  timestamp: number;
  question: string;
  answer: string;
  is_correct: boolean;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

// TypeScript interfaces for Puzzle Hint
export interface PuzzleHintVideo {
  title: string;
  video_url: string;
  duration: number;
}

// Using UserInfo interface instead of PuzzleHintUser for consistency

export interface PuzzleHintCompletionStep {
  instruction: string;
  step_number: number;
}

export interface PuzzleHintDetail {
  id: string;
  question: string;
  prompt: string;
  completion: PuzzleHintCompletionStep[];
  duration: number;
  video_id: string;
  status: string;
  video: PuzzleHintVideo;
  user: UserInfo;
  created_at?: string;
}

export interface PuzzleHintResponse {
  success: boolean;
  body: PuzzleHintDetail;
  message?: string;
}

// TypeScript interfaces for Puzzle Reflect
export interface PuzzleReflectFile {
  id: string;
  url: string;
  name: string;
  file_id: string;
  file_size: string;
  mime_type: string;
  created_at: string;
  stoarge_path: string;
  puzzle_reflect_id: string;
  original_file_name: string;
}

export interface PuzzleReflectDetail {
  id: string;
  created_at: string;
  updated_at: string;
  type: 'loom' | 'images' | 'audio';
  loom_link?: string | null;
  user_id: string;
  video_id: string;
  title: string;
  timestamp: number;
  video?: VideoInfo;
  user?: UserInfo;
  file?: PuzzleReflectFile[];
}

export interface PuzzleReflectResponse {
  success: boolean;
  body: PuzzleReflectDetail;
  message?: string;
}

// TypeScript interfaces for Puzzle Path
export interface PuzzlePathStep {
  id: string;
  step_number: number;
  description: string;
  created_at?: string;
}

export interface PuzzlePathDetail {
  id: string;
  title: string;
  description?: string;
  timestamp?: number;
  video_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  steps?: PuzzlePathStep[];
  video?: VideoInfo;
  user?: UserInfo;
  // PuzzlePath IS the recommended video data
  trigger_time?: number;
  content_url?: string;
  content_type?: "yt_video" | "unpuzzle_video";
  yt_video_id?: string;
  content_video_id?: string;
  start_time?: number;
  end_time?: number;
  duration?: number;
}

export interface PuzzlePathResponse {
  success: boolean;
  body: PuzzlePathDetail;
  message?: string;
}

export const puzzleAgentsApi = createApi({
  reducerPath: "puzzleAgentsApi",
  baseQuery: baseQuery, // Now uses centralized apiClient with automatic token handling
  tagTypes: ["PuzzleHint", "PuzzleCheck", "PuzzleReflect", "PuzzlePath"],
  endpoints: (build) => ({
    // PuzzleHint endpoints
    getPuzzleHintsByVideoId: build.query({
      query: ({
        videoId,
        page = 1,
        limit = 10,
      }: {
        videoId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/puzzle-hint/all?video_id=${videoId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["PuzzleHint"],
      transformResponse: (response: any) => {
        console.log("getPuzzleHintsByVideoId response is: ", response);
        if (response && response.success && response.body) {
          return {
            data: response.body.data,
            count: response.body.count,
            totalPages: response.body.total_page,
          };
        }
        return response;
      },
    }),

    // Get single PuzzleHint by ID
    getPuzzleHintById: build.query<PuzzleHintResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/puzzle-hint/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "PuzzleHint", id }],
      transformResponse: (response: any) => {
        console.log("getPuzzleHintById response:", response);
        // If response already has success/body structure, return as is
        if (response && response.success !== undefined) {
          return response;
        }
        // Otherwise, wrap the response in the expected structure
        return {
          success: true,
          body: response,
        };
      },
      transformErrorResponse: (response: any) => {
        console.error("getPuzzleHintById error:", response);
        return response;
      },
    }),

    // PuzzleCheck endpoints
    getPuzzleChecksByVideoId: build.query({
      query: ({
        videoId,
        page = 1,
        limit = 10,
      }: {
        videoId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/puzzel-checks/all?video_id=${videoId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["PuzzleCheck"],
      transformResponse: (response: any) => {
        // The apiClient already unwraps body, so response is the actual data
        if (response && response.data && Array.isArray(response.data)) {
          return {
            data: response.data,
            count: response.count || 0,
            totalPages: response.total_page || 1,
          };
        }
        return {
          data: [],
          count: 0,
          totalPages: 0,
        };
      },
    }),

    // Get single PuzzleCheck by ID
    getPuzzleCheckById: build.query<
      PuzzleCheckResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/puzzel-checks/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "PuzzleCheck", id }],
      transformResponse: (response: any) => {
        console.log("-------------getPuzzleCheckById response:", response);
        // If response already has success/body structure, return as is
        if (response && response.success !== undefined) {
          return response;
        }
        // Otherwise, wrap the response in the expected structure
        return {
          success: true,
          body: response,
        };
      },
      transformErrorResponse: (response: any) => {
        console.error("getPuzzleCheckById error:", response);
        return response;
      },
    }),

    // PuzzleReflect endpoints
    getPuzzleReflectsByVideoId: build.query({
      query: ({
        videoId,
        page = 1,
        limit = 10,
      }: {
        videoId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/puzzel-reflects/all?video_id=${videoId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["PuzzleReflect"],
      transformResponse: (response: any) => {
        // The apiClient already unwraps body, so response is the actual data
        if (response && response.data && Array.isArray(response.data)) {
          return {
            data: response.data,
            count: response.count || 0,
            totalPages: response.total_page || 1,
          };
        }
        return {
          data: [],
          count: 0,
          totalPages: 0,
        };
      },
    }),

    // Get single PuzzleReflect by ID
    getPuzzleReflectById: build.query<PuzzleReflectResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/puzzel-reflects/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "PuzzleReflect", id }],
      transformResponse: (response: any) => {
        console.log("getPuzzleReflectById RAW response:", response);
        // If response already has success/body structure, return as is
        if (response && response.success !== undefined) {
          if (response?.body?.user) {
            console.log("User data in response:", response.body.user);
          }
          return response;
        }
        // Otherwise, wrap the response in the expected structure
        if (response?.user) {
          console.log("User data in response:", response.user);
        }
        return {
          success: true,
          body: response,
        };
      },
      transformErrorResponse: (response: any) => {
        console.error("getPuzzleReflectById error:", response);
        return response;
      },
    }),

    // PuzzlePath endpoints
    getPuzzlePathsByVideoId: build.query({
      query: ({
        videoId,
        page = 1,
        limit = 10,
      }: {
        videoId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/api/puzzel-path/all?video_id=${videoId}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["PuzzlePath"],
      transformResponse: (response: any) => {
        // The apiClient already unwraps body, so response is the actual data
        if (response && response.data && Array.isArray(response.data)) {
          return {
            data: response.data,
            count: response.count || 0,
            totalPages: response.total_page || 1,
          };
        }
        return {
          data: [],
          count: 0,
          totalPages: 0,
        };
      },
    }),

    // Get single PuzzlePath by ID
    getPuzzlePathById: build.query<PuzzlePathResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/puzzel-path/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "PuzzlePath", id }],
      transformResponse: (response: any) => {
        console.log("getPuzzlePathById response:", response);
        // If response already has success/body structure, return as is
        if (response && response.success !== undefined) {
          return response;
        }
        // Otherwise, wrap the response in the expected structure
        return {
          success: true,
          body: response,
        };
      },
      transformErrorResponse: (response: any) => {
        console.error("getPuzzlePathById error:", response);
        return response;
      },
    }),

    // Create mutations for each puzzle agent type
    createPuzzleHint: build.mutation({
      query: ({ payload }: { payload: any }) => ({
        url: "/api/puzzle-hint",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PuzzleHint"],
    }),

    createPuzzleCheck: build.mutation({
      query: ({ payload }: { payload: any }) => ({
        url: "/api/puzzel-checks",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PuzzleCheck"],
    }),

    createPuzzleReflect: build.mutation({
      query: ({ payload }: { payload: any }) => ({
        url: "/api/puzzel-reflects",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PuzzleReflect"],
    }),

    createPuzzlePath: build.mutation({
      query: ({ payload }: { payload: any }) => ({
        url: "/api/puzzel-path",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PuzzlePath"],
    }),

    // Comment/Feedback endpoints
    addPuzzleHintComment: build.mutation({
      query: ({ id, comment }: { id: string; comment: string }) => ({
        url: `/api/puzzle-hint/${id}/comment`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PuzzleHint", id }],
    }),

    addPuzzleCheckComment: build.mutation({
      query: ({ id, comment }: { id: string; comment: string }) => ({
        url: `/api/puzzel-checks/${id}/comment`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PuzzleCheck", id }],
    }),

    addPuzzleReflectComment: build.mutation({
      query: ({ id, comment }: { id: string; comment: string }) => ({
        url: `/api/puzzel-reflects/${id}/comment`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PuzzleReflect", id }],
    }),

    addPuzzlePathComment: build.mutation({
      query: ({ id, comment }: { id: string; comment: string }) => ({
        url: `/api/puzzel-path/${id}/comment`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PuzzlePath", id }],
    }),
  }),
});

export const {
  useGetPuzzleHintsByVideoIdQuery,
  useGetPuzzleHintByIdQuery,
  useGetPuzzleChecksByVideoIdQuery,
  useGetPuzzleCheckByIdQuery,
  useGetPuzzleReflectsByVideoIdQuery,
  useGetPuzzleReflectByIdQuery,
  useGetPuzzlePathsByVideoIdQuery,
  useGetPuzzlePathByIdQuery,
  useCreatePuzzleHintMutation,
  useCreatePuzzleCheckMutation,
  useCreatePuzzleReflectMutation,
  useCreatePuzzlePathMutation,
  useAddPuzzleHintCommentMutation,
  useAddPuzzleCheckCommentMutation,
  useAddPuzzleReflectCommentMutation,
  useAddPuzzlePathCommentMutation,
} = puzzleAgentsApi;
