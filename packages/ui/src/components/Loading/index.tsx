"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from "next/image";

// ============= Base Skeleton Component =============
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'shimmer' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer'
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
    shimmer: 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200',
    none: ''
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
    ...(animation === 'shimmer' && {
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s ease-in-out infinite'
    })
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// ============= Advanced Loading Spinner Component =============
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'gradient';
  className?: string;
  text?: string;
  variant?: 'default' | 'small' | 'spinner' | 'dots' | 'pulse' | 'ring';
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '',
  text,
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const borderSizes = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
    xl: 'border-4'
  };

  const colorClasses = {
    primary: 'border-gray-200 border-t-blue-600',
    white: 'border-gray-300 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
    gradient: 'border-gray-200'
  };

  // Backward compatibility
  if (variant === "small") {
    return (
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    );
  }
  
  if (variant === "default") {
    return (
      <div className='flex justify-center items-center flex-col h-full'>
        <Image src="/assets/Spinner@1x-1.0s-200px-200px.svg" alt="Loading spinner" width={80} height={80} />
        <p className='text-[#5F6165] text-[16px] font-medium -mt-4'>{text || "Loading"}</p>
      </div>
    );
  }

  const isGradient = color === 'gradient';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative">
        {isGradient ? (
          <>
            {/* Gradient spinner with multiple layers */}
            <div 
              className={`${sizeClasses[size]} rounded-full border-2 border-gray-100 absolute`}
            />
            <div 
              className={`${sizeClasses[size]} rounded-full border-2 absolute`}
              style={{
                borderImage: 'linear-gradient(45deg, transparent, #3b82f6, #8b5cf6, transparent) 1',
                borderImageSlice: 1,
                animation: 'spin 1.5s linear infinite',
                filter: 'blur(1px)'
              }}
            />
            <div 
              className={`${sizeClasses[size]} rounded-full border-2`}
              style={{
                borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6) 1',
                borderImageSlice: 1,
                animation: 'spin 1s linear infinite',
                borderTop: '2px solid',
                borderRight: '2px solid transparent',
                borderBottom: '2px solid transparent',
                borderLeft: '2px solid transparent',
                borderTopColor: '#3b82f6'
              }}
            />
          </>
        ) : (
          <div 
            className={`${sizeClasses[size]} ${borderSizes[size]} ${colorClasses[color]} rounded-full animate-spin`}
            style={{
              animationDuration: '0.75s'
            }}
          />
        )}
      </div>
      {text && (
        <span className="text-sm font-medium text-gray-600">{text}</span>
      )}
    </div>
  );
}

// ============= Dots Loading Animation =============
export function DotsLoader({ 
  size = 'md',
  color = 'primary',
  className = '' 
}: Omit<LoadingSpinnerProps, 'text' | 'variant'>) {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3'
  };

  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
    xl: 'gap-2.5'
  };

  const colorMap = {
    primary: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600'
  };

  return (
    <div className={`inline-flex items-center ${gapClasses[size]} ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorMap[color]} rounded-full`}
          style={{
            animation: `dotsPulse 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.16}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dotsPulse {
          0%, 80%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          40% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}

// ============= Progress Ring =============
export function ProgressRing({ 
  progress = 0,
  size = 'md',
  className = '' 
}: {
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = {
    sm: { width: 40, strokeWidth: 3, fontSize: 'text-xs' },
    md: { width: 60, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { width: 80, strokeWidth: 5, fontSize: 'text-base' }
  };

  const { width, strokeWidth, fontSize } = sizeMap[size];
  const radius = (width - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={width}
        height={width}
      >
        {/* Background circle */}
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-blue-600 transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
      </svg>
      <span className={`absolute ${fontSize} font-semibold text-gray-700`}>
        {Math.round(progress)}%
      </span>
    </div>
  );
}

// ============= Pulse Loader =============
export function PulseLoader({ 
  size = 'md',
  color = 'primary',
  className = '' 
}: Omit<LoadingSpinnerProps, 'text' | 'variant'>) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorMap = {
    primary: 'bg-blue-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div 
        className={`absolute inset-0 ${colorMap[color]} rounded-full opacity-75`}
        style={{
          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}
      />
      <div className={`relative ${sizeClasses[size]} ${colorMap[color]} rounded-full`} />
    </div>
  );
}

// ============= Loading Overlay =============
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Loading", 
  subMessage = "Please wait a moment" 
}: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Animate dots
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!mounted || !isVisible) {
    return null;
  }

  return createPortal(
    <div 
      className="loading-overlay-root fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div 
        className="backdrop-blur-lg rounded-3xl p-12 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.4)] flex flex-col items-center gap-8 border border-gray-200"
        style={{ 
          animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          zIndex: 2147483647,
          minWidth: '320px'
        }}
      >
        {/* Modern Animated Loader */}
        <div className="relative">
          {/* Outer ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              width: '120px',
              height: '120px',
              background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.1))',
              animation: 'rotate 3s linear infinite'
            }}
          />
          
          {/* Middle ring */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: 'conic-gradient(from 180deg, transparent, rgba(99, 102, 241, 0.2))',
              animation: 'rotate 2s linear infinite reverse'
            }}
          />
          
          {/* Inner spinning ring */}
          <div className="relative w-30 h-30 p-2">
            <div className="w-28 h-28 rounded-full border-4 border-gray-100"></div>
            <div 
              className="absolute top-2 left-2 w-28 h-28 rounded-full border-4"
              style={{
                borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6) 1',
                borderImageSlice: 1,
                animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                borderTop: '4px solid',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: '4px solid transparent',
                borderTopColor: '#3b82f6',
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))'
              }}
            />
            
            {/* Center icon/pulse */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <div 
                className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
                style={{
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <p className="text-gray-900 font-semibold text-2xl tracking-tight flex items-center gap-1">
            {message}
            <span className="inline-block w-12 text-left text-blue-600">{dots}</span>
          </p>
          <p className="text-gray-500 text-sm font-medium">{subMessage}</p>
          
          {/* Progress indicator */}
          <div className="mt-4 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
              style={{
                width: '40%',
                animation: 'shimmer 1.5s ease-in-out infinite',
                backgroundSize: '200% 100%'
              }}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.9);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

// Aliases for backward compatibility
export const Spinner = LoadingSpinner;
export const LoadingIndicator = LoadingSpinner;
export const PageLoadingSpinner = LoadingSpinner;

// ============= Advanced Skeleton Loader =============
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
    </>
  );
}

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