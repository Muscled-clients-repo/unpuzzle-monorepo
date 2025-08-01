import { AuthState } from '../types';

export function createUseAuth<RootState extends { auth: AuthState }>(
  useAppSelector: (selector: (state: RootState) => any) => any
) {
  return () => {
    const auth = useAppSelector((state: RootState) => state.auth);

    return {
      user: auth.user,
      isAuthenticated: !!auth.user,
      isLoading: auth.status === 'loading',
    };
  };
}
