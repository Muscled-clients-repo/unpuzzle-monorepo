// Common type definitions to replace 'any' usage

// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched?: boolean;
}

// Event handler types
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
export type ClickHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Replace common 'any' patterns
export type AnyObject = Record<string, unknown>;
export type AnyArray = unknown[];
export type AnyFunction = (...args: unknown[]) => unknown;

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

// Redux types
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// File types
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

// Time/Date types
export type Timestamp = number;
export type DateString = string;
export type Duration = number; // in seconds

// Media types
export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Filter types
export interface FilterParams {
  search?: string;
  category?: string;
  tags?: string[];
  dateFrom?: DateString;
  dateTo?: DateString;
}