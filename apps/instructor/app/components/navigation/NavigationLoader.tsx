'use client';

import { useNavigation } from '../../context/NavigationContext';
import { useEffect, useState } from 'react';

export function NavigationLoader() {
  const { isNavigating } = useNavigation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      // Small delay to prevent flashing on fast navigations
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isNavigating]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {/* Spinner Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Animated Logo or Spinner */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00AFF0] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#FF006E] animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-[#8B5CF6] animate-spin [animation-duration:2s]"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center">
            <p className="text-white text-lg font-medium mb-2">Loading...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-[#00AFF0] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#FF006E] rounded-full animate-pulse [animation-delay:200ms]"></div>
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse [animation-delay:400ms]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}