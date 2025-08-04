import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiClientBaseQuery } from "./baseQuery";

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

interface UserCreditsResponse {
  id: string;
  userId: string;
  availableCredits: number;
  totalCredits: number;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  availableCredits: number;
  totalCredits: number;
  createdAt: string;
  updatedAt: string;
}

export const creditsApi = createApi({
  reducerPath: "creditsApi",
  baseQuery: baseQuery,
  tagTypes: ["Credits", "User"],
  endpoints: (build) => ({
    // Get user credits - specific endpoint for credits
    getUserCredits: build.query<UserCreditsResponse, string>({
      query: (userId) => ({
        url: `/api/user/${userId}/credits`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Credits", id: userId },
        { type: "User", id: userId },
      ],
      // Poll every 5 seconds for real-time updates
      // pollingInterval: 5000,
    }),

    // Get user by ID (includes credits and other user data)
    getUserById: build.query<UserResponse, string>({
      query: (userId) => ({
        url: `/api/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
  }),
});

export const { useGetUserCreditsQuery, useGetUserByIdQuery } = creditsApi;
