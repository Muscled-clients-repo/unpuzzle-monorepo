import { createApi } from '@reduxjs/toolkit/query/react'
import { createApiClientBaseQuery } from './baseQuery'

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery()

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi