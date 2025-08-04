"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'gradient';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '',
  text
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

// Dots Loading Animation
export function DotsLoader({ 
  size = 'md',
  color = 'primary',
  className = '' 
}: Omit<LoadingSpinnerProps, 'text'>) {
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

// Progress Ring
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

// Pulse Loader
export function PulseLoader({ 
  size = 'md',
  color = 'primary',
  className = '' 
}: Omit<LoadingSpinnerProps, 'text'>) {
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