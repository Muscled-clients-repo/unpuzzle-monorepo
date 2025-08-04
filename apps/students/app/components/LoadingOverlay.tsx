"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  return createPortal(
    <div 
      className="loading-overlay-root fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      style={{ 
        zIndex: 2147483647, // Maximum z-index to ensure it's above everything
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-5"
        style={{ 
          animation: 'fadeIn 0.2s ease-in-out',
          zIndex: 2147483647
        }}
      >
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
          <div 
            className="absolute top-0 left-0 w-24 h-24 border-4 border-t-4 border-blue-600 rounded-full"
            style={{
              animation: 'spin 1s linear infinite',
              borderTopColor: '#2563eb',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent'
            }}
          ></div>
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-bold text-xl mb-2">Loading...</p>
          <p className="text-gray-500 text-sm">Please wait a moment</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}