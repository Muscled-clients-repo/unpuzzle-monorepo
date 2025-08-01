// apps/student/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState, useEffect } from 'react';
import { getUser } from '@unpuzzle/auth/src/client/getUser';
import { User } from '@unpuzzle/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        setIsLoading(true);
        const userData = await getUser();
        setUser(userData);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};