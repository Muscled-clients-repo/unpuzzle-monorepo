import { useState, KeyboardEvent } from "react";
import Image from "next/image";

import { useSelector } from "react-redux";
import AddCourseVideoModal from "./AddCourseVideoModal";
import AddCourseChapterModal from "./AddCourseChapterModal";

interface Video {
  title: string;
  duration: string;
}

interface Module {
  title: string;
  videos: Video[];
}

const CourseContent = () => {
  const userRole: any = "student";
  const canEdit = userRole === "admin" || userRole === "teacher";
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState<boolean>(false);
  const [modules, setModules] = useState<Module[]>([
    {
      title: "Introduction to website design",
      videos: [
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: "29:30",
        },
        {
          title: "How to install WordPress (domain-hosting explained)",
          duration: "29:30",
        },
      ],
    },
  ]);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0); // Default first module expanded
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);

  const handleOpenAddCourseModal = () => setIsModalOpen(true);
  const handleCloseAddCourseModal = () => setIsModalOpen(false);

  const handleOpenAddChapterModal = () => setIsChapterModalOpen(true);
  const handleCloseAddChapterModal = () => setIsChapterModalOpen(false);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setSelectedVideos([]); // Reset selected videos on entering edit mode
  };

  const handleVideoSelect = (moduleIndex: number, videoIndex: number) => {
    const key = `${moduleIndex}-${videoIndex}`;
    if (selectedVideos.includes(key)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== key));
    } else {
      setSelectedVideos([...selectedVideos, key]);
    }
  };

  const handleModuleToggle = (moduleIndex: number) => {
    if (openModuleIndex === moduleIndex) {
      setEditMode(false); // Exit edit mode when collapsing
      setOpenModuleIndex(null); // Collapse module
    } else {
      setOpenModuleIndex(moduleIndex);
      setEditMode(false);
    }
  };

  const handleTitleChange = (
    event: KeyboardEvent<HTMLInputElement>,
    type: "module" | "video",
    moduleIndex: number,
    videoIndex?: number
  ) => {
    if (event.key === "Enter") {
      const updatedModules = [...modules];
      if (type === "module") {
        updatedModules[moduleIndex].title = (
          event.target as HTMLInputElement
        ).value;
      } else if (type === "video" && videoIndex !== undefined) {
        updatedModules[moduleIndex].videos[videoIndex].title = (
          event.target as HTMLInputElement
        ).value;
      }
      setModules(updatedModules);
      setEditingTitle(null);
    }
  };

  const handleAddVideos = (newVideos: { title: string; time: string }[]) => {
    if (openModuleIndex === null) return;
    const updatedModules = [...modules];
    updatedModules[openModuleIndex].videos = [
      ...updatedModules[openModuleIndex].videos,
      ...newVideos.map((video) => ({
        title: video.title,
        duration: video.time,
      })),
    ];
    setModules(updatedModules);
  };

  const handleAddChapter = (title: string) => {
    setModules((prevModules) => [...prevModules, { title, videos: [] }]);
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Course Content</h1>
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="flex flex-col gap-4">
            <div className="border border-gray-300 rounded-[6px] overflow-hidden">
              <div
                className={`flex gap-2 items-center w-full ${
                  openModuleIndex === moduleIndex
                    ? "bg-[#F5F4F6] dark:bg-[#1D1D1D]"
                    : ""
                }  py-4 px-5`}
              >
                <div className="flex gap-2 items-center w-full">
                  {editingTitle === `module-${moduleIndex}` ? (
                    <input
                      type="text"
                      defaultValue={module.title}
                      onKeyDown={(event) =>
                        handleTitleChange(event, "module", moduleIndex)
                      }
                      autoFocus
                      className="text-left text-[#1D1D1D] dark:text-white font-medium text-[20px] border-none bg-transparent outline-none w-full"
                    />
                  ) : (
                    <button
                      onClick={() => handleModuleToggle(moduleIndex)}
                      className="text-left text-[#1D1D1D] dark:text-white font-medium text-[20px]"
                    >
                      {module.title}
                    </button>
                  )}
                  {/* <img
                    src={EditIcon}
                    onClick={() => setEditingTitle(`module-${moduleIndex}`)}
                    className="cursor-pointer"
                  /> */}
                  <Image
                    src="/assets/editIcon-dark.svg"
                    onClick={() => setEditingTitle(`module-${moduleIndex}`)}
                    className="cursor-pointer"
                    alt="Edit Icon"
                    width={20}
                    height={20}
                  />
                </div>

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
                <div className="px-6 bg-white dark:bg-[#1D1D1D] text-gray-700 dark:text-white transition-all duration-500 ease-in-out">
                  <ul>
                    {module.videos.length > 0 ? (
                      module.videos.map((video, videoIndex) => (
                        <li
                          key={videoIndex}
                          className="flex justify-between items-center py-2"
                        >
                          <div className="flex items-center gap-4 w-[80%]">
                            {
                              editMode && (
                                <Image
                                  src="/assets/dragdrop.svg"
                                  alt=""
                                  width={20}
                                  height={20}
                                />
                              )

                              // <img src={DragIcon} alt="" />
                            }
                            {editMode && (
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedVideos.includes(
                                  `${moduleIndex}-${videoIndex}`
                                )}
                                onChange={() =>
                                  handleVideoSelect(moduleIndex, videoIndex)
                                }
                              />
                            )}
                            {editingTitle ===
                            `video-${moduleIndex}-${videoIndex}` ? (
                              <input
                                type="text"
                                defaultValue={video.title}
                                onKeyDown={(event) =>
                                  handleTitleChange(
                                    event,
                                    "video",
                                    moduleIndex,
                                    videoIndex
                                  )
                                }
                                autoFocus
                                className="text-[#1D1D1D] dark:text-white text-[16px] font-normal leading-7 w-full border-none bg-transparent outline-none"
                              />
                            ) : (
                              <span className="text-[#1D1D1D] dark:text-white text-[16px] font-normal leading-7">
                                {video.title}
                              </span>
                            )}
                            {/* <img
                              src={EditIcon}
                              onClick={() =>
                                setEditingTitle(
                                  `video-${moduleIndex}-${videoIndex}`
                                )
                              }
                              className="cursor-pointer"
                            /> */}
                            <Image
                              src="/assets/editIcon-dark.svg"
                              onClick={() =>
                                setEditingTitle(
                                  `video-${moduleIndex}-${videoIndex}`
                                )
                              }
                              className="cursor-pointer"
                              alt="Edit Icon"
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="text-[#1D1D1D] dark:text-white text-[14px] font-normal leading-7 w-[20%] text-end">
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
      </div>

      <div className="flex gap-4 pb-5 px-4">
        <p
          className="text-[#00AFF0] font-[450] text-base cursor-pointer"
          onClick={handleOpenAddCourseModal}
        >
          + Add Course video
        </p>
        <p
          className="text-[#00AFF0] font-[450] text-base cursor-pointer"
          onClick={handleOpenAddChapterModal}
        >
          + Add Course Chapter
        </p>
      </div>

      <AddCourseVideoModal
        isOpen={isModalOpen}
        onClose={handleCloseAddCourseModal}
        onAddVideos={handleAddVideos}
      />

      <AddCourseChapterModal
        isOpen={isChapterModalOpen}
        onClose={handleCloseAddChapterModal}
        onAddChapter={handleAddChapter}
      />
    </>
  );
};

export default CourseContent;
