import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizzApi = createApi({
  reducerPath: "quizzApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
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

