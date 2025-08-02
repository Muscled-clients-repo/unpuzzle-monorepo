"use client";

import React, { useState } from 'react';
import { Check, User, Mail, BookOpen, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './Dialog';

interface EnrollmentFeatureProps {
  // Course data (optional for standalone mode)
  course?: {
    id: string;
    title: string;
    price?: number;
    enrolled?: boolean;
  };
  // Callback for enrollment (optional for standalone mode)
  onEnroll?: (courseId: string, formData?: { fullName: string; email: string }) => Promise<{ success: boolean; message?: string }>;
  // UI customization
  variant?: 'primary' | 'secondary' | 'standalone';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  // Messages
  buttonText?: string;
  confirmationMessage?: string;
  // Standalone mode
  selfContained?: boolean;
}

const EnrollmentFeature: React.FC<EnrollmentFeatureProps> = ({
  course,
  onEnroll,
  variant = 'standalone',
  fullWidth = true,
  size = 'md',
  buttonText,
  confirmationMessage = 'Congratulations! You are now enrolled in this course.',
  selfContained = true
}) => {
  const [isEnrolled, setIsEnrolled] = useState(course?.enrolled || false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ fullName: '', email: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (onEnroll && course) {
        // Use provided enrollment function - try with formData first, fallback to courseId only
        let result;
        try {
          result = await onEnroll(course.id, formData);
        } catch (error) {
          // Fallback for functions that only accept courseId
          result = await onEnroll(course.id);
        }
        
        if (result && result.success) {
          setIsEnrolled(true);
          setIsModalOpen(false);
        } else {
          // Handle enrollment failure gracefully
          console.warn('Enrollment was not successful:', result);
          // Could show an error message to user here
        }
      } else {
        // Standalone mode - just set enrolled state
        setIsEnrolled(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      // Handle errors gracefully without throwing
      console.warn('Enrollment process encountered an issue:', error);
      // Could show an error message to user here
    } finally {
      setIsLoading(false);
      setFormData({ fullName: '', email: '' });
    }
  };

  // Dynamic button text
  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (course?.price === 0) return 'Enroll for Free';
    if (course?.price) return `Enroll Now - $${course.price}`;
    return 'Enroll Now';
  };

  // Size variants
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Variant styles
  const getButtonStyles = () => {
    const baseClasses = `font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
      fullWidth ? 'w-full' : ''
    } ${sizeClasses[size]}`;

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`;
      case 'secondary':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg`;
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`;
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : 'w-full max-w-md mx-auto'}>
      {!isEnrolled ? (
        // Enroll Now Button
        <button
          onClick={handleOpenModal}
          className={getButtonStyles()}
          disabled={isLoading}
        >
          <BookOpen className={iconSizes[size]} />
          {getButtonText()}
        </button>
      ) : (
        // Confirmation Message or Continue Learning Button
        course?.id ? (
          <button
            onClick={() => window.location.href = `/courses/${course.id}/learn`}
            className={`${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
          >
            <Check className={iconSizes[size]} />
            <span>Continue Learning</span>
            <ArrowRight className={iconSizes[size]} />
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Congratulations!
            </h3>
            <p className="text-green-700">
              {confirmationMessage}
            </p>
          </div>
        )
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Enroll in Course
            </DialogTitle>
          </DialogHeader>

          {/* Enrollment Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enrolling...</span>
                  </>
                ) : (
                  'Complete Enrollment'
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnrollmentFeature;