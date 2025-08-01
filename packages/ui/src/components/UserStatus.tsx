// apps/student/app/components/UserStatus.tsx

'use client';

import React from 'react';
import { useAuth } from '@unpuzzle/auth';

export const UserStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.first_name}!</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};
