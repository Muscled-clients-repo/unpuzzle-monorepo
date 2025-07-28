import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const puzzlepiecesApi = createApi({
  reducerPath: 'puzzlepiecesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
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
