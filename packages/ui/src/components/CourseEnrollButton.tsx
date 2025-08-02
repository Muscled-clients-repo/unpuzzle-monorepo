"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface Course {
  id: string;
  title: string;
  price: number;
  enrolled?: boolean;
  [key: string]: any;
}

interface CourseEnrollButtonProps {
  course: Course;
  onEnroll?: (courseId: string) => Promise<{ success: boolean }>;
  className?: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({
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
        // Handle enrollment failure if needed
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

export default CourseEnrollButton;