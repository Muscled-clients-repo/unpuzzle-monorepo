"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/app/context/NavigationLoadingContext';

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  useEffect(() => {
    // Intercept all navigation clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.target && !link.download) {
        const url = new URL(link.href);
        
        // Check if it's an internal navigation
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          e.preventDefault();
          console.log('Navigation intercepted:', url.pathname);
          startNavigation();
          router.push(url.pathname + url.search + url.hash);
        }
      }
    };

    // Add click listener to capture navigation
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname, router, startNavigation]);

  return <>{children}</>;
}