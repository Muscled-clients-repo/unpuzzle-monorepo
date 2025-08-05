// utils/apiClient.ts
// Centralized API client with automatic token handling

export interface ApiRequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  isJson?: boolean;
  withCredentials?: boolean;
  timeout?: number;
  skipAuth?: boolean;
}

interface TokenCache {
  token: string | null;
  expiry: number;
}

// Token cache to reduce Clerk API calls
let tokenCache: TokenCache | null = null;
const TOKEN_CACHE_DURATION = 55 * 60 * 1000; // 55 minutes

/**
 * Get auth token from Clerk
 * Handles both client and server environments
 * In development mode with NEXT_PUBLIC_SKIP_AUTH=true, returns null (no auth required)
 */
// async function getAuthToken(): Promise<string | null> {
//   try {
//     // Skip authentication if explicitly disabled
//     if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
//       console.log('[API Client] Authentication skipped - using hardcoded backend user');
//       return null;
//     }

//     // Check cache first (client-side only)
//     if (typeof window !== 'undefined' && tokenCache && Date.now() < tokenCache.expiry) {
//       return tokenCache.token;
//     }

//     // Server-side token retrieval
//     if (typeof window === 'undefined') {
//       // In server components, we need to use Clerk's auth() helper
//       // This would require passing the token from server components
//       // For now, return null and let server components handle auth
//       return null;
//     }

//     // Check if Clerk is available and configured
//     if (typeof window !== 'undefined' && window.Clerk && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
//       const token = await window.Clerk.session?.getToken();

//       // Cache the token on client
//       if (token) {
//         tokenCache = {
//           token,
//           expiry: Date.now() + TOKEN_CACHE_DURATION
//         };
//       }

//       return token || null;
//     }

//     // No Clerk configuration available
//     return null;
//   } catch (error) {
//     console.error('Error getting auth token:', error);
//     return null;
//   }
// }

/**
 * Build full URL with base URL
 */
function buildURL(endpoint: string): string {
  // If endpoint is already a full URL, return as-is
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const baseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_APP_SERVER_URL ||
    "http://localhost:3001";

  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const cleanBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;

  return `${cleanBaseURL}/${cleanEndpoint}`;
}

/**
 * Main API client function
 * Automatically handles token retrieval and attachment
 */
export const apiClient = async <T = any>({
  url,
  method = "GET",
  headers = {},
  body,
  params,
  isJson = true,
  withCredentials = true,
  timeout = 30000,
  skipAuth = true,
}: ApiRequestOptions): Promise<T> => {
  try {
    // Build headers
    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    // Add content type for JSON requests
    if (isJson && body && !requestHeaders["Content-Type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }

    // Add auth token if not skipped
    if (!skipAuth) {
      // const token = await getAuthToken();
      // if (token) {
      //   requestHeaders['Authorization'] = `Bearer ${token}`;
      // }
    }

    // Build URL with query params
    let finalUrl = buildURL(url);
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      finalUrl = queryString ? `${finalUrl}?${queryString}` : finalUrl;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    console.log("finalUrl api call: ", finalUrl);
    try {
      const response = await fetch(finalUrl, {
        method,
        headers: requestHeaders,
        body: body ? (isJson ? JSON.stringify(body) : body) : undefined,
        ...(withCredentials && { credentials: "include" }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch {
          // If error body is not JSON, use default message
        }

        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.response = response;
        throw error;
      }

      // Parse response
      let data: any;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const jsonResponse = await response.json();
        // Handle the { body: data } format from current API
        data =
          jsonResponse.body !== undefined ? jsonResponse.body : jsonResponse;
      } else if (contentType?.includes("text/")) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw error;
    }
  } catch (error: any) {
    console.error("API Call Error:", error.message);
    throw error;
  }
};

// Convenience methods for common HTTP verbs
export const api = {
  get: <T = any>(
    url: string,
    options?: Omit<ApiRequestOptions, "url" | "method">
  ) => apiClient<T>({ ...options, url, method: "GET" }),

  post: <T = any>(
    url: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "url" | "method" | "body">
  ) => apiClient<T>({ ...options, url, method: "POST", body }),

  put: <T = any>(
    url: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "url" | "method" | "body">
  ) => apiClient<T>({ ...options, url, method: "PUT", body }),

  patch: <T = any>(
    url: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "url" | "method" | "body">
  ) => apiClient<T>({ ...options, url, method: "PATCH", body }),

  delete: <T = any>(
    url: string,
    options?: Omit<ApiRequestOptions, "url" | "method">
  ) => apiClient<T>({ ...options, url, method: "DELETE" }),
};

// Clear token cache (useful for logout)
export function clearTokenCache() {
  tokenCache = null;
}

// Export types
export type { ApiRequestOptions as ApiOptions };
