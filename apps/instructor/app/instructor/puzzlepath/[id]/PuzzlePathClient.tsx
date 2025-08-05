"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import { AlertCircle, Route, MessageSquare } from "lucide-react";
import { useOptionalUser } from "@/app/hooks/useOptionalUser";
import { useGetPuzzlePathByIdQuery } from "@/app/redux/hooks/useAuthenticatedPuzzleAgentsApi";
import { PuzzlePathDetail } from "@/app/redux/services/puzzleAgents.services";

// Helper type for recommended video data from PuzzlePath
interface RecommendedVideoData {
  trigger_time: number;
  content_url: string;
  content_type: "yt_video" | "unpuzzle_video";
  yt_video_id?: string;
  title: string;
  video_id: string;
}
import AgentPageLayout from "@/app/components/screens/AgentLayouts/AgentPageLayout";
import AgentDetailCard from "@/app/components/screens/AgentLayouts/AgentDetailCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/shared/ui/Accordion";
import { Play, Clock, Youtube, Video as VideoIcon } from "lucide-react";

interface PuzzlePathClientProps {
  puzzlePathId: string;
}

// Utility function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// RecommendedVideoSection Component
interface RecommendedVideoSectionProps {
  video: RecommendedVideoData;
  onVideoPlay: (video: RecommendedVideoData) => void;
}

