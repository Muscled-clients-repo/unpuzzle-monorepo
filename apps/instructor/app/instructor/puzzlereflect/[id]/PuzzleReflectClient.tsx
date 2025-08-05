"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import { 
  AlertCircle, 
  FileImage, 
  Mic, 
  Video, 
  MessageSquare
} from "lucide-react";
import { useOptionalUser } from "@/app/hooks/useOptionalUser";
import { useGetPuzzleReflectByIdQuery } from "@/app/redux/hooks/useAuthenticatedPuzzleAgentsApi";
import { PuzzleReflectFile } from "@/app/redux/services/puzzleAgents.services";
import AgentPageLayout from "@/app/components/screens/AgentLayouts/AgentPageLayout";
import AgentDetailCard from "@/app/components/screens/AgentLayouts/AgentDetailCard";
import { 
  LoomPlayer, 
  ImageGallery, 
  ModernAudioPlayer
} from "@/app/components/screens/PuzzleReflect/MediaComponents";

interface PuzzleReflectClientProps {
  puzzleReflectId: string;
}

const PuzzleReflectClient: React.FC<PuzzleReflectClientProps> = ({ puzzleReflectId }) => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useOptionalUser();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  // Use Redux RTK Query to fetch puzzle reflect data
  const { data, isLoading, isError, error } = useGetPuzzleReflectByIdQuery(
    { id: puzzleReflectId },
    { skip: !puzzleReflectId }
  );

  // Get icon for reflection type
  const getReflectionTypeIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Mic className="w-5 h-5" />;
      case 'images':
        return <FileImage className="w-5 h-5" />;
      case 'loom':
        return <Video className="w-5 h-5" />;
      default:
        return <FileImage className="w-5 h-5" />;
    }
  };

  // Get reflection type label
  const getReflectionTypeLabel = (type: string) => {
    switch (type) {
      case 'audio':
        return 'Audio Reflection';
      case 'images':
        return 'Image Gallery';
      case 'loom':
        return 'Loom Recording';
      default:
        return 'Reflection';
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit comment
      console.log("Submitting comment for puzzle reflect:", puzzleReflectId, comment);
      
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
              <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Reflection</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {error?.data?.message || error?.message || "Failed to load puzzle reflect data. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const puzzleReflectData = data?.body;
  
  // Helper function to get user name safely
  const getUserName = (user: any) => {
    if (!user) return 'Unknown';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unknown';
  };
  
  // Debug logging to check user data
  if (puzzleReflectData) {
    console.log("PuzzleReflect data received:", {
      hasUser: !!puzzleReflectData.user,
      user: puzzleReflectData.user,
      userId: puzzleReflectData.user_id,
      firstName: puzzleReflectData.user?.firstName || puzzleReflectData.user?.first_name,
      lastName: puzzleReflectData.user?.lastName || puzzleReflectData.user?.last_name,
      fullData: puzzleReflectData
    });
  }

  if (!puzzleReflectData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Not Found</h3>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                The requested puzzle reflect could not be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform video data to match expected format for NewVideoPlayer if video exists
  const transformedVideo = puzzleReflectData.video ? {
    ...puzzleReflectData.video,
    id: puzzleReflectData.video_id,
    video_source: puzzleReflectData.video.video_source || 'yt_video',
    instructor: {
      name: getUserName(puzzleReflectData.user) !== 'Unknown' ? getUserName(puzzleReflectData.user) : 'Student',
      designation: "Student",
      about: "",
      picture: puzzleReflectData.user?.image_url || 
        (puzzleReflectData.user 
          ? `https://ui-avatars.com/api/?name=${puzzleReflectData.user.firstName || puzzleReflectData.user.first_name || 'U'}+${puzzleReflectData.user.lastName || puzzleReflectData.user.last_name || 'U'}&background=3b82f6&color=fff`
          : `https://ui-avatars.com/api/?name=Student&background=3b82f6&color=fff`),
    }
  } : null;

  // Filter files by type
  const audioFiles = puzzleReflectData.file?.filter((f: PuzzleReflectFile) => f.mime_type.startsWith('audio/')) || [];
  const imageFiles = puzzleReflectData.file?.filter((f: PuzzleReflectFile) => f.mime_type.startsWith('image/')) || [];

  return (
    <AgentPageLayout video={transformedVideo} agentType="reflect">
      <AgentDetailCard
        title={puzzleReflectData.title || 'Puzzle Reflect'}
        subtitle={getReflectionTypeLabel(puzzleReflectData.type)}
        icon={getReflectionTypeIcon(puzzleReflectData.type)}
        timestamp={puzzleReflectData.timestamp}
        createdAt={puzzleReflectData.created_at}
        userName={getUserName(puzzleReflectData.user)}
        agentId={puzzleReflectData.id}
        headerGradient="from-gray-800 to-gray-900"
      >
        {/* Media Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Media Content</h3>
          
          {/* Loom Video */}
          {puzzleReflectData.type === 'loom' && puzzleReflectData.loom_link && (
            <LoomPlayer 
              loomLink={puzzleReflectData.loom_link} 
              title={puzzleReflectData.title}
            />
          )}
          
          {/* Image Gallery */}
          {puzzleReflectData.type === 'images' && imageFiles.length > 0 && (
            <ImageGallery images={imageFiles} />
          )}
          
          {/* Audio Player */}
          {puzzleReflectData.type === 'audio' && audioFiles.length > 0 && (
            <ModernAudioPlayer audioFiles={audioFiles} />
          )}
          
          {/* No media fallback */}
          {((puzzleReflectData.type === 'loom' && !puzzleReflectData.loom_link) ||
            (puzzleReflectData.type === 'images' && imageFiles.length === 0) ||
            (puzzleReflectData.type === 'audio' && audioFiles.length === 0)) && (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">
                No media content available
              </p>
            </div>
          )}
        </div>

        {/* Instructor Feedback Section */}
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Instructor Feedback</h3>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide feedback on the student's reflection..."
            className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg 
                   bg-gray-50 text-gray-900 placeholder-gray-500
                   focus:ring-2 focus:ring-gray-900 focus:border-transparent
                   focus:bg-white resize-none transition-all duration-150"
          />
          
          <button
            onClick={handleCommentSubmit}
            disabled={!comment.trim() || isSubmitting}
            className="w-full px-4 py-2.5 text-sm font-medium text-white 
                   bg-gray-900 hover:bg-gray-800
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   rounded-lg transition-colors duration-150"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </AgentDetailCard>
    </AgentPageLayout>
  );
};

export default PuzzleReflectClient;