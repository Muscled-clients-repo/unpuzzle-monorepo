"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@unpuzzle/auth';

// ============= Professional Button Component =============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs font-medium",
    sm: "px-3 py-2 text-sm font-medium",
    md: "px-4 py-2.5 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
    xl: "px-8 py-4 text-lg font-bold"
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  };

  const variantClasses = {
    primary: "!bg-blue-600 !text-white hover:!bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl border-0",
    secondary: "!bg-gray-600 !text-white hover:!bg-gray-700 focus:ring-gray-500 shadow-lg hover:shadow-xl border-0",
    success: "!bg-green-600 !text-white hover:!bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl border-0",
    danger: "!bg-red-600 !text-white hover:!bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl border-0",
    warning: "!bg-yellow-500 !text-white hover:!bg-yellow-600 focus:ring-yellow-500 shadow-lg hover:shadow-xl border-0",
    info: "!bg-cyan-600 !text-white hover:!bg-cyan-700 focus:ring-cyan-500 shadow-lg hover:shadow-xl border-0",
    light: "!bg-gray-100 !text-gray-900 hover:!bg-gray-200 focus:ring-gray-300 shadow-md hover:shadow-lg border border-gray-300",
    dark: "!bg-gray-900 !text-white hover:!bg-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl border-0",
    outline: "!bg-transparent !text-blue-600 hover:!bg-blue-600 hover:!text-white focus:ring-blue-500 border-2 border-blue-600 shadow-sm hover:shadow-md",
    ghost: "!bg-transparent !text-gray-600 hover:!bg-gray-100 hover:!text-gray-900 focus:ring-gray-300 border-0 shadow-none hover:shadow-sm"
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className={`animate-spin ${iconSizes[size]} mr-2`} viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={`${iconSizes[size]} mr-2 flex-shrink-0`}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className={`${iconSizes[size]} ml-2 flex-shrink-0`}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Aliases for backward compatibility
export const BaseButton = Button;
export const SharedButton = Button;

// ============= Professional Enrollment Button Component =============
interface Course {
  id: string;
  title: string;
  price: number;
  enrolled?: boolean;
  [key: string]: any;
}

interface EnrollmentButtonProps {
  course: Course;
  onEnroll?: (courseId: string) => Promise<{ success: boolean; message?: string }>;
  onCheckout?: () => void;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({
  course,
  onEnroll,
  onCheckout,
  className = "",
  size = "lg",
  fullWidth = false,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!onEnroll || course.enrolled) return;

    setIsEnrolling(true);
    try {
      const result = await onEnroll(course.id);
      if (!result.success) {
        console.warn("Enrollment was not successful:", result);
      }
    } catch (error) {
      console.warn("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  // If enrolled, show success button with enrolled status
  if (course.enrolled) {
    return (
      <Button
        variant="success"
        size={size}
        fullWidth={fullWidth}
        className={className}
        disabled={true}
        icon={<CheckCircleIcon />}
        iconPosition="left"
      >
        Enrolled - Full Access
      </Button>
    );
  }

  // If free course, show enrollment button
  if (course.price === 0) {
    return (
      <Button
        variant="success"
        size={size}
        fullWidth={fullWidth}
        className={className}
        onClick={handleEnroll}
        loading={isEnrolling}
        icon={<SparklesIcon />}
        iconPosition="right"
      >
        Enroll for Free
      </Button>
    );
  }

  // If paid course, show checkout button
  return (
    <Button
      variant="primary"
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={handleCheckout}
      icon={<ArrowRightIcon />}
      iconPosition="right"
    >
      Buy Now - ${course.price}
    </Button>
  );
};

// ============= Pollable Enrollment Button Component =============
interface PollableEnrollmentButtonProps {
  course: Course;
  onEnroll?: (courseId: string) => Promise<{ success: boolean; message?: string }>;
  onCheckout?: () => void;
  refetch?: () => Promise<any>;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export const PollableEnrollmentButton: React.FC<PollableEnrollmentButtonProps> = ({
  course,
  onEnroll,
  onCheckout,
  refetch,
  className = "",
  size = "lg",
  fullWidth = false,
}) => {
  const [localCourse, setLocalCourse] = useState(course);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0);

  // Check if we recently returned from checkout
  useEffect(() => {
    const checkForRecentPurchase = () => {
      const recentPurchase = sessionStorage.getItem(`recent_purchase_${course.id}`);
      if (recentPurchase && refetch) {
        sessionStorage.removeItem(`recent_purchase_${course.id}`);
        
        pollCountRef.current = 0;
        pollIntervalRef.current = setInterval(async () => {
          pollCountRef.current++;
          
          const result = await refetch();
          if (result && result.data && result.data.enrolled) {
            setLocalCourse(result.data);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }
          
          if (pollCountRef.current >= 10) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }
        }, 3000);
      }
    };

    checkForRecentPurchase();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [course.id, refetch]);

  useEffect(() => {
    setLocalCourse(course);
  }, [course]);

  const handleEnrollment = async (courseId: string) => {
    sessionStorage.setItem(`recent_purchase_${courseId}`, 'true');
    if (onEnroll) {
      return onEnroll(courseId);
    }
    return { success: false };
  };

  const handleCheckout = () => {
    sessionStorage.setItem(`recent_purchase_${course.id}`, 'true');
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <EnrollmentButton
      course={localCourse}
      onEnroll={handleEnrollment}
      onCheckout={handleCheckout}
      className={className}
      size={size}
      fullWidth={fullWidth}
    />
  );
};

// ============= Back Button Component =============
export const BackButton: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      aria-label="Go back"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      Back
    </button>
  );
};

// Aliases for backward compatibility
export const NavigationBackButton = BackButton;
export const GoBack = BackButton;

// ============= Icon Button Component =============
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  const variantClasses = {
    primary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
    secondary: "text-white bg-blue-600 hover:bg-blue-700",
    ghost: "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
    danger: "text-white bg-red-600 hover:bg-red-700"
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
};

// ============= Action Button Component =============
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-md transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon && iconPosition === "left" ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      
      {children}
      
      {!loading && icon && iconPosition === "right" ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </button>
  );
};

// ============= Profile Button Component =============
export const ProfileButton = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isSidebarOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <button onClick={()=>window.location.href="/sign-in"} className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Sign In
        </button>
        <button onClick={()=>window.location.href="/sign-in"} className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        aria-label="User menu"
      >
        {user?.image_url ? (
          <img
            src={user.image_url}
            alt={user.first_name || 'User'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
        >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 px-6 py-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="w-24 h-24 mb-4">
                {user?.image_url ? (
                  <img
                    src={user.image_url}
                    alt={user.first_name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-medium">
                      {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.first_name || 'User'}
              </h3>

              {/* Email */}
              <p className="text-sm text-gray-600 mb-4">{user?.email}</p>

              {/* Role Badge */}
              {user?.role && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              )}

              {/* User Details */}
              <div className="w-full space-y-4 mb-8">
                {user?.id && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">User ID</span>
                    <span className="text-sm font-medium text-gray-900">{user.id}</span>
                  </div>
                )}
                {user?.created_at && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Member since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={()=>window.location.href="/api/user-auth/logout"}
              className="cursor-pointer w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        </div>
      )}
    </>
  );
};

// Aliases for backward compatibility
export const CourseEnrollButton = EnrollmentButton;
export const UserButton = ProfileButton;


// Export default for backward compatibility
export default Button;