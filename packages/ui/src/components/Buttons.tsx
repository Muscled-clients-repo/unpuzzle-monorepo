"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@unpuzzle/auth';

// ============= Button Component =============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "text-sm w-full p-2 py-1 px-4 rounded border transition-colors duration-200";

  const variantClasses =
    variant === "solid"
      ? "bg-[#1D1D1D] text-white hover:bg-white hover:text-[#1D1D1D] border-[#1D1D1D] hover:border-[#1D1D1D]"
      : "bg-transparent text-[#1D1D1D] hover:bg-[#1D1D1D] hover:text-white border-[#1D1D1D] hover:border-transparent";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Aliases for backward compatibility
export const BaseButton = Button;
export const SharedButton = Button;

// ============= Enrollment Button Component =============
interface Course {
  id: string;
  title: string;
  price: number;
  enrolled?: boolean;
  [key: string]: any;
}

interface EnrollmentButtonProps {
  course: Course;
  onEnroll?: (courseId: string) => Promise<{ success: boolean }>;
  className?: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({
  course,
  onEnroll,
  className = "",
  variant = "primary",
  fullWidth = false,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!onEnroll || course.enrolled) return;

    setIsEnrolling(true);
    try {
      const result = await onEnroll(course.id);
      if (!result.success) {
        console.error("Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const baseClasses = `
    group px-8 py-4 font-bold rounded-xl transition-all 
    disabled:opacity-50 disabled:cursor-not-allowed 
    shadow-xl hover:shadow-2xl transform hover:scale-105
  `;

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
  };

  const widthClass = fullWidth ? "w-full" : "";

  if (course.enrolled) {
    return (
      <Link 
        href={`/course-video/${course.id}`}
        className={`
          ${baseClasses} 
          ${variantClasses[variant]} 
          ${widthClass} 
          ${className}
          cursor-pointer inline-flex items-center justify-center gap-2
        `}
      >
        Continue Learning 
        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isEnrolling}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${widthClass} 
        ${className}
        cursor-pointer
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {isEnrolling ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            Enroll for ${course.price} 
            <SparklesIcon className="w-5 h-5" />
          </>
        )}
      </span>
    </button>
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