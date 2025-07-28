import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const puzzleSolutionApi = createApi({
  reducerPath: "puzzleSolutionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
  endpoints: (builder) => ({
    getAllPuzzleSolutions: builder.query({
      query: ({ userId, courseId }) => ({
        url: "/puzzle-solution",
        method: "GET",
        body: { userId, courseId },
      }),
    }),
    getPuzzleSolution: builder.query({
      query: ({ id, userId, courseId }) => ({
        url: `/puzzle-solution/${id}`,
        method: "GET",
        body: { userId, courseId },
      }),
    }),
    createPuzzleSolution: builder.mutation({
      query: ({ userId, puzzleId, userAnswer }) => ({
        url: "/puzzle-solution",
        method: "POST",
        body: { userId, puzzleId, userAnswer },
      }),
    }),
    updatePuzzleSolution: builder.mutation({
      query: ({ id, userId, courseId }) => ({
        url: `/puzzle-solution/${id}`,
        method: "PUT",
        body: { userId, courseId },
      }),
    }),
    deletePuzzleSolution: builder.mutation({
      query: ({ id, userId, courseId }) => ({
        url: `/puzzle-solution/${id}`,
        method: "DELETE",
        body: { userId, courseId },
      }),
    }),
  }),
});

export const {
  useGetAllPuzzleSolutionsQuery,
  useGetPuzzleSolutionQuery,
  useCreatePuzzleSolutionMutation,
  useUpdatePuzzleSolutionMutation,
  useDeletePuzzleSolutionMutation,
} = puzzleSolutionApi;
