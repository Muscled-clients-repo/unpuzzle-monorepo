"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
      className="loading-overlay-root fixed inset-0 bg-gradient-to-br from-blue-950/60 via-purple-950/60 to-indigo-950/60 backdrop-blur-md flex items-center justify-center"
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center gap-8 border border-white/20"
        style={{ 
          animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)',
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