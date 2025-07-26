'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTimeout, setNavigationTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Clear any existing timeout
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
      setNavigationTimeout(null);
    }
    setIsNavigating(false);
  }, [pathname]);

  const startNavigation = () => {
    setIsNavigating(true);
    
    // Set a timeout to automatically stop navigation after 5 seconds
    // This prevents infinite loading states
    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 5000);
    
    setNavigationTimeout(timeout);
  };

  const stopNavigation = () => {
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
      setNavigationTimeout(null);
    }
    setIsNavigating(false);
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}