"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingOverlay } from '@unpuzzle/ui';

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Reset navigation state when route changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const startNavigation = useCallback(() => {
    console.log('Starting navigation...');
    setIsNavigating(true);
  }, []);

  const stopNavigation = useCallback(() => {
    console.log('Stopping navigation...');
    setIsNavigating(false);
  }, []);

  // Expose globally for Header component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__startNavigation = startNavigation;
      (window as any).__stopNavigation = stopNavigation;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__startNavigation;
        delete (window as any).__stopNavigation;
      }
    };
  }, [startNavigation, stopNavigation]);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
      <LoadingOverlay isVisible={isNavigating} />
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider');
  }
  return context;
}