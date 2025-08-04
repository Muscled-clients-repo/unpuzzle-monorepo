"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "../shared/Table";
import robot from "../../../public/assets/robot.svg";
import PauseSummaryChart from "./PauseSummaryChart";
import ARDChart from "./ARDChart";
import { TrendingUp } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useGetVideosByChapterIdQuery,
  useGetPuzzleHintsByVideoIdQuery,
  useGetPuzzleChecksByVideoIdQuery,
  useGetPuzzleReflectsByVideoIdQuery,
  useGetPuzzlePathsByVideoIdQuery,
} from "../../redux/hooks";
import { useGetActivityLogsQuery } from "../../redux/services/activityLogs.services";
import LoadingSpinner from "../screens/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  PuzzleReflectTable,
  PuzzleCheckTable,
  PuzzleHintTable,
  PuzzlePathTable,
} from "./PuzzleTables";
import { calculatePuzzleAgentStats } from "../../utils/calculateAverage";
import { TrendingDown } from "lucide-react";


interface Video {
  puzzleHint: number;
  puzzleCheck: number;
  puzzleReflect: number;
  puzzlePath: number;
}

const VideoAnalytics = () => {
  const { courseId, chapterId } = useParams();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Pagination states for each table
  const [puzzleHintPage, setPuzzleHintPage] = useState(1);
  const [puzzleCheckPage, setPuzzleCheckPage] = useState(1);
  const [puzzleReflectPage, setPuzzleReflectPage] = useState(1);
  const [puzzlePathPage, setPuzzlePathPage] = useState(1);
  
  const itemsPerPage = 10;

  // Fetch videos from chapter
  const { data: videosResponse, isLoading: videosLoading } =
    useGetVideosByChapterIdQuery(
      { chapterId: chapterId as string },
      { skip: !chapterId }
    );

  // Fetch activity logs for the video
  const { data: activityLogs, isLoading: logsLoading } =
    useGetActivityLogsQuery(videoId as string, { skip: !videoId });

  // Fetch puzzle agents data for the video
  const { data: puzzleHints, isLoading: hintsLoading } =
    useGetPuzzleHintsByVideoIdQuery(
      { 
        videoId: videoId as string,
        page: puzzleHintPage,
        limit: itemsPerPage
      },
      { skip: !videoId }
    );

  const { data: puzzleChecks, isLoading: checksLoading } =
    useGetPuzzleChecksByVideoIdQuery(
      { 
        videoId: videoId as string,
        page: puzzleCheckPage,
        limit: itemsPerPage
      },
      { skip: !videoId }
    );
  console.log("puzzleChecks: ", puzzleChecks);
  const { data: puzzleReflects, isLoading: reflectsLoading } =
    useGetPuzzleReflectsByVideoIdQuery(
      { 
        videoId: videoId as string,
        page: puzzleReflectPage,
        limit: itemsPerPage
      },
      { skip: !videoId }
    );

  const { data: puzzlePaths, isLoading: pathsLoading } =
    useGetPuzzlePathsByVideoIdQuery(
      { 
        videoId: videoId as string,
        page: puzzlePathPage,
        limit: itemsPerPage
      },
      { skip: !videoId }
    );

  // Find the selected video
  useEffect(() => {
    if (videosResponse?.data && videoId) {
      const video = videosResponse.data.find((v: any) => v.id === videoId);
      if (video) {
        setSelectedVideo(video);
      }
    }
  }, [videosResponse, videoId]);

  // Calculate puzzle agent counts
  const puzzleAgentCounts = {
    puzzleHint: puzzleHints?.count || 0,
    puzzleCheck: puzzleChecks?.count || 0,
    puzzleReflect: puzzleReflects?.count || 0,
    puzzlePath: puzzlePaths?.count || 0,
  };

  // Calculate stats for each puzzle agent
  const puzzleAgentStats = calculatePuzzleAgentStats(puzzleAgentCounts);

  const handleBack = () => {
    router.push(
      `/instructor/dashboard/analytics/${courseId}?chapterId=${chapterId}`
    );
  };

  if (
    videosLoading ||
    logsLoading ||
    hintsLoading ||
    checksLoading ||
    reflectsLoading ||
    pathsLoading
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Chapter
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Video not found</p>
            <p className="text-gray-500 text-sm mt-2">The requested video could not be located.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Chapter
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Video Analytics</h1>
                <h2 className="text-lg md:text-xl text-gray-600">
                  {selectedVideo?.title || "Video Title"}
                </h2>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  Live Analytics
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Puzzle Agent Stats Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Puzzle Agent Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["puzzleHint", "puzzleCheck", "puzzleReflect", "puzzlePath"].map(
                (value, index) => {
                  const agentNames = {
                    puzzleHint: "Puzzle Hint",
                    puzzleCheck: "Puzzle Check",
                    puzzleReflect: "Puzzle Reflect",
                    puzzlePath: "Puzzle Path"
                  };
                  const stats = puzzleAgentStats[value];
                  const count = puzzleAgentCounts[value as keyof typeof puzzleAgentCounts];
                  
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Image
                            src={robot}
                            width={48}
                            height={48}
                            alt="Puzzle agent icon"
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            {count}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {agentNames[value as keyof typeof agentNames]}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          stats?.isHigher ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stats?.isHigher ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{stats?.percentageDiff || 0}%</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {stats?.isHigher ? 'Above' : 'Below'} average
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {/* Tables Section - Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <PuzzleCheckTable
                data={puzzleChecks?.data || []}
                heading="Puzzle Checks"
                count={puzzleChecks?.count || 0}
                currentPage={puzzleCheckPage}
                totalPages={puzzleChecks?.totalPages || 1}
                onPageChange={setPuzzleCheckPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <PuzzleReflectTable
                data={puzzleReflects?.data || []}
                heading="Puzzle Reflects"
                count={puzzleReflects?.count || 0}
                currentPage={puzzleReflectPage}
                totalPages={puzzleReflects?.totalPages || 1}
                onPageChange={setPuzzleReflectPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>

          {/* Tables Section - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <PuzzleHintTable
                data={puzzleHints?.data || []}
                heading="Puzzle Hints"
                count={puzzleHints?.count || 0}
                currentPage={puzzleHintPage}
                totalPages={puzzleHints?.totalPages || 1}
                onPageChange={setPuzzleHintPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <PuzzlePathTable
                data={puzzlePaths?.data || []}
                heading="Puzzle Paths"
                count={puzzlePaths?.count || 0}
                currentPage={puzzlePathPage}
                totalPages={puzzlePaths?.totalPages || 1}
                onPageChange={setPuzzlePathPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pause Summary</h3>
                <div className="h-64">
                  <PauseSummaryChart />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ARD Analysis</h3>
                <div className="h-64">
                  <ARDChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalytics;
