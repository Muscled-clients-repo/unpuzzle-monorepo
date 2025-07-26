/**
 * Base API Service
 * Provides common functionality for all API services
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class BaseApiService {
  protected baseURL: string;
  protected headers: Record<string, string>;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    delete this.headers['Authorization'];
  }

  /**
   * Generic GET request
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic POST request
   */
  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload file
   */
  protected async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const uploadHeaders = { ...this.headers };
    delete uploadHeaders['Content-Type']; // Let browser set multipart boundary

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: data?.message || response.statusText || 'An error occurred',
        status: response.status,
        code: data?.code,
      };
      throw apiError;
    }

    return {
      data: data?.data || data,
      message: data?.message,
      success: true,
      status: response.status,
    };
  }

  /**
   * Handle API errors with retry logic
   */
  protected async withRetry<T>(
    operation: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: ApiError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as ApiError;
        
        // Don't retry on client errors (4xx)
        if (lastError.status >= 400 && lastError.status < 500) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}