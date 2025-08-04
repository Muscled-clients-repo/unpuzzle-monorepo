"use client";

import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'thumbnail';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ 
  variant = 'card', 
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg" 
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.1s'
                  }}
                />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.2s'
                  }}
                />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.3s'
                  }}
                />
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-20"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.4s'
                  }}
                />
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-24"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.5s'
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 h-16 w-16"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite 0.1s'
                  }}
                />
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s ease-in-out infinite 0.2s'
                    }}
                  />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s ease-in-out infinite 0.3s'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite 0.1s'
              }}
            />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/6"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite 0.2s'
              }}
            />
          </div>
        );

      case 'avatar':
        return (
          <div className={`rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 h-12 w-12 ${className}`}
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        );

      case 'thumbnail':
        return (
          <div className={`rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 aspect-video ${className}`}
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {items.map((index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
}

// Course Grid Skeleton
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonLoader variant="card" count={count} />
    </div>
  );
}

// Course List Skeleton
export function CourseListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <SkeletonLoader variant="list" count={count} />
    </div>
  );
}