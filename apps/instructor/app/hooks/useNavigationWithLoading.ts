'use client';

import { useRouter } from 'next/navigation';
import { useNavigation } from '../context/NavigationContext';

export function useNavigationWithLoading() {
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const navigate = (url: string) => {
    startNavigation();
    router.push(url);
  };

  const replace = (url: string) => {
    startNavigation();
    router.replace(url);
  };

  const back = () => {
    startNavigation();
    router.back();
  };

  const forward = () => {
    startNavigation();
    router.forward();
  };

  return {
    navigate,
    replace,
    back,
    forward,
    router,
  };
}