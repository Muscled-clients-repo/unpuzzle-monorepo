"use client";

import React from 'react';
import { useSelector } from 'react-redux';

import { CourseContent, type CourseContentProps } from '@/components/content/CourseContent';

/**
 * CourseContent variant for instructors with edit capabilities
 */
export const CourseContentInstructor: React.FC<Omit<CourseContentProps, 'variant'>> = (props) => {
  const { user } = useSelector((state: any) => state.user);
  const userRole = user?.publicMetadata?.privileges || 'student';
  
  return (
    <CourseContent
      {...props}
      variant="instructor"
      userRole={userRole}
      features={{
        allowEdit: true,
        showProgress: true,
        showDuration: true,
        allowVideoNavigation: true,
        showThumbnails: false,
        collapsible: true,
        ...props.features,
      }}
    />
  );
};

export default CourseContentInstructor;