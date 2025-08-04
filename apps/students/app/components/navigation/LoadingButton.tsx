"use client";

import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loadingText?: string;
  showSpinner?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export function LoadingButton({ 
  children, 
  loadingText = 'Loading...', 
  showSpinner = true,
  onClick,
  disabled,
  className = '',
  ...props 
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      if (onClick) {
        await onClick(e);
      }
    } finally {
      // Only reset if component is still mounted
      setIsLoading(false);
    }
  };

  return (
    <button
      {...props}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          {showSpinner && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}