// apps/student/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { createUseAuth } from './createUseAuth';

export const useAuth = createUseAuth<RootState>(useSelector);
