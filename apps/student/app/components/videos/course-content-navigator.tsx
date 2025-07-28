"use client";
import React, { useState, useCallback, useMemo } from "react";

// Define interfaces for modules and videos
import { Video } from "../../types/videos.types";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

// Simplified interface for mock data
interface MockVideo extends Partial<Video> {
  title: string;
  duration: number;
}

interface MockModule {
  title: string;
  videos: MockVideo[];
}

const CourseContent: React.FC = React.memo(() => {
  const userRole: string = "student";
  const canEdit: boolean = useMemo(() => userRole === "admin" || userRole === "teacher", [userRole]);

  // Helper function to format duration from seconds to MM:SS
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const [modules, setModules] = useState<MockModule[]>([
    {
      title: "WordPress Basic & Domain Hosting explained",
      videos: [
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770, // 29:30 in seconds
        },
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
        },
      ],
    },
    {
      title: "Web Designing basic to advance ( learn from scratch )",
      videos: [
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770, // 29:30 in seconds
        },
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
        },
      ],
    },
  ]);

  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0); // Default first module expanded
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Toggle edit mode
  const handleEditToggle = useCallback((): void => {
    setEditMode(!editMode);
    setSelectedVideos([]); // Reset selected videos on entering edit mode
  }, [editMode]);

  // Handle video selection
  const handleVideoSelect = useCallback((moduleIndex: number, videoIndex: number): void => {
    const key = `${moduleIndex}-${videoIndex}`;
    setSelectedVideos(prev => {
      if (prev.includes(key)) {
        return prev.filter((id) => id !== key);
      } else {
        return [...prev, key];
      }
    });
  }, []);

  // Handle select all videos in a module
  const handleSelectAll = useCallback((moduleIndex: number): void => {
    const videoKeys = modules[moduleIndex].videos.map(
      (_, videoIndex) => `${moduleIndex}-${videoIndex}`
    );
    setSelectedVideos(prev => {
      if (videoKeys.every((key) => prev.includes(key))) {
        return prev.filter((key) => !videoKeys.includes(key));
      } else {
        return [...prev, ...videoKeys];
      }
    });
  }, [modules]);

  // Delete selected videos
  const handleDeleteSelected = useCallback((moduleIndex: number): void => {
    setModules(prev => {
      const newModules = [...prev];
      newModules[moduleIndex].videos = newModules[moduleIndex].videos.filter(
        (_, videoIndex) =>
          !selectedVideos.includes(`${moduleIndex}-${videoIndex}`)
      );
      return newModules;
    });
    setSelectedVideos([]);
    setEditMode(false); // Exit edit mode after deletion
  }, [selectedVideos]);

  // Handle expanding/collapsing module
  const handleModuleToggle = useCallback((moduleIndex: number): void => {
    if (openModuleIndex === moduleIndex) {
      setEditMode(false); // Exit edit mode when collapsing
      setOpenModuleIndex(null); // Collapse module
    } else {
      setOpenModuleIndex(moduleIndex); // Expand selected module
      setEditMode(false); // Exit edit mode when switching modules
    }
  }, [openModuleIndex]);

  const handleAddVideo = useCallback((
    moduleIndex: number,
    selectedVideos: MockVideo[]
  ): void => {
    setModules(prev => {
      const newModules = [...prev];
      selectedVideos.forEach((video) => {
        newModules[moduleIndex].videos.push(video);
      });
      return newModules;
    });
  }, []);

  const handleAddModule = useCallback((): void => {
    setModules(prev => [...prev, { title: "New Module", videos: [] }]);
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <h1 className="text-xl font-semibold">Course Content</h1>
      {modules.map((module, moduleIndex) => (
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
                  <ChevronDown />
                )}
                {module.title}
              </button>

              {canEdit &&
                openModuleIndex === moduleIndex &&
                module.videos.length > 0 && (
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
                {canEdit && editMode && module.videos.length > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={modules[moduleIndex].videos.every(
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
                  {module.videos.length > 0 ? (
                    module.videos.map((video, videoIndex) => (
                      <li
                        key={videoIndex}
                        className="flex justify-between items-center py-2"
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
                          <span className="text-[#1D1D1D] dark:text-white text-[16px] font-normal leading-7">
                            {video.title}
                          </span>
                        </div>
                        <span className="text-[#1D1D1D] dark:text-white text-[14px] font-normal leading-7">
                          {formatDuration(video.duration)}
                        </span>
                      </li>
                    ))
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
          + Add Module
        </button>
      )}
    </div>
  );
});

CourseContent.displayName = 'CourseContent';

export default CourseContent;
