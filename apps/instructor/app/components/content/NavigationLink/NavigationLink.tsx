'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/context/NavigationContext';
import { ComponentProps, MouseEvent } from 'react';

type NavigationLinkProps = ComponentProps<typeof Link>;

export function NavigationLink({ onClick, href, ...props }: NavigationLinkProps) {
  const { startNavigation } = useNavigation();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Get the target URL
    const targetUrl = typeof href === 'string' ? href : href?.pathname || '';
    
    // Don't show loading if clicking on the current page
    if (targetUrl === pathname) {
      if (onClick) {
        onClick(e);
      }
      return;
    }

    startNavigation();
    if (onClick) {
      onClick(e);
    }
  };

  return <Link href={href} {...props} onClick={handleClick} />;
}