'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Course, Chapter, Video } from '../../types/course.types';
import { useYoutubePlayerContext } from '../../context/YoutubePlayerContext';

interface CourseDetailPageProps {
  course: Course;
  loading?: boolean;
}

interface CurrentVideo {
  video: Video;
  chapter: Chapter;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ 
  course, 
  loading = false 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentVideo, setCurrentVideo] = useState<CurrentVideo | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  const youtubePlayer = useYoutubePlayerContext();

  // Get sorted chapters and videos
  const sortedChapters = useMemo(() => {
    if (!course?.chapters) return [];
    
    return [...course.chapters]
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(chapter => ({
        ...chapter,
        videos: [...chapter.videos].sort((a, b) => {
          // If videos have order_index, use it, otherwise maintain original order
          const aOrder = (a as any).order_index || 0;
          const bOrder = (b as any).order_index || 0;
          return aOrder - bOrder;
        })
      }));
  }, [course?.chapters]);

  // Get first video from first chapter as default
  const defaultVideo = useMemo(() => {
    if (sortedChapters.length === 0) return null;
    
    const firstChapter = sortedChapters[0];
    if (firstChapter.videos.length === 0) return null;
    
    return {
      video: firstChapter.videos[0],
      chapter: firstChapter
    };
  }, [sortedChapters]);

  // Get total video count
  const totalVideos = useMemo(() => {
    return sortedChapters.reduce((total, chapter) => total + chapter.videos.length, 0);
  }, [sortedChapters]);

  // Initialize current video based on URL params or default
  useEffect(() => {
    if (!sortedChapters.length || !defaultVideo) return;

    const chapterIdParam = searchParams.get('chapter_id');
    const videoIdParam = searchParams.get('video_id');

    if (chapterIdParam && videoIdParam) {
      // Find specific video from URL params
      const targetChapter = sortedChapters.find(ch => ch.id === chapterIdParam);
      if (targetChapter) {
        const targetVideo = targetChapter.videos.find(v => v.id === videoIdParam);
        if (targetVideo) {
          setCurrentVideo({
            video: targetVideo,
            chapter: targetChapter
          });
          return;
        }
      }
    }

    // Fall back to default video
    setCurrentVideo(defaultVideo);
    
    // Update URL to reflect default video
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('chapter_id', defaultVideo.chapter.id);
    newSearchParams.set('video_id', defaultVideo.video.id);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [sortedChapters, defaultVideo, searchParams, router]);

  // Initialize YouTube player when video changes
  useEffect(() => {
    if (!currentVideo?.video?.yt_video_id) return;

    const initPlayer = async () => {
      try {
        setPlayerReady(false);
        await youtubePlayer.initializePlayer('youtube-player', {
          yt_video_id: currentVideo.video.yt_video_id,
          start_time: currentVideo.video.start_time || 0,
          end_time: currentVideo.video.end_time || 0,
          id: currentVideo.video.id
        });
        setPlayerReady(true);
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    initPlayer();
  }, [currentVideo, youtubePlayer]);

  // Handle video selection
  const handleVideoSelect = (video: Video, chapter: Chapter) => {
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('chapter_id', chapter.id);
    newSearchParams.set('video_id', video.id);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });

    // Update current video
    setCurrentVideo({ video, chapter });
  };

  // Format duration helper
  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (totalVideos === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            {course.description && (
              <p className="text-gray-600 text-lg">{course.description}</p>
            )}
          </div>

          {/* No Videos Message */}
          <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600">This course doesn't have any videos yet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 text-lg">{course.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>{sortedChapters.length} chapters</span>
            <span>•</span>
            <span>{totalVideos} videos</span>
            {course.duration && (
              <>
                <span>•</span>
                <span>{course.duration}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Video Player */}
              <div className="aspect-video bg-black relative">
                {currentVideo ? (
                  <>
                    <div 
                      id="youtube-player" 
                      className="w-full h-full"
                      style={{ minHeight: '400px' }}
                    />
                    {!playerReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-300">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              {currentVideo && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentVideo.video.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Chapter: {currentVideo.chapter.title}</span>
                    {currentVideo.video.duration && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(currentVideo.video.duration)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {sortedChapters.length} chapters • {totalVideos} videos
                </p>
              </div>

              {/* Chapters and Videos List */}
              <div className="max-h-96 lg:max-h-[600px] overflow-y-auto">
                {sortedChapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="border-b border-gray-100 last:border-b-0">
                    
                    {/* Chapter Header */}
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {chapterIndex + 1}. {chapter.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {chapter.videos.length} videos
                      </p>
                    </div>

                    {/* Videos in Chapter */}
                    <div className="divide-y divide-gray-100">
                      {chapter.videos.map((video, videoIndex) => {
                        const isCurrentVideo = currentVideo?.video.id === video.id;
                        
                        return (
                          <button
                            key={video.id}
                            onClick={() => handleVideoSelect(video, chapter)}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 ${
                              isCurrentVideo 
                                ? 'bg-blue-50 border-r-2 border-blue-500' 
                                : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              
                              {/* Video Thumbnail/Icon */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center ${
                                isCurrentVideo 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {isCurrentVideo ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <span className="text-xs font-medium">
                                    {videoIndex + 1}
                                  </span>
                                )}
                              </div>

                              {/* Video Details */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isCurrentVideo ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {video.title}
                                </p>
                                {video.duration && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDuration(video.duration)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;