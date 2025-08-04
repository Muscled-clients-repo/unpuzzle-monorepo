import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

export const puzzlepiecesApi = createApi({
  reducerPath: 'puzzlepiecesApi',
  baseQuery: baseQuery,
  tagTypes: ['PuzzlePieces'], // ✅ Ensures UI updates automatically
  endpoints: (builder) => ({
    // Create Puzzle Piece
    createPuzzlePiece: builder.mutation({
      query: (data) => ({
        url: '/puzzlepieces',
        method: 'POST',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['PuzzlePieces'], // 🔥 Refresh UI after creation
    }),

    // Update Puzzle Piece
    updatePuzzlePiece: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/puzzlepieces/${id}`,
        method: 'PUT',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['PuzzlePieces'], // 🔥 Refresh UI after update
    }),

    // Get All Puzzle Pieces
    getAllPuzzlePieces: builder.query({
      query: (params) => ({
        url: '/puzzlepieces',
        params,
      }),
      providesTags: ['PuzzlePieces'], // ✅ Keep UI in sync
    }),

    // Get Puzzle Piece by ID
    getPuzzlePieceById: builder.query({
      query: (id) => `/puzzlepieces/${id}`,
      providesTags: ['PuzzlePieces'],
    }),

    // Delete Puzzle Piece
    deletePuzzlePiece: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/puzzlepieces/${id}`,
        method: 'DELETE',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['PuzzlePieces'], // 🔥 Refresh UI after deletion
    }),
  }),
});

export const {
  useCreatePuzzlePieceMutation,
  useUpdatePuzzlePieceMutation,
  useGetAllPuzzlePiecesQuery,
  useGetPuzzlePieceByIdQuery,
  useDeletePuzzlePieceMutation,
} = puzzlepiecesApi;
