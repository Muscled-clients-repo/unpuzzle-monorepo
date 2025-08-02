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
  const baseClasses = 'bg-gray-200 dark:bg-gray-650';
  
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

// ============= Home Page Section Skeletons =============
export const HeroSectionSkeleton: React.FC = () => {
  return (
    <section className="relative bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Main Heading - matches text-4xl lg:text-5xl */}
            <Skeleton variant="text" height={56} width="85%" className="mb-6" />
            
            {/* Description - matches text-lg lg:text-xl with 2 lines */}
            <div className="mb-8 space-y-2">
              <Skeleton variant="text" height={24} width="100%" />
              <Skeleton variant="text" height={24} width="95%" />
              <Skeleton variant="text" height={24} width="80%" />
            </div>
            
            {/* Search Bar - matches exact size px-6 py-4 */}
            <div className="mb-8">
              <Skeleton variant="rounded" height={64} className="w-full border border-gray-300" />
            </div>
            
            {/* CTA Buttons - matches exact layout flex-col sm:flex-row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Skeleton variant="rounded" height={48} width={140} />
              <Skeleton variant="rounded" height={48} width={160} />
            </div>
            
            {/* Trust Indicators - matches exact layout with dividers */}
            <div className="flex items-center gap-8">
              <div>
                <Skeleton variant="text" height={32} width={56} className="mb-1" />
                <Skeleton variant="text" height={16} width={96} />
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <Skeleton variant="text" height={32} width={56} className="mb-1" />
                <Skeleton variant="text" height={16} width={116} />
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <Skeleton variant="text" height={32} width={56} className="mb-1" />
                <Skeleton variant="text" height={16} width={96} />
              </div>
            </div>
          </div>
          
          {/* Right Image - matches exact styling */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <Skeleton variant="rounded" width={600} height={400} className="rounded-2xl" />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-70 -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-70 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSectionSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton variant="text" height={36} width={400} className="mx-auto mb-12 text-center" />
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center">
              <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-4" />
              <Skeleton variant="text" height={24} width={180} className="mx-auto mb-2" />
              <div className="space-y-2">
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width="90%" className="mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StatsSectionSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton variant="text" height={48} width={120} className="mx-auto mb-2" />
              <Skeleton variant="text" height={20} width={140} className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CoursePreviewSectionSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton variant="text" height={36} width={300} className="mx-auto mb-12 text-center" />
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton variant="rectangular" height={192} />
              <div className="p-6">
                <Skeleton variant="text" height={24} className="mb-2" />
                <Skeleton variant="text" height={16} width={150} className="mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton variant="text" height={16} width={120} />
                  <Skeleton variant="text" height={16} width={80} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton variant="text" height={32} width={80} />
                  <Skeleton variant="text" height={16} width={120} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Skeleton variant="text" height={20} width={180} className="mx-auto" />
        </div>
      </div>
    </section>
  );
};

export const CTASectionSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton variant="text" height={36} width={400} className="mx-auto mb-4 bg-blue-400 bg-opacity-80" />
          <div className="space-y-2 mb-8">
            <Skeleton variant="text" height={20} width={500} className="mx-auto bg-blue-400 bg-opacity-80" />
            <Skeleton variant="text" height={20} width={300} className="mx-auto bg-blue-400 bg-opacity-80" />
          </div>
          <div className="flex gap-4 justify-center">
            <Skeleton variant="rounded" height={48} width={160} className="bg-blue-400 bg-opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSectionSkeleton />
      <FeaturesSectionSkeleton />
      <StatsSectionSkeleton />
      <CoursePreviewSectionSkeleton />
      <CTASectionSkeleton />
    </div>
  );
};

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
  background: linear-gradient(to right, #f3f4f6 4%, #e5e7eb 25%, #f3f4f6 36%);
  background-size: 1000px 100%;
}
`;