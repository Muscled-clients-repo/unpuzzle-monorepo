"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Table from "../shared/Table";
import { useGetVideosByChapterIdQuery } from "../../redux/hooks";
import LoadingSpinner from "../screens/Loading";

interface Video {
  id: string;
  title: string;
  duration?: number;
  puzzlehints_count?: number;
  puzzlechecks_count?: number;
  puzzlereflects_count?: number;
  puzzlepaths_count?: number;
}

interface TransformedVideo {
  id: string;
  title: string;
  duration: string;
  puzzlehints_count: number;
  puzzlechecks_count: number;
  puzzlereflects_count: number;
  puzzlepaths_count: number;
  [key: string]: any;
}

const ChapterVideos = () => {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId");
  const router = useRouter();
  // Fetch videos data from API
  const {
    data: videosResponse,
    isLoading,
    error,
  } = useGetVideosByChapterIdQuery(
    { chapterId: chapterId as string },
    { skip: !chapterId }
  );

  // Define the columns for the videos table
  const columns = [
    { title: "Title", key: "title" },
    { title: "Duration", key: "duration" },
    { title: "Puzzle Hint", key: "puzzlehints_count" },
    { title: "Puzzle Check", key: "puzzlechecks_count" },
    { title: "Puzzle Reflect", key: "puzzlereflects_count" },
    { title: "Puzzle Path", key: "puzzlepaths_count" },
  ];

  // Transform videos data for the table
  const transformedVideos = useMemo(() => {
    if (!videosResponse?.data || !Array.isArray(videosResponse.data)) return [];

    return videosResponse.data.map((video: Video): TransformedVideo => ({
      id: video.id,
      title: video.title,
      duration: video.duration
        ? `${Math.floor(video.duration / 60)}:${(video.duration % 60)
            .toString()
            .padStart(2, "0")}`
        : "N/A",
      puzzlehints_count: video.puzzlehints_count || 0,
      puzzlechecks_count: video.puzzlechecks_count || 0,
      puzzlereflects_count: video.puzzlereflects_count || 0,
      puzzlepaths_count: video.puzzlepaths_count || 0,
    }));
  }, [videosResponse]);

  const handleBack = () => {
    router.push(`/instructor/dashboard/analytics/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-9">
        <div className="text-red-500">
          Error loading videos. Please try again later.
        </div>
      </div>
    );
  }

  if (!chapterId) {
    return null; // This component should only render when chapterId is present
  }

  return (
    <div className="px-6 py-9">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
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
          Back
        </button>
        <div className="text-[32px]">Chapter Videos</div>
      </div>

      <div className="course-table">
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          {transformedVideos.length > 0 ? (
            <div className="rounded-xl border border-[#EEEEEE] p-6">
              <div className="text-[20px] mb-4">All Videos</div>
              <table className="w-full text-left table-auto min-w-max text-slate-800">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-300">
                    {columns.map((column, index) => (
                      <th className="p-4" key={index}>
                        <p className="text-sm leading-none font-normal">
                          {column.title}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transformedVideos.map((video: TransformedVideo, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-[#EAF3FD] hover:text-[#3385F0] cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/instructor/dashboard/analytics/${courseId}/${chapterId}?videoId=${video.id}`
                        )
                      }
                    >
                      {columns.map((column, colIndex) => (
                        <td className="p-4" key={colIndex}>
                          <p className="text-sm">{video[column.key]}</p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No videos found for this chapter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterVideos;