const RecommendedVideoSection: React.FC<RecommendedVideoSectionProps> = ({ video, onVideoPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasError(false);
    onVideoPlay(video);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  const getVideoIcon = () => {
    return video.content_type === "yt_video" ? (
      <Youtube className="w-4 h-4 text-red-600" />
    ) : (
      <VideoIcon className="w-4 h-4 text-blue-600" />
    );
  };

  const renderVideoPlayer = () => {
    if (!isPlaying) return null;

    if (hasError) {
      return (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Failed to load video</span>
          </div>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            The video could not be loaded. Please check the URL or try again later.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsPlaying(false);
            }}
            className="text-xs text-red-600 dark:text-red-400 underline mt-2 hover:text-red-800 dark:hover:text-red-300"
          >
            Try again
          </button>
        </div>
      );
    }

    // Sanitize content_url by removing extra characters
    const sanitizedUrl = video.content_url.trim().replace(/[\r\n]/g, '');

    if (video.content_type === "yt_video") {
      // For YouTube videos, use content_url directly (it should be embed URL)
      return (
        <div className="mt-4">
          <iframe
            width="100%"
            height="200"
            src={`${sanitizedUrl}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
            onError={handleVideoError}
          />
        </div>
      );
    } else {
      // For unpuzzle_video, use HTML5 video tag with custom controls
      return (
        <div className="mt-4">
          <video
            width="100%"
            height="200"
            controls
            autoPlay
            className="rounded-lg"
            src={sanitizedUrl}
            onError={handleVideoError}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Video Info Card */}
      <div 
        onClick={handlePlay}
        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex-shrink-0 mt-1">
          {getVideoIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
            {video.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Trigger at {formatTime(video.trigger_time)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Play className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-600 font-medium">
              Click to play
            </span>
          </div>
        </div>
      </div>

      {/* Video Player */}
      {renderVideoPlayer()}
    </div>
  );
};

const PuzzlePathClient: React.FC<PuzzlePathClientProps> = ({ puzzlePathId }) => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useOptionalUser();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedVideoPlaying, setRecommendedVideoPlaying] = useState<RecommendedVideoData | null>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  // Use Redux RTK Query to fetch puzzle path data
  const { data, isLoading, isError, error } = useGetPuzzlePathByIdQuery(
    { id: puzzlePathId },
    { skip: !puzzlePathId }
  );

  // Helper function to create recommended video data from PuzzlePath data
  const createRecommendedVideoData = (pathData: PuzzlePathDetail): RecommendedVideoData | null => {
    if (!pathData.content_url || !pathData.content_type || pathData.trigger_time === undefined) {
      return null;
    }
    
    return {
      trigger_time: pathData.trigger_time,
      content_url: pathData.content_url,
      content_type: pathData.content_type,
      yt_video_id: pathData.yt_video_id,
      title: pathData.title,
      video_id: pathData.video_id
    };
  };

  // Debug logging to check what data we're receiving
  useEffect(() => {
    const puzzlePathData = data?.body;
    if (puzzlePathData) {
      const videoData = createRecommendedVideoData(puzzlePathData);
      console.log("=== PuzzlePath Debug Info ===");
      console.log("Full API Response:", data);
      console.log("PuzzlePath Data:", puzzlePathData);
      console.log("Content URL:", puzzlePathData.content_url);
      console.log("Content URL (sanitized):", puzzlePathData.content_url?.trim().replace(/[\r\n]/g, ''));
      console.log("Content Type:", puzzlePathData.content_type);
      console.log("Trigger Time:", puzzlePathData.trigger_time);
      console.log("YT Video ID:", puzzlePathData.yt_video_id);
      console.log("Recommended Video Data:", videoData);
      console.log("Will show accordion?", !!videoData);
      console.log("============================");
    }
  }, [data]);

  // Handle recommended video play
  const handleRecommendedVideoPlay = (video: RecommendedVideoData) => {
    setRecommendedVideoPlaying(video);
    // You could also scroll to the video or update left side layout here if needed
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit comment
      console.log("Submitting comment for puzzle path:", puzzlePathId, comment);
      
      // Clear comment after successful submission
      setComment("");
      alert("Feedback submitted successfully!"); // Replace with proper notification
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while Clerk is initializing or data is loading
  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Puzzle Path</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {error?.data?.message || error?.message || "Failed to load puzzle path data. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const puzzlePathData = data?.body;
  const recommendedVideoData = puzzlePathData ? createRecommendedVideoData(puzzlePathData) : null;

  if (!puzzlePathData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Not Found</h3>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                The requested puzzle path could not be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform video data to match expected format for NewVideoPlayer
  const transformedVideo = puzzlePathData.video ? {
    ...puzzlePathData.video,
    id: puzzlePathData.video_id,
    video_source: puzzlePathData.video?.video_source || 'yt_video',
    instructor: {
      name: puzzlePathData.user ? `${puzzlePathData.user.firstName || ''} ${puzzlePathData.user.lastName || ''}`.trim() || 'Student' : 'Student',
      designation: "Student",
      about: "",
      picture: puzzlePathData.user?.image_url || 
        (puzzlePathData.user 
          ? `https://ui-avatars.com/api/?name=${puzzlePathData.user.firstName}+${puzzlePathData.user.lastName}&background=f59e0b&color=fff`
          : `https://ui-avatars.com/api/?name=Student&background=f59e0b&color=fff`),
    }
  } : null;

  return (
    <AgentPageLayout video={transformedVideo} agentType="path">
      <AgentDetailCard
        title={puzzlePathData.title || 'Puzzle Path'}
        subtitle="Learning Journey Roadmap"
        icon={<Route className="w-5 h-5" />}
        timestamp={puzzlePathData.timestamp}
        createdAt={puzzlePathData.created_at}
        userName={puzzlePathData.user ? `${puzzlePathData.user.firstName || ''} ${puzzlePathData.user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'}
        agentId={puzzlePathData.id}
        headerGradient="from-orange-500 to-amber-600"
      >
        {/* Path Content */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Route className="w-5 h-5" />
            Learning Path Details
          </h3>
          
          {/* Show path-specific content here based on API response */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-gray-700 dark:text-gray-300">
              {puzzlePathData.description || "This puzzle path shows the student's learning journey and progress."}
            </p>
          </div>

          {/* Path Steps or Milestones (if available in API) */}
          {puzzlePathData.steps && puzzlePathData.steps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Path Milestones</h4>
              {puzzlePathData.steps.map((step: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{step.description || step}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Video Section */}
        {recommendedVideoData && (
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="recommended-video" className="border-orange-200 dark:border-orange-800">
                <AccordionTrigger className="text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400">
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4" />
                    Recommended Video
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <RecommendedVideoSection 
                    video={recommendedVideoData} 
                    onVideoPlay={handleRecommendedVideoPlay}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Instructor Feedback Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              Instructor Feedback
            </label>
          </div>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide feedback on the student's learning path..."
            className="w-full h-32 p-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:ring-orange-500 focus:border-transparent
                   resize-none transition-all duration-200"
          />
          
          <button
            onClick={handleCommentSubmit}
            disabled={!comment.trim() || isSubmitting}
            className="w-full px-6 py-3 text-sm font-medium text-white 
                   bg-gradient-to-r from-orange-500 to-amber-600 
                   hover:from-orange-600 hover:to-amber-700
                   disabled:from-gray-400 disabled:to-gray-500 
                   disabled:cursor-not-allowed
                   rounded-lg transition-all duration-200 
                   transform hover:scale-[1.02] active:scale-[0.98]
                   shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </AgentDetailCard>
    </AgentPageLayout>
  );
};

export default PuzzlePathClient;