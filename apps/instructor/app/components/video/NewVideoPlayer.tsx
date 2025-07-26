"use client";

import React from 'react';

import { VideoPlayerInstructor } from '@/components/features/video/VideoPlayerInstructor';

/**
 * Legacy NewVideoPlayer component for Videos screen
 * Now uses the unified VideoPlayer organism with instructor variant
 */
const NewVideoPlayer: React.FC = () => {
  return (
    <VideoPlayerInstructor
      videoUrl="/assets/WeAreGoingOnBullrun.mp4"
      videoType="local"
      controls={true}
      features={{
        quizzes: true,
        timeline: true,
        playbackSpeed: true,
        fullscreen: true,
      }}
    />
  );
};

export default NewVideoPlayer;