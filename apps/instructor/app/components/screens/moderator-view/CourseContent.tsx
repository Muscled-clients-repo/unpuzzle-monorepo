"use client";
import { useState } from "react";

// Define interfaces for modules and videos
import { Module, Video } from "../../../types/videos.types";
import Image from "next/image";

const CourseContent: React.FC = () => {
  const userRole: string = "student";
  console.log(userRole);
  const canEdit: boolean = userRole === "admin" || userRole === "teacher";

  const [modules, setModules] = useState<Module[]>([
    {
      title: "WordPress Basic & Domain Hosting explained",
      videos: [
        {
          id: '1',
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
          video_url: '',
          yt_video_id: '',
          video_source: '',
          chapter_id: ''
        },
        {
          id: '2',
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
          video_url: '',
          yt_video_id: '',
          video_source: '',
          chapter_id: ''
        },
      ],
    },
    {
      title: "Web Designing basic to advance ( learn from scratch )",
      videos: [
        {
          id: '3',
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
          video_url: '',
          yt_video_id: '',
          video_source: '',
          chapter_id: ''
        },
        {
          id: '4',
          title: "How to install WordPress (domain-hosting explained)",
          duration: 1770,
          video_url: '',
          yt_video_id: '',
          video_source: '',
          chapter_id: ''
        },
      ],
    },
  ]);

  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0); // Default first module expanded
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Toggle edit mode
  const handleEditToggle = (): void => {
    setEditMode(!editMode);
    setSelectedVideos([]); // Reset selected videos on entering edit mode
  };

  // Handle video selection
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
    const videoKeys = modules[moduleIndex].videos.map(
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

  // Delete selected videos
  const handleDeleteSelected = (moduleIndex: number): void => {
    const newModules = [...modules];
    newModules[moduleIndex].videos = newModules[moduleIndex].videos.filter(
      (_, videoIndex) =>
        !selectedVideos.includes(`${moduleIndex}-${videoIndex}`)
    );
    setModules(newModules);
    setSelectedVideos([]);
    setEditMode(false); // Exit edit mode after deletion
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

  const handleAddVideo = (
    moduleIndex: number,
    selectedVideos: Video[]
  ): void => {
    const newModules = [...modules];
    selectedVideos.forEach((video) => {
      newModules[moduleIndex].videos.push({
        title: video.title,
        duration: video.duration,
      });
    });
    setModules(newModules);
  };

  const handleAddModule = (): void => {
    setModules([...modules, { title: "New Module", videos: [] }]);
  };

  return (
    <div className="px-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Course Content</h1>
      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="flex flex-col gap-4">
          <div className="border border-gray-300 rounded-[6px] overflow-hidden">
            <div
              className={`flex justify-between items-center w-full cursor-pointer ${
                openModuleIndex === moduleIndex
                  ? "bg-[#F5F4F6] dark:bg-[#1D1D1D]"
                  : ""
              } py-4 px-5`}
            >
              <button
                onClick={() => handleModuleToggle(moduleIndex)}
                className="w-full text-left text-[#1D1D1D] dark:text-white font-medium text-[20px]"
              >
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
                          {video.duration}
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
};

export default CourseContent;
