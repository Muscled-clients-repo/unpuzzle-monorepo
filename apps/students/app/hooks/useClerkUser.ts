import { useUser, useAuth } from '@clerk/nextjs';

export function useClerkUser() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();

  return {
    user,
    isLoaded: userLoaded && authLoaded,
    isSignedIn,
    getToken,
  };
} 