'use client';

import React from 'react';
import { useOptionalAuth } from '../hooks/useOptionalAuth';
import { useGetUserCreditsQuery, useGetUserByIdQuery } from '../redux/services/credits.services';
import { Coins } from 'lucide-react';

export default function CreditBalance() {
  const { userId } = useOptionalAuth();
  
  // Try to get credits from dedicated endpoint first
  const { data: creditsData, isLoading: creditsLoading, error: creditsError } = useGetUserCreditsQuery(
    userId || '',
    { 
      skip: !userId
    }
  );

  // Fallback to user data if credits endpoint fails
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(
    userId || '',
    { 
      skip: !userId || !creditsError
    }
  );

  if (!userId || (creditsLoading && userLoading)) {
    return null;
  }

  // Get credits from either source
  const credits = creditsData?.availableCredits ?? userData?.availableCredits ?? 0;

  return (
    <div className="flex items-center gap-2 mr-4 px-3 py-2 bg-gray-100 rounded-full">
      <Coins className="w-4 h-4 text-yellow-600" />
      <span className="text-sm font-medium text-gray-700">
        {credits.toLocaleString()} credits
      </span>
    </div>
  );
}