"use client";

import React, { useState } from "react";
import { PuzzleCheckDetail } from "@/app/redux/services/puzzleAgents.services";
import AgentPageLayout from "@/app/components/screens/AgentLayouts/AgentPageLayout";
import AgentDetailCard from "@/app/components/screens/AgentLayouts/AgentDetailCard";
import { CheckCircle, XCircle, MessageSquare, ClipboardCheck } from "lucide-react";
import { Card } from "@/app/components/shared/ui/Card";

interface PuzzleCheckClientProps {
  puzzleCheckData: PuzzleCheckDetail;
}

const PuzzleCheckClient: React.FC<PuzzleCheckClientProps> = ({ puzzleCheckData }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { video, checks, user, topic, total_checks, correct_checks_count, created_at, duration } = puzzleCheckData;

  // Calculate correct answers count
  const correctAnswersCount = correct_checks_count ?? 0;
  const incorrectAnswersCount = total_checks - correctAnswersCount;

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit comment
      console.log("Submitting comment:", comment);
      setComment("");
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform video data to match the expected format
  const transformedVideo = video ? {
    ...video,
    instructor: {
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student' : 'Student',
      designation: "Student",
      about: "",
      picture: user?.image_url || 
        (user 
          ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`
          : `https://ui-avatars.com/api/?name=Student&background=0D8ABC&color=fff`),
    }
  } : null;

  return (
    <AgentPageLayout video={transformedVideo} agentType="check">
      <AgentDetailCard
        title={topic || 'Puzzle Check'}
        subtitle="Student Assessment Results"
        icon={<ClipboardCheck className="w-5 h-5" />}
        timestamp={duration}
        createdAt={created_at}
        userName={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'}
        agentId={puzzleCheckData.id}
        headerGradient="from-gray-800 to-gray-900"
      >
        {/* Stats Summary */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Assessment Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {total_checks}
              </div>
              <div className="text-xs text-gray-600">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {correctAnswersCount}
              </div>
              <div className="text-xs text-gray-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">
                {incorrectAnswersCount}
              </div>
              <div className="text-xs text-gray-600">Incorrect</div>
            </div>
          </div>
          
          {/* Accuracy Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Overall Accuracy</span>
              <span className="text-sm font-semibold text-gray-900">
                {total_checks > 0 ? Math.round((correctAnswersCount / total_checks) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${total_checks > 0 ? (correctAnswersCount / total_checks) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Questions & Answers</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {checks.map((check, index) => {
            // TODO: Implement proper correctness checking
            const isCorrect = null; // We don't know the correct answer yet
            
            return (
              <div key={check.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Q{index + 1}</span>
                    <p className="text-sm text-gray-900 font-medium">
                      {check.question}
                    </p>
                  </div>
                </div>
                
                <div className="pl-6 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Student's Answer</p>
                    <p className="text-sm text-gray-900 bg-white rounded-md p-3 border border-gray-200">
                      {check.answer}
                    </p>
                  </div>
                  
                  {/* Show all choices */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Available choices</p>
                    <div className="flex flex-wrap gap-2">
                      {check.choices.map((choice, choiceIndex) => (
                        <span 
                          key={choiceIndex}
                          className="text-xs px-3 py-1 bg-white text-gray-700 rounded-md border border-gray-200"
                        >
                          {choice}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Instructor Feedback Section */}
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Instructor Feedback</h3>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide feedback on the student's performance..."
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

export default PuzzleCheckClient;