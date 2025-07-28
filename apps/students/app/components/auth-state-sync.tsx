"use client";
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../redux/features/user/userSlice';

export default function ClerkUserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      try {
        // Sync Clerk user to Redux store - only store essential serializable data
        const userData = {
          id: user.id,
          email: user.emailAddresses?.[0]?.emailAddress || '',
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          username: user.username || null,
          imageUrl: user.imageUrl || '',
          publicMetadata: {
            privileges: user.publicMetadata?.privileges || 'student'
          },
        };
        
        // Syncing Clerk user to Redux
        
        dispatch(loginSuccess({ 
          user: userData, 
          token: true 
        }));
      } catch (error) {
        // Error syncing user, keeping console.error for actual errors
        console.error('Error syncing Clerk user to Redux:', error);
      }
    } else if (isLoaded && !isSignedIn) {
      // User is signed out, clear Redux state
      dispatch(logout());
    }
  }, [isLoaded, isSignedIn, user, dispatch]);

  return null;
}