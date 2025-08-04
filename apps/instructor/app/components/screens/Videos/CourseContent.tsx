"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { selectCurrentCourse, selectSelectedChapter, selectSelectedVideo, selectUserRole } from "../../../redux/hooks";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Chapter, Video } from "../../../types/course.types";

const CourseContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = useSelector(selectCurrentCourse);
  const selectedChapter = useSelector(selectSelectedChapter);
  const selectedVideo = useSelector(selectSelectedVideo);
  
  const userRole = useSelector(selectUserRole);
  const canEdit: boolean = userRole === "admin" || userRole === "teacher" || userRole === "instructor";

  // Sort chapters by order_index
  const sortedChapters = useMemo(() => {
    if (!course?.chapters) return [];
    return [...course.chapters].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }, [course]);

  // Find the index of the currently selected chapter
  const selectedChapterIndex = useMemo(() => {
    if (!selectedChapter || !sortedChapters.length) return 0;
    const index = sortedChapters.findIndex(ch => ch.id === selectedChapter.id);
    return index >= 0 ? index : 0;
  }, [selectedChapter, sortedChapters]);

  // Initialize openModuleIndex to the selected chapter index
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  
  // Update openModuleIndex when selectedChapterIndex changes
  React.useEffect(() => {
    setOpenModuleIndex(selectedChapterIndex);
  }, [selectedChapterIndex]);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Toggle edit mode
  const handleEditToggle = (): void => {
    setEditMode(!editMode);
    setSelectedVideos([]); // Reset selected videos on entering edit mode
  };

  // Handle video selection (kept for edit mode functionality)
  const handleVideoSelect = (moduleIndex: number, videoIndex: number): void => {
    const key = `${moduleIndex}-${videoIndex}`;
    if (selectedVideos.includes(key)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== key));
    } else {
      setSelectedVideos([...selectedVideos, key]);
    }
  };

  // Handle select all videos in a module
  const handleSelectAll = (moduleIndex: number): void => {
    const chapter = sortedChapters[moduleIndex];
    if (!chapter?.videos) return;
    
    const videoKeys = chapter.videos.map(
      (_, videoIndex) => `${moduleIndex}-${videoIndex}`
    );
    if (videoKeys.every((key) => selectedVideos.includes(key))) {
      setSelectedVideos(
        selectedVideos.filter((key) => !videoKeys.includes(key))
      );
    } else {
      setSelectedVideos([...selectedVideos, ...videoKeys]);
    }
  };

  // Delete selected videos (placeholder - would need API integration)
  const handleDeleteSelected = (moduleIndex: number): void => {
    // This would need to call an API to actually delete videos
    console.log('Delete videos:', selectedVideos);
    setSelectedVideos([]);
    setEditMode(false);
  };

  // Handle expanding/collapsing module
  const handleModuleToggle = (moduleIndex: number): void => {
    if (openModuleIndex === moduleIndex) {
      setEditMode(false); // Exit edit mode when collapsing
      setOpenModuleIndex(null); // Collapse module
    } else {
      setOpenModuleIndex(moduleIndex); // Expand selected module
      setEditMode(false); // Exit edit mode when switching modules
    }
  };

  // Handle video selection and navigation
  const handleVideoClick = (chapter: Chapter, video: Video): void => {
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('chapter-id', chapter.id);
    newSearchParams.set('video-id', video.id);
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Format duration helper
  const formatDuration = (duration?: number): string => {
    if (!duration) return '';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Placeholder functions for add operations (would need API integration)
  const handleAddVideo = (moduleIndex: number, selectedVideos: Video[]): void => {
    console.log('Add videos to chapter:', moduleIndex, selectedVideos);
  };

  const handleAddModule = (): void => {
    console.log('Add new chapter/module');
  };

  // Show message if no chapters
  if (!sortedChapters.length) {
    return (
      <div className="flex flex-col gap-4 mt-5">
        <h1 className="text-xl font-semibold">Course Content</h1>
        <div className="text-center py-8 text-gray-500">
          No chapters available for this course.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      <h1 className="text-xl font-semibold">Course Content</h1>
      {sortedChapters.map((chapter, moduleIndex) => (
        <div key={moduleIndex} className="flex flex-col gap-4">
          <div className="border border-gray-300 rounded-[6px] overflow-hidden">
            <div
              className={`flex justify-between items-center w-full cursor-pointer font-semibold ${
                openModuleIndex === moduleIndex
                  ? "bg-[#F5F4F6] dark:bg-[#1D1D1D]"
                  : ""
              } py-4 px-5`}
            >
              <button
                onClick={() => handleModuleToggle(moduleIndex)}
                className="w-full text-left text-[#1D1D1D] dark:text-white text-[16px] flex items-center gap-1 font-semibold"
              >
                {openModuleIndex === moduleIndex ? (
                  <ChevronUp className=" h-5 w-5" />
                ) : (
                  <ChevronDown className=" h-5 w-5" />
                )}
                {`${moduleIndex + 1}. ${chapter.title}`}
              </button>

              {canEdit &&
                openModuleIndex === moduleIndex &&
                chapter.videos && chapter.videos.length > 0 && (
                  <button
                    onClick={handleEditToggle}
                    className="text-[rgba(29,29,29,0.50)] font-normal text-[14px] cursor-pointer ml-4"
                  >
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                )}
            </div>

            {openModuleIndex === moduleIndex && (
              <div className="px-6 bg-white dark:bg-[#1D1D1D] text-gray-700 transition-all duration-500 ease-in-out">
                {canEdit && editMode && chapter.videos && chapter.videos.length > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={chapter.videos?.every(
                          (_, videoIndex) =>
                            selectedVideos.includes(
                              `${moduleIndex}-${videoIndex}`
                            )
                        )}
                        onChange={() => handleSelectAll(moduleIndex)}
                      />
                      <span className="text-[#1D1D1D] dark:text-white text-[13px] font-medium leading-5">
                        {selectedVideos.length} Selected
                      </span>
                    </div>
                    <div className="flex items-center gap-[14px]">
                      <button onClick={() => handleSelectAll(moduleIndex)}>
                        <Image
                          src="/assets/selectAll.svg"
                          alt="Select All"
                          fill
                        />
                      </button>
                      <button onClick={() => handleDeleteSelected(moduleIndex)}>
                        <Image src="/assets/trash.svg" alt="Delete" fill />
                      </button>
                    </div>
                  </div>
                )}

                <ul>
                  {chapter.videos && chapter.videos.length > 0 ? (
                    chapter.videos.map((video, videoIndex) => {
                      const isCurrentVideo = selectedVideo?.id === video.id;
                      return (
                      <li
                        key={videoIndex}
                        className={`flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-2 -mx-2 rounded transition-colors ${
                          isCurrentVideo ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => !editMode && handleVideoClick(chapter, video)}
                      >
                        <div className="flex items-center gap-4">
                          {editMode && (
                            <Image src="/assets/dragdrop.svg" alt="Drag" fill />
                          )}
                          {editMode && (
                            <input
                              type="checkbox"
                              checked={selectedVideos.includes(
                                `${moduleIndex}-${videoIndex}`
                              )}
                              onChange={() =>
                                handleVideoSelect(moduleIndex, videoIndex)
                              }
                            />
                          )}
                          <span className={`text-[16px] font-normal leading-7 ${
                            isCurrentVideo ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-[#1D1D1D] dark:text-white'
                          }`}>
                            {`${videoIndex + 1}. ${video.title}`}
                          </span>
                        </div>
                        <span className="text-[#1D1D1D] dark:text-white text-[14px] font-normal leading-7">
                          {formatDuration(video.duration)}
                        </span>
                      </li>
                    );
                    })
                  ) : (
                    <li className="flex justify-between items-center py-2">
                      No course videos available
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {canEdit && (
        <button
          onClick={handleAddModule}
          className="text-[rgba(0,91,211,1)] w-fit font-medium text-[16px] leading-6"
        >
          + Add Chapter
        </button>
      )}
    </div>
  );
};

export default CourseContent;
