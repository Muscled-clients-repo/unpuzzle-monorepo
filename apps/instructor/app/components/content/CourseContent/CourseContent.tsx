"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

import type { Video } from '@/types/videos.types';

// Unified interfaces for all CourseContent variants
export interface CourseVideo extends Partial<Video> {
  id?: string;
  title: string;
  duration: number;
  thumbnail?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface CourseModule {
  id?: string;
  title: string;
  videos: CourseVideo[];
  isExpanded?: boolean;
  completedCount?: number;
}

export interface CourseContentProps {
  // Data props
  modules?: CourseModule[];
  courseId?: string;
  
  // Behavior props
  variant?: 'instructor' | 'student' | 'moderator' | 'editor';
  userRole?: string;
  
  // Feature flags
  features?: {
    allowEdit?: boolean;
    showProgress?: boolean;
    showDuration?: boolean;
    allowVideoNavigation?: boolean;
    showThumbnails?: boolean;
    collapsible?: boolean;
  };
  
  // Event handlers
  onVideoClick?: (video: CourseVideo, moduleId?: string) => void;
  onModuleToggle?: (moduleId: string, isExpanded: boolean) => void;
  onEditVideo?: (video: CourseVideo) => void;
  onDeleteVideo?: (videoId: string) => void;
  
  // Styling
  className?: string;
  compact?: boolean;
}

const DEFAULT_MODULES: CourseModule[] = [
  {
    id: 'module-1',
    title: 'WordPress Basic & Domain Hosting explained',
    isExpanded: true,
    videos: [
      {
        id: 'video-1',
        title: 'How to install WordPress (domain-hosting explained)',
        duration: 1770, // 29:30 in seconds
        isCompleted: true,
      },
      {
        id: 'video-2',  
        title: 'Domain setup and DNS configuration',
        duration: 1200,
        isCompleted: false,
      },
      {
        id: 'video-3',
        title: 'WordPress dashboard overview',
        duration: 900,
        isCompleted: false,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Web Designing basic to advance (learn from scratch)',
    isExpanded: false,
    videos: [
      {
        id: 'video-4',
        title: 'Introduction to web design principles',
        duration: 1500,
        isCompleted: false,
      },
      {
        id: 'video-5',
        title: 'Color theory and typography',
        duration: 1800,
        isCompleted: false,
      },
    ],
  },
];

const DEFAULT_FEATURES = {
  allowEdit: false,
  showProgress: true,
  showDuration: true,
  allowVideoNavigation: true,
  showThumbnails: false,
  collapsible: true,
};

export const CourseContent: React.FC<CourseContentProps> = ({
  modules = DEFAULT_MODULES,
  courseId,
  variant = 'student',
  userRole,
  features = DEFAULT_FEATURES,
  onVideoClick,
  onModuleToggle,
  onEditVideo,
  onDeleteVideo,
  className = '',
  compact = false,
}) => {
  const [localModules, setLocalModules] = useState<CourseModule[]>(modules);
  
  // Determine permissions based on variant and userRole
  const canEdit = features.allowEdit || 
    variant === 'instructor' || 
    userRole === 'admin' || 
    userRole === 'teacher';
  
  const isModerator = variant === 'moderator' || userRole === 'moderator';

  // Helper function to format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle module toggle
  const handleModuleToggle = (moduleId: string) => {
    if (!features.collapsible) return;
    
    setLocalModules(prev => 
      prev.map(module => {
        if (module.id === moduleId) {
          const newExpanded = !module.isExpanded;
          onModuleToggle?.(moduleId, newExpanded);
          return { ...module, isExpanded: newExpanded };
        }
        return module;
      })
    );
  };

  // Handle video click
  const handleVideoClick = (video: CourseVideo, moduleId?: string) => {
    if (!features.allowVideoNavigation) return;
    onVideoClick?.(video, moduleId);
  };

  // Calculate module progress
  const getModuleProgress = (module: CourseModule): number => {
    if (!features.showProgress) return 0;
    const completed = module.videos.filter(v => v.isCompleted).length;
    return Math.round((completed / module.videos.length) * 100);
  };

  // Get total module duration
  const getModuleDuration = (module: CourseModule): number => {
    return module.videos.reduce((total, video) => total + video.duration, 0);
  };

  return (
    <div className={`course-content ${className} ${compact ? 'compact' : ''}`}>
      {localModules.map((module, moduleIndex) => (
        <div
          key={module.id || moduleIndex}
          className={`module-container ${compact ? 'mb-4' : 'mb-6'} border border-gray-200 rounded-lg overflow-hidden`}
        >
          {/* Module Header */}
          <div
            className={`module-header p-4 bg-gray-50 cursor-pointer flex items-center justify-between ${
              !features.collapsible ? 'cursor-default' : 'hover:bg-gray-100'
            }`}
            onClick={() => features.collapsible && handleModuleToggle(module.id || moduleIndex.toString())}
          >
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {module.title}
              </h3>
              {features.showProgress && (
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span>{getModuleProgress(module)}% Complete</span>
                  {features.showDuration && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{formatDuration(getModuleDuration(module))}</span>
                    </>
                  )}
                  <span className="mx-2">•</span>
                  <span>{module.videos.length} videos</span>
                </div>
              )}
            </div>
            {features.collapsible && (
              <div className="ml-4">
                {module.isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            )}
          </div>

          {/* Module Videos */}
          {(module.isExpanded !== false || !features.collapsible) && (
            <div className="module-videos">
              {module.videos.map((video, videoIndex) => (
                <div
                  key={video.id || videoIndex}
                  className={`video-item border-t border-gray-100 ${
                    features.allowVideoNavigation ? 'hover:bg-gray-50 cursor-pointer' : ''
                  } ${compact ? 'p-3' : 'p-4'}`}
                  onClick={() => handleVideoClick(video, module.id)}
                >
                  <div className="flex items-center">
                    {/* Video Thumbnail/Icon */}
                    <div className={`flex-shrink-0 ${compact ? 'mr-3' : 'mr-4'}`}>
                      {features.showThumbnails && video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          width={compact ? 40 : 60}
                          height={compact ? 30 : 45}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-blue-100 rounded-full flex items-center justify-center`}>
                          {video.isCompleted ? (
                            <svg className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Video Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} ${video.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {video.title}
                      </h4>
                      {features.showDuration && (
                        <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
                          {formatDuration(video.duration)}
                          {video.isLocked && <span className="ml-2 text-yellow-600">🔒</span>}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {canEdit && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditVideo?.(video);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteVideo?.(video.id || '');
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Empty State */}
      {localModules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
          <p className="text-gray-600">Course content will appear here once modules are added.</p>
        </div>
      )}
    </div>
  );
};

export default CourseContent;