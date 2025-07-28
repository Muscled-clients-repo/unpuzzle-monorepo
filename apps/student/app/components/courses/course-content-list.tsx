import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { Video } from '../../types/course.types';
import Image from 'next/image';

// Simplified interface for mock data - extends the real Video type
interface MockVideo extends Partial<Video> {
  title: string;
  duration: number;
}

interface MockModule {
  title: string;
  videos: MockVideo[];
}

const CourseContent: React.FC = () => {
  const { user } = useSelector((state: any) => state.user);
  const userRole = user?.publicMetadata?.privileges || 'student';
  const canEdit = userRole === 'admin' || userRole === 'teacher';

  // Helper function to format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [modules, setModules] = useState<MockModule[]>([
    {
      title: 'WordPress Basic & Domain Hosting explained',
      videos: [
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 }, // 29:30 in seconds
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
      ],
    },
    {
      title: 'Web Designing basic to advance (learn from scratch)',
      videos: [
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 }, // 29:30 in seconds
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
        { title: 'How to install WordPress (domain-hosting explained)', duration: 1770 },
      ],
    },
  ]);

  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0); // Default first module expanded
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setSelectedVideos([]); // Reset selected videos on entering edit mode
  };

  const handleVideoSelect = (moduleIndex: number, videoIndex: number) => {
    const key = `${moduleIndex}-${videoIndex}`;
    setSelectedVideos((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleSelectAll = (moduleIndex: number) => {
    const videoKeys = modules[moduleIndex].videos.map((_, videoIndex) => `${moduleIndex}-${videoIndex}`);
    setSelectedVideos((prev) =>
      videoKeys.every((key) => prev.includes(key))
        ? prev.filter((key) => !videoKeys.includes(key))
        : [...prev, ...videoKeys]
    );
  };

  const handleDeleteSelected = (moduleIndex: number) => {
    setModules((prevModules) =>
      prevModules.map((module, idx) =>
        idx === moduleIndex
          ? {
              ...module,
              videos: module.videos.filter(
                (_, videoIndex) => !selectedVideos.includes(`${moduleIndex}-${videoIndex}`)
              ),
            }
          : module
      )
    );
    setSelectedVideos([]);
    setEditMode(false);
  };

  const handleModuleToggle = (moduleIndex: number) => {
    if (openModuleIndex === moduleIndex) {
      setEditMode(false);
      setOpenModuleIndex(null);
    } else {
      setOpenModuleIndex(moduleIndex);
      setEditMode(false);
    }
  };

  const handleAddModule = () => {
    setModules([...modules, { title: 'New Module', videos: [] }]);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
    <h1 className="text-xl font-bold">Course Content</h1>
    {modules.map((module, moduleIndex) => (
      <div key={moduleIndex} className="flex flex-col gap-4">
        <div className="border border-gray-300 rounded-[6px] overflow-hidden">
          <div
            className={`flex justify-between items-center w-full ${
              openModuleIndex === moduleIndex ? 'bg-[#F5F4F6]' : ''
            } py-4 px-5`}
          >
            <button
              onClick={() => handleModuleToggle(moduleIndex)}
              className="w-full text-left text-[#1D1D1D] font-medium text-[20px]"
            >
              {module.title}
            </button>

            {canEdit && openModuleIndex === moduleIndex && module.videos.length > 0 && (
              <button
                onClick={handleEditToggle}
                className="text-[rgba(29,29,29,0.50)] font-normal text-[14px] cursor-pointer ml-4"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {openModuleIndex === moduleIndex && (
            <div className="px-6 bg-white text-gray-700 transition-all duration-500 ease-in-out">
              {canEdit && editMode && module.videos.length > 0 && (
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={modules[moduleIndex].videos.every((_, videoIndex) =>
                        selectedVideos.includes(`${moduleIndex}-${videoIndex}`)
                      )}
                      onChange={() => handleSelectAll(moduleIndex)}
                    />
                    <span className="text-[#1D1D1D] text-[13px] font-medium leading-5">
                      {selectedVideos.length} Selected
                    </span>
                  </div>
                  <div className="flex items-center gap-[14px]">
                    <button onClick={() => handleSelectAll(moduleIndex)}>
                      <Image src={'/assets/selectAll.svg'} alt="" />
                    </button>
                    <button onClick={() => handleDeleteSelected(moduleIndex)}>
                      <Image src={'/assets/trash.svg'} alt="" />
                    </button>
                  </div>
                </div>
              )}

              <ul>
                {module.videos.length > 0 ? (
                  module.videos.map((video, videoIndex) => (
                    <li key={videoIndex} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        {editMode && <Image src={'/assets/dragdrop.svg'} alt="" />}
                        {editMode && (
                          <input
                            type="checkbox"
                            checked={selectedVideos.includes(`${moduleIndex}-${videoIndex}`)}
                            onChange={() => handleVideoSelect(moduleIndex, videoIndex)}
                          />
                        )}
                        <span className="text-[#1D1D1D] text-[16px] font-normal leading-7">
                          {video.title}
                        </span>
                      </div>
                      <span className="text-[#1D1D1D] text-[14px] font-normal leading-7">
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
};

export default CourseContent;
