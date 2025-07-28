"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/features/user/userSlice';

export default function UserSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Mock user data since we're removing Clerk authentication
    const userData = {
      id: 'mock-user-id',
      email: 'instructor@example.com',
      firstName: 'Instructor',
      lastName: 'User',
      username: 'instructor',
      imageUrl: '/assets/default-avatar.png',
      publicMetadata: {
        privileges: 'instructor'
      },
    };
    
    // Log for debugging
    console.log('Setting mock user in Redux:', userData);
    
    dispatch(loginSuccess({ 
      user: userData, 
      token: true 
    }));
  }, [dispatch]);

  return null;
}