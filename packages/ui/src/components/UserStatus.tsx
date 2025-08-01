'use client';
import { useAuth } from '@unpuzzle/auth';

export const UserStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm font-medium">
              {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-900">
            Welcome, {user.first_name || 'User'}!
          </p>
          <p className="text-xs text-green-600 truncate">
            {user.email}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">Not authenticated</p>
        <p className="text-xs text-gray-500">Please sign in to continue</p>
      </div>
    </div>
  );
};
