// packages/auth/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getUser } from '../server/getUser';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const userData = await getUser();
      setUser(userData);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};
