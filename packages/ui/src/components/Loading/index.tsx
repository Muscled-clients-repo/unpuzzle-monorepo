"use client";

import React from 'react';
import Image from "next/image";

// ============= Base Skeleton Component =============
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%')
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// ============= Loading Spinner Component =============
interface SpinnerProps {
  variant?: 'default' | 'small';
  text?: string;
}

export function Spinner({ variant = "default", text = "Loading" }: SpinnerProps) {
  if (variant === "small") {
    return (
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    );
  }
  return (
    <div className='flex justify-center items-center flex-col h-full'>
      <Image src="/assets/Spinner@1x-1.0s-200px-200px.svg" alt="Loading spinner" width={80} height={80} />
      <p className='text-[#5F6165] text-[16px] font-medium -mt-4'>{text}</p>
    </div>
  );
}

// Aliases for backward compatibility
// Backward compatibility aliases
export const LoadingSpinner = Spinner;
export const LoadingIndicator = Spinner;
export const PageLoadingSpinner = Spinner;

// ============= Content Skeleton Components =============
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <Skeleton variant="rectangular" height={200} className="mb-4" />
      <Skeleton variant="text" height={24} className="mb-2" />
      <Skeleton variant="text" height={16} width="80%" className="mb-2" />
      <Skeleton variant="text" height={16} width="60%" className="mb-4" />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export const RowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton variant="text" height={16} />
        </td>
      ))}
    </tr>
  );
};

// ============= Course Skeleton Components =============
export function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Skeleton variant="rectangular" className="aspect-video" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" height={24} width="75%" />
        <div className="space-y-2">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} width="83%" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton variant="rounded" height={16} width={64} />
          <Skeleton variant="rounded" height={16} width={64} />
          <Skeleton variant="rounded" height={16} width={64} />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton variant="rounded" height={32} width={80} />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-gray-200 to-gray-300">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton variant="text" height={16} width={128} />
              <Skeleton variant="text" height={48} width="75%" />
              <div className="space-y-2">
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width="83%" />
              </div>
              <div className="flex gap-6">
                <Skeleton variant="text" height={16} width={96} />
                <Skeleton variant="text" height={16} width={96} />
                <Skeleton variant="text" height={16} width={96} />
              </div>
              <div className="flex gap-4">
                <Skeleton variant="rounded" height={48} width={160} />
                <Skeleton variant="rounded" height={48} width={48} />
              </div>
            </div>
            <Skeleton variant="rounded" className="aspect-video rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <div className="flex gap-4 border-b pb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={32} width={96} />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton variant="text" height={32} width={192} />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="text" height={16} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <Skeleton variant="text" height={24} width="75%" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={16} />
                ))}
              </div>
              <div className="pt-4 border-t space-y-3">
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" height={40} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton variant="rounded" height={32} width={128} />
            <div className="flex items-center gap-4">
              <Skeleton variant="rounded" height={32} width={80} />
              <Skeleton variant="rounded" height={32} width={80} />
              <Skeleton variant="circular" height={32} width={32} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton variant="text" height={32} width="33%" />
          <Skeleton variant="text" height={16} width="66%" />
          <Skeleton variant="text" height={16} width="50%" />
        </div>
      </div>
    </div>
  );
}

// Backward compatibility aliases
export const ContentCardSkeleton = CardSkeleton;
export const CourseGridSkeleton = GridSkeleton;
export const TableRowSkeleton = RowSkeleton;
export const CourseCardSkeleton = ItemCardSkeleton;
export const CourseListSkeleton = ListSkeleton;
export const CourseDetailSkeleton = DetailPageSkeleton;
export const LayoutSkeleton = PageLayoutSkeleton;

// CSS for shimmer animation (add to your global CSS)
export const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
  background-size: 1000px 100%;
}
`;