"use client";

import React from 'react';

import { VideoPlayer, type VideoPlayerProps } from '@/components/content/VideoPlayer';

/**
 * VideoPlayer variant for instructors with full annotation and quiz capabilities
 */
export const VideoPlayerInstructor: React.FC<Omit<VideoPlayerProps, 'variant'>> = (props) => {
  return (
    <VideoPlayer
      {...props}
      variant="instructor"
      features={{
        annotations: true,
        quizzes: true,
        timeline: true,
        playbackSpeed: true,
        fullscreen: true,
        pictureInPicture: true,
        chapters: true,
        ...props.features,
      }}
    />
  );
};

export default VideoPlayerInstructor;