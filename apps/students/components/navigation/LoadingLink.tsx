"use client";

import React from 'react';
import Link from 'next/link';
import { useNavigationLoading } from '@/context/NavigationLoadingContext';

interface LoadingLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

export function LoadingLink({ children, onClick, ...props }: LoadingLinkProps) {
  const { startNavigation } = useNavigationLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    startNavigation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}