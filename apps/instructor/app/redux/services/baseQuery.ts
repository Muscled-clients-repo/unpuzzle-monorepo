import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { apiClient } from '@/app/utils/apiClient';

interface BaseQueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

interface BaseQueryError {
  status?: number;
  data?: any;
  error?: string;
}

/**
 * Base query for RTK Query that uses the centralized apiClient
 * Token handling is automatic - no need to pass tokens
 */
export const createApiClientBaseQuery = (baseUrl?: string): BaseQueryFn<
  string | BaseQueryArgs,
  unknown,
  BaseQueryError
> => {
  return async (args, api, extraOptions) => {
    try {
      // Handle string URL (simple GET request)
      if (typeof args === 'string') {
        const data = await apiClient({
          url: args,
          method: 'GET',
        });
        return { data };
      }

      // Handle object args
      const { url, method = 'GET', body, headers, params } = args;

      // Make request using centralized apiClient
      const data = await apiClient({
        url,
        method,
        body,
        headers,
        params,
      });

      return { data };
    } catch (error: any) {
      // Format error for RTK Query
      const baseQueryError: BaseQueryError = {
        status: error.status || 500,
        data: error.response?.data || error.message,
        error: error.message || 'Unknown error occurred',
      };

      return { error: baseQueryError };
    }
  };
};