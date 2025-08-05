import React, { useState } from "react";
import { useGetPuzzleChecksByVideoIdQuery } from "@/app/redux/hooks/useAuthenticatedPuzzleAgentsApi";
import { useSelector } from "react-redux";
import { selectSelectedVideo } from "@/app/redux/hooks";
import LoadingSpinner from "../../Loading";

// SVG icon components
const TickIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0.5C4.08473 0.5 0.5 4.08473 0.5 8.5C0.5 12.9153 4.08473 16.5 8.5 16.5C12.9153 16.5 16.5 12.9153 16.5 8.5C16.5 4.08473 12.9153 0.5 8.5 0.5ZM8.5 1.95367C12.113 1.95367 15.0463 4.88701 15.0463 8.5C15.0463 12.113 12.113 15.0463 8.5 15.0463C4.88701 15.0463 1.95367 12.113 1.95367 8.5C1.95367 4.88701 4.88701 1.95367 8.5 1.95367ZM5.56649 8.89914L7.25601 10.5887C7.54001 10.8727 8.00021 10.8727 8.28403 10.5887L11.4335 7.43918C11.7173 7.15553 11.7173 6.69481 11.4335 6.41116C11.1499 6.12751 10.6893 6.12751 10.4057 6.41116L7.77011 9.04689L6.59433 7.87112C6.31068 7.58746 5.85014 7.58746 5.56649 7.87112C5.28283 8.15477 5.28283 8.61548 5.56649 8.89914Z" fill="#14AC7A"/>
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0.5C4.08473 0.5 0.5 4.08473 0.5 8.5C0.5 12.9153 4.08473 16.5 8.5 16.5C12.9154 16.5 16.5002 12.9153 16.5002 8.5C16.5002 4.08473 12.9154 0.5 8.5 0.5ZM8.5 1.95367C12.113 1.95367 15.0463 4.88701 15.0463 8.5C15.0463 12.113 12.113 15.0463 8.5 15.0463C4.88701 15.0463 1.95385 12.113 1.95385 8.5C1.95385 4.88701 4.88701 1.95367 8.5 1.95367ZM7.47216 8.5L6.16781 9.80435C5.88416 10.088 5.88416 10.5485 6.16781 10.8322C6.45146 11.1158 6.912 11.1158 7.19583 10.8322L8.5 9.52785L9.80435 10.8322C10.088 11.1158 10.5487 11.1158 10.8324 10.8322C11.116 10.5485 11.116 10.088 10.8324 9.80435L9.52802 8.5L10.8324 7.19565C11.116 6.912 11.116 6.45146 10.8324 6.16781C10.5487 5.88398 10.088 5.88398 9.80435 6.16781L8.5 7.47198L7.19583 6.16781C6.912 5.88398 6.45146 5.88398 6.16781 6.16781C5.88416 6.45146 5.88416 6.912 6.16781 7.19565L7.47216 8.5Z" fill="#FF5630"/>
  </svg>
);

// Helper function to format time in MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const PuzzleCheck = () => {
  // Get current video from Redux
  const selectedVideo = useSelector(selectSelectedVideo);
  
  // Fetch puzzle checks for the current video
  const { data: puzzleChecksData, isLoading, isError } = useGetPuzzleChecksByVideoIdQuery(
    { videoId: selectedVideo?.id || '' },
    { skip: !selectedVideo?.id }
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Dummy data for quiz attempts
  const quizAttempts = [
    { time: "01:40", score: "3/5" },
    { time: "05:20", score: "5/5" },
    { time: "02:40", score: "4/5" },
  ];

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !puzzleChecksData) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Unable to load puzzle check data</p>
      </div>
    );
  }

  const puzzleChecks = puzzleChecksData.data || [];

  // If a quiz is selected, show the drawer/details view
  if (selectedIndex !== null) {
    const puzzleCheck = puzzleChecks[selectedIndex];
    return (
      <div className="p-3 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedIndex(null)}
            className="text-gray-600 hover:text-gray-800 gap-4 flex items-center space-x-1 cursor-pointer font-inter text-xs font-medium leading-normal"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 6.50022C16 5.99043 15.5867 5.57717 15.077 5.57717L3.15164 5.57717L6.49913 2.23002C6.85962 1.86957 6.85965 1.28512 6.49919 0.924634C6.13874 0.564142 5.5543 0.564113 5.19381 0.924568L0.270388 5.84749C0.0972624 6.0206 0 6.25539 0 6.50022C0 6.74504 0.0972624 6.97984 0.270388 7.15295L5.19381 12.0759C5.5543 12.4363 6.13874 12.4363 6.49919 12.0758C6.85965 11.7153 6.85962 11.1309 6.49913 10.7704L3.15164 7.42327L15.077 7.42327C15.5867 7.42327 16 7.01 16 6.50022Z" fill="#1D1D1D"/>
          </svg>
            <span className="text-sm text-[#1D1D1D] font-inter text-sm font-semibold leading-normal">Puzzle Check</span>
          </button>
         <div className="text-[#00AFF0] font-inter text-sm font-medium leading-normal">{formatTime(puzzleCheck.duration || 0)}</div>
        </div>
       
        <ol className="mb-4 space-y-2 font-inter text-[#212636]">
          {puzzleCheck.checks?.map((check, idx) => (
            <li key={check.id || idx} className="mb-4">
              <div className="font-medium text-[#1D1D1D] font-inter text-sm font-normal leading-normal">
                {idx + 1}. {check.question}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-gray-600">{check.answer}</span>
              </div>
              <div className="text-xs text-gray-500 ml-4 mt-1">
                Choices: {check.choices?.join(', ')}
              </div>
            </li>
          ))}
        </ol>
        <div className="pt-3 mt-2 border-t border-t-[#E5E5E5]">
          <div className="text-[#1D1D1D] font-inter text-sm font-medium leading-[20px]">Score</div>
          <div className="text-[#1D1D1D] font-inter text-sm font-light leading-[20px]">
            {puzzleCheck.correct_checks_count || 0}/{puzzleCheck.total_checks || 0}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the table of quiz attempts
  return (
    <div className="bg-white rounded-lg">
      <div className="">
        <div className="grid grid-cols-4 gap-4 mb-3 font-medium text-gray-700">
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Time</div>
          <div className="col-span-2 h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Score</div>
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Action</div>
        </div>
        <div className="space-y-3">
          {quizAttempts.map((attempt, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] h-12 flex items-center">{attempt.time}</div>
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] col-span-2 h-12 flex items-center">{attempt.score}</div>
              <div className="h-12 flex items-center">
                <button
                  className="bg-black text-white font-inter text-xs font-medium leading-normal px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedIndex(idx)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleCheck; 