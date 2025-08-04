"use client";

import React, { useState } from "react";
import { PuzzleCheckDetail } from "@/app/redux/services/puzzleAgents.services";
import NewVideoPlayer from "./NewVideoPlayer";
import VideoDetailSection from "./VideoDetailSection";
import { CheckCircle, XCircle, User, Calendar, Clock, MessageSquare } from "lucide-react";
import { Card } from "../../shared/ui/Card";
import { ViewAllCommentProvider } from "../../../context/ViewAllCommentContext";

interface SingleVideoProps {
  puzzleCheckData: PuzzleCheckDetail;
}

const SingleVideo: React.FC<SingleVideoProps> = ({ puzzleCheckData }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { video, checks, user, topic, total_checks, correct_checks_count, created_at, duration } = puzzleCheckData;

  // Calculate correct answers count if not provided
  // Note: In the current data structure, we need to determine correctness 
  // based on business logic or a separate API call. For now, we'll assume
  // correct_checks_count is provided by the API or calculate based on known answers
  const correctAnswersCount = correct_checks_count ?? 0;

  const incorrectAnswersCount = total_checks - correctAnswersCount;

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit comment
      console.log("Submitting comment:", comment);
      // await submitInstructorComment(puzzleCheckData.id, comment);
      setComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Transform video data to match the expected format for NewVideoPlayer
  const transformedVideo = {
    ...video,
    instructor: {
      name: `${user.firstName} ${user.lastName}`,
      designation: "Instructor",
      about: "",
      picture: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`,
    }
  };

  return (
    <div className="flex flex-row gap-[20px]">
      {/* Left Side: Video Player and Content - Same as VideoScreen */}
      <div className="flex flex-col flex-1 w-[70%] mt-4">
        <div className="mb-6">
          <NewVideoPlayer video={transformedVideo} />
          <VideoDetailSection video={transformedVideo} />
        </div>
      </div>

      {/* Right Side - Puzzle Check Stats (30%) */}
      <div className="flex flex-col gap-2 w-[30%] border-l mx-auto p-6">
        <div className="flex-1 h-full">
          <ViewAllCommentProvider>
            {/* Header */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Puzzle Check Results
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {topic}
              </p>
            </div>

            {/* Student Info */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {total_checks}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswersCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {incorrectAnswersCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Incorrect</div>
                </div>
              </div>
              
              {/* Accuracy Percentage */}
              <div className="mt-3 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {total_checks > 0 ? Math.round((correctAnswersCount / total_checks) * 100) : 0}% Accuracy
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto py-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Questions & Answers</h3>
              <div className="space-y-4">
                {checks.map((check, index) => {
                  // TODO: Implement proper correctness checking
                  // For now, we'll show a neutral state since we don't have the correct answers
                  const isCorrect = null; // We don't know the correct answer yet
                  
                  return (
                    <Card key={check.id} className="p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Q{index + 1}:
                        </span>
                        {isCorrect === true ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : isCorrect === false ? (
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-400 mt-0.5" />
                        )}
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {check.question}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Student's Answer:</p>
                        <div className={`text-sm p-2 rounded ${
                          isCorrect === true
                            ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300" 
                            : isCorrect === false
                            ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                        }`}>
                          {check.answer}
                        </div>
                      </div>
                      
                      {/* Show all choices for context */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Available choices:</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {check.choices.join(" • ")}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Comment Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Instructor Comment
                </label>
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment for the student..."
                className="w-full h-20 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-none"
              />
              
              <button
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || isSubmitting}
                className="mt-2 w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       rounded-md transition-colors duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </button>
            </div>
          </ViewAllCommentProvider>
        </div>
      </div>
    </div>
  );
};

export default SingleVideo;