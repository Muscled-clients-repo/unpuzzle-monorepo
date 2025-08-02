"use client";

import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ApiErrorHandlerProps {
  error: string | Error | null;
  onRetry?: () => void;
  customMessage?: string;
  fullScreen?: boolean;
}

export default function ApiErrorHandler({ 
  error, 
  onRetry, 
  customMessage,
  fullScreen = false 
}: ApiErrorHandlerProps) {
  const errorMessage = customMessage || (
    error instanceof Error ? error.message : error || 'An unexpected error occurred'
  );

  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center p-4"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Error boundary for catching React errors
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ApiErrorHandler 
          error={this.state.error}
          onRetry={() => window.location.reload()}
          fullScreen
        />
      );
    }

    return this.props.children;
  }
}