"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Table from "../shared/Table";
import { useGetCourseByIdQuery, useGetChaptersByCourseIdQuery } from "../../redux/hooks";
import LoadingSpinner from "../screens/Loading";
import ChapterVideos from "./ChapterVideos";

interface Chapter {
  id: string;
  title: string;
  videos_count?: number;
  order_index: number;
  created_at: string;
}

interface TransformedChapter {
  id: string;
  title: string;
  videoCount: number | string;
  order_index: number;
  createdDate: string;
  [key: string]: any;
}

const Chapters = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapterId');
  
  // Fetch course data from API
  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(
    { id: courseId as string },
    { skip: !courseId }
  );
  
  // Fetch chapters separately
  const { data: chaptersResponse, isLoading: chaptersLoading, error } = useGetChaptersByCourseIdQuery(
    { courseId: courseId as string },
    { skip: !courseId }
  );

  // Define the columns for the chapters table
  const columns = [
    { title: "Chapter Title", key: "title" },
    { title: "Videos", key: "videoCount" },
    { title: "Order", key: "order_index" },
    { title: "Created Date", key: "createdDate" },
  ];

  // Transform chapters data for the table
  const transformedChapters = useMemo(() => {
    if (!chaptersResponse?.data || !Array.isArray(chaptersResponse.data)) return [];
    
    return chaptersResponse.data.map((chapter: Chapter): TransformedChapter => ({
      id: chapter.id,
      title: chapter.title,
      videoCount: chapter.videos_count !== undefined ? chapter.videos_count : "Not found",
      order_index: chapter.order_index,
      createdDate: new Date(chapter.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));
  }, [chaptersResponse]);

  const handleBack = () => {
    router.push('/instructor/dashboard/analytics');
  };

  const handleChapterClick = (id: string) => {
    router.push(`/instructor/dashboard/analytics/${courseId}?chapterId=${id}`);
  };

  // If chapterId is present in URL, show videos instead
  if (chapterId) {
    return <ChapterVideos />;
  }

  if (courseLoading || chaptersLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-9">
        <div className="text-red-500">Error loading course data. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-9">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="text-[32px]">{course?.title || 'Course'} - Chapters</div>
      </div>
      
      <div className="course-table">
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          {transformedChapters.length > 0 ? (
            <div className="rounded-xl border border-[#EEEEEE] p-6">
              <div className="text-[20px] mb-4">All Chapters</div>
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
                  {transformedChapters.map((chapter: TransformedChapter, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-[#EAF3FD] hover:text-[#3385F0] cursor-pointer"
                      onClick={() => handleChapterClick(chapter.id)}
                    >
                      {columns.map((column, colIndex) => (
                        <td className="p-4" key={colIndex}>
                          <p className="text-sm">{chapter[column.key]}</p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No chapters found for this course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chapters;