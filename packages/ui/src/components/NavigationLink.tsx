"use client";

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationLinkProps extends Omit<React.ComponentProps<typeof Link>, 'onClick'> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavigationLink({ children, href, onClick, ...props }: NavigationLinkProps) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Check if we have a global navigation loading function
    if (typeof window !== 'undefined' && (window as any).__startNavigation) {
      e.preventDefault();
      (window as any).__startNavigation();
      
      // Small delay to show loading state
      setTimeout(() => {
        router.push(href.toString());
      }, 50);
    }
  }, [href, onClick, router]);

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}