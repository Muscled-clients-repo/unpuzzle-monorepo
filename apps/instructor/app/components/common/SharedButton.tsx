"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

interface SharedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const SharedButton: React.FC<SharedButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  return (
    <Button variant={variant} size={size} {...props}>
      {children}
    </Button>
  );
};

export default SharedButton;