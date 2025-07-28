import { useMemo } from "react";
type RequestData = {
  body?: any;
  files?: File[];
  headers?: Record<string, string>;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: RequestData;
  signal?: AbortSignal;
};

export class UnpuzzleAiApi {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_CORE_SERVER_URL || "";
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  private async handleRequest(endpoint: string, options: RequestOptions = {}) {
    const { method = "GET", data, signal } = options;
    const url = `${this.apiUrl}${endpoint}`;

    try {
      let requestConfig: RequestInit = {
        method,
        signal,
        headers: {
          ...data?.headers,
        },
      };

      // Handle request body based on content type
      if (data) {
        if (data.files && data.files.length > 0) {
          // Handle multipart form data
          const formData = new FormData();

          // Add files
          data.files.forEach((file, index) => {
            formData.append(`file${index}`, file);
          });

          // Add other data if present
          if (data.body) {
            Object.entries(data.body).forEach(([key, value]) => {
              formData.append(key, value as string);
            });
          }

          requestConfig.body = formData;
        } else if (data.body) {
          // Handle JSON data
          requestConfig.headers = {
            ...requestConfig.headers,
            "Content-Type": "application/json",
          };
          requestConfig.body = JSON.stringify(data.body);
        }
      }

      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      // Return text or blob based on content type
      if (contentType && contentType.includes("text/")) {
        return await response.text();
      }

      return await response.blob();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(endpoint: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.handleRequest(endpoint, { ...options, method: "GET" });
  }

  // POST request
  async post(endpoint: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.handleRequest(endpoint, { ...options, method: "POST" });
  }

  // PUT request
  async put(endpoint: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.handleRequest(endpoint, { ...options, method: "PUT" });
  }

  // DELETE request
  async delete(endpoint: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.handleRequest(endpoint, { ...options, method: "DELETE" });
  }

  // PATCH request
  async patch(endpoint: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.handleRequest(endpoint, { ...options, method: "PATCH" });
  }
}

export function useUnpuzzleAiApi() {
  const api = useMemo(() => new UnpuzzleAiApi(), []);

  return {
    apiUrl: api.getApiUrl(),
    get: api.get.bind(api),
    post: api.post.bind(api),
    put: api.put.bind(api),
    delete: api.delete.bind(api),
    patch: api.patch.bind(api),
  };
}
