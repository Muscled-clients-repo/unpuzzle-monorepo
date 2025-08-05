"use client";

import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface OrderStatusIndicatorProps {
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function OrderStatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = true 
}: OrderStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const statusConfig = {
    pending: {
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Pending Payment'
    },
    paid: {
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Payment Successful'
    },
    failed: {
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Payment Failed'
    },
    cancelled: {
      icon: ExclamationCircleIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: 'Order Cancelled'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
      </div>
      {showLabel && (
        <span className={`font-medium ${config.color} ${textSizeClasses[size]}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}