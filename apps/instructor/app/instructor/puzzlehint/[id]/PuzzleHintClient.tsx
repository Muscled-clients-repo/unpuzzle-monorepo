"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import { AlertCircle, Clock, User, CheckCircle, MessageSquare, Lightbulb } from "lucide-react";
import { useOptionalUser } from "@/app/hooks/useOptionalUser";
import { useGetPuzzleHintByIdQuery } from "@/app/redux/hooks/useAuthenticatedPuzzleAgentsApi";
import AgentPageLayout from "@/app/components/screens/AgentLayouts/AgentPageLayout";
import AgentDetailCard from "@/app/components/screens/AgentLayouts/AgentDetailCard";

interface PuzzleHintClientProps {
  puzzleHintId: string;
}

const PuzzleHintClient: React.FC<PuzzleHintClientProps> = ({ puzzleHintId }) => {
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

  // Use Redux RTK Query to fetch puzzle hint data
  const { data, isLoading, isError, error } = useGetPuzzleHintByIdQuery(
    { id: puzzleHintId },
    { skip: !puzzleHintId }
  );

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit comment
      console.log("Submitting comment for puzzle hint:", puzzleHintId, comment);
      // await submitPuzzleHintComment(puzzleHintId, comment);
      
      // Clear comment after successful submission
      setComment("");
      alert("Comment submitted successfully!"); // Replace with proper notification
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment. Please try again.");
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
              <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Puzzle Hint</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {error?.data?.message || error?.message || "Failed to load puzzle hint data. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const puzzleHintData = data?.body;

  if (!puzzleHintData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Not Found</h3>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                The requested puzzle hint could not be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform video data to match expected format for NewVideoPlayer
  const transformedVideo = puzzleHintData.video ? {
    ...puzzleHintData.video,
    id: puzzleHintData.video_id,
    video_source: puzzleHintData.video.video_url.includes('youtube') ? 'yt_video' : 'unpuzzle',
    yt_video_id: puzzleHintData.video.video_url.includes('youtube') 
      ? new URL(puzzleHintData.video.video_url).searchParams.get('v') || ''
      : '',
    instructor: {
      name: puzzleHintData.user ? `${puzzleHintData.user.firstName || ''} ${puzzleHintData.user.lastName || ''}`.trim() || 'Student' : 'Student',
      designation: "Student",
      about: "",
      picture: puzzleHintData.user?.image_url || 
        (puzzleHintData.user 
          ? `https://ui-avatars.com/api/?name=${puzzleHintData.user.firstName}+${puzzleHintData.user.lastName}&background=10b981&color=fff`
          : `https://ui-avatars.com/api/?name=Student&background=10b981&color=fff`),
    }
  } : null;

  // Create a sorted copy of the completion array to avoid mutating the original
  const sortedCompletionSteps = [...puzzleHintData.completion].sort((a, b) => a.step_number - b.step_number);

  return (
    <AgentPageLayout video={transformedVideo} agentType="hint">
      <AgentDetailCard
        title="Puzzle Hint"
        subtitle="Student Hint Request"
        icon={<Lightbulb className="w-5 h-5" />}
        timestamp={puzzleHintData.duration}
        createdAt={puzzleHintData.created_at || new Date().toISOString()}
        userName={puzzleHintData.user ? `${puzzleHintData.user.firstName || ''} ${puzzleHintData.user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'}
        agentId={puzzleHintData.id}
        headerGradient="from-gray-800 to-gray-900"
      >
        {/* Student Question Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Student's Question</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-900">
              {puzzleHintData.question}
            </p>
          </div>
        </div>

        {/* AI Response Section */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">AI Response</h3>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-700">
              {puzzleHintData.prompt}
            </p>
          </div>
        </div>

        {/* Completion Steps */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Step-by-Step Guidance</h3>
          <div className="space-y-2">
            {sortedCompletionSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                  {step.step_number}
                </div>
                <p className="text-sm text-gray-700 flex-1">{step.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status and Metadata */}
        <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Hint Status</span>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            puzzleHintData.status === 'got it' 
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {puzzleHintData.status === 'got it' && <CheckCircle className="w-3 h-3 mr-1" />}
            {puzzleHintData.status}
          </div>
        </div>

        {/* Instructor Feedback Section */}
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Instructor Feedback</h3>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide feedback on the student's hint usage..."
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

export default PuzzleHintClient;