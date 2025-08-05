import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const quizzApi = createApi({
  reducerPath: "quizzApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllQuizzes: builder.query({
      query: ({ userId, courseId }) => ({
        url: "/quizz",
        method: "GET",
        params: { userId, courseId },
      }),
    }),
    getQuizz: builder.query({
      query: ({ id, userId, courseId }) => ({
        url: `/quizz/${id}`,
        method: "GET",
        params: { userId, courseId },
      }),
    }),
    createQuizz: builder.mutation({
      query: (quizzData) => ({
        url: "/quizz",
        method: "POST",
        body: quizzData,
      }),
    }),
    updateQuizz: builder.mutation({
      query: ({ id, userId, courseId }) => ({
        url: `/quizz/${id}`,
        method: "PUT",
        body: { userId, courseId },
      }),
    }),
    deleteQuizz: builder.mutation({
      query: ({ id, userId, courseId }) => ({
        url: `/quizz/${id}`,
        method: "DELETE",
        body: { userId, courseId },
      }),
    }),
  }),
});

export const {
  useGetAllQuizzesQuery,
  useGetQuizzQuery,
  useCreateQuizzMutation,
  useUpdateQuizzMutation,
  useDeleteQuizzMutation,
} = quizzApi;

