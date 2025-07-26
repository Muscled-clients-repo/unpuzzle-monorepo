"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import type { RootState } from "@/redux/store";
import type { Course, CourseCardProps, UserState } from "@/types/course.types";
import { toggleIndex } from "@/redux/features/selectedCourse/selectedIndexSlice";
import {
  useCreateEnrollMutation,
  useDeleteEnrollMutation,
} from "@/redux/services/enroll.services";

export interface CourseCardMoleculeProps {
  course: Course;
  layout?: 'grid' | 'list';
  index?: number;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
  variant?: 'instructor' | 'student' | 'admin';
}

export const CourseCard: React.FC<CourseCardMoleculeProps> = ({
  course,
  layout = 'grid',
  index = 0,
  onEdit,
  onDelete,
  onEnroll,
  variant = 'student',
}) => {
  const { navigate } = useNavigationWithLoading();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  const [createEnroll] = useCreateEnrollMutation();
  const [deleteEnroll] = useDeleteEnrollMutation();
  
  const { user } = useSelector((state: RootState) => state.user as UserState);
  const selectedIndexes = useSelector((state: RootState) => state.selectedIndex.selectedIndexes);
  
  const isSelected = selectedIndexes.includes(index);
  const isInstructor = variant === 'instructor' || user?.publicMetadata?.privileges === 'admin';
  
  const handleCardClick = () => {
    if (course?.id) {
      dispatch(toggleIndex(index));
      navigate(`${pathname}/${course.id}`);
    }
  };

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Note: The createEnroll mutation might get userId from auth context
      await createEnroll({ courseId: course.id } as any).unwrap();
      onEnroll?.(course.id);
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(course);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      onDelete?.(course.id);
    }
  };

  const cardClasses = [
    "transition-all duration-200 cursor-pointer hover:shadow-lg",
    isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
    layout === 'list' ? "flex-row" : "flex-col"
  ].join(" ");

  return (
    <Card className={cardClasses} onClick={handleCardClick}>
      <div className={`${layout === 'list' ? 'flex' : 'block'} h-full`}>
        {/* Course Thumbnail */}
        <div className={`${layout === 'list' ? 'w-48 flex-shrink-0' : 'w-full'} relative`}>
          <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                <Text size="lg" weight="bold" color="primary" className="text-white">
                  {course.title.charAt(0).toUpperCase()}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className={`${layout === 'list' ? 'flex-1' : 'w-full'} p-4`}>
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {course.title}
            </CardTitle>
          </CardHeader>

          {course.description && (
            <Text 
              variant="caption" 
              className="mt-2 line-clamp-3"
            >
              {course.description}
            </Text>
          )}

          {/* Course Meta */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            {course.duration && (
              <span>{course.duration}</span>
            )}
            {course.category && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {course.category}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            {isInstructor ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;