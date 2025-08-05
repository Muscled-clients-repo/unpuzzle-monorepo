import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api.config';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
  success: boolean;
}

export interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  cache?: RequestCache;
  revalidate?: number;
}

export const useBaseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = (endpoint: string, params?: Record<string, any>) => {
    const fullUrl = `${API_ENDPOINTS.BASE}${endpoint}`;
    const url = new URL(fullUrl);
    
    console.log('Debug - Building URL:', { fullUrl, endpoint, params });
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }
    
    const finalUrl = url.toString();
    console.log('Debug - Final URL:', finalUrl);
    return finalUrl;
  };

  const getHeaders = async (customHeaders?: Record<string, string>) => {
    return {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
  };

  const request = useCallback(async <T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    options?: ApiOptions
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders(options?.headers);
      const url = buildUrl(endpoint, method === 'GET' ? options?.params : undefined);

      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',
        ...(options?.cache && { cache: options.cache }),
        ...(options?.revalidate && { next: { revalidate: options.revalidate } }),
      };

      if (data && method !== 'GET') {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      return {
        data: responseData.data || responseData,
        success: true,
        loading: false,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        error: errorMessage,
        success: false,
        loading: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(<T = any>(endpoint: string, options?: ApiOptions) => {
    return request<T>('GET', endpoint, undefined, options);
  }, [request]);

  const post = useCallback(<T = any>(endpoint: string, data?: any, options?: ApiOptions) => {
    return request<T>('POST', endpoint, data, options);
  }, [request]);

  const put = useCallback(<T = any>(endpoint: string, data?: any, options?: ApiOptions) => {
    return request<T>('PUT', endpoint, data, options);
  }, [request]);

  const patch = useCallback(<T = any>(endpoint: string, data?: any, options?: ApiOptions) => {
    return request<T>('PATCH', endpoint, data, options);
  }, [request]);

  const del = useCallback(<T = any>(endpoint: string, options?: ApiOptions) => {
    return request<T>('DELETE', endpoint, undefined, options);
  }, [request]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    loading,
    error,
  };
};

// Type-safe wrapper for API responses
export type UseApiResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Generic hook for API calls with caching
export const useApiCall = <T = any>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await apiCall();
    
    if (result.success && result.data) {
      setData(result.data);
    } else if (result.error) {
      setError(result.error);
    }
    
    setLoading(false);
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};