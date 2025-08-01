// packages/auth/src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
