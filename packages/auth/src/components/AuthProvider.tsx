import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '../redux/authSlice';
import { getUser } from '../server/getUser';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUser() {
      const user = await getUser();
      dispatch(hydrateAuth(user));
    }
    loadUser();
  }, []);

  return <>{children}</>;
};
