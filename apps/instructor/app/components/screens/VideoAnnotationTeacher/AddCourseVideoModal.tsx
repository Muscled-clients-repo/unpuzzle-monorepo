import { useState } from "react";
import Image from "next/image";
// import { useNavigate } from "react-router-dom";
// import { useRouter } from 'next/navigation';

import {
  Video,
  AddCourseVideoModalProps,
} from "../../../types/videoannotationsteacher.type";
// import Thumbnail from "/assets/thumbnailWeb.svg";
// import DownloadIcon from "/assets/download.svg";
// import TickIcon from "/assets/tickIcon.svg";

const AddCourseVideoModal: React.FC<AddCourseVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideos,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  // const navigate = useRouter();

  const videos: Video[] = [
    { title: "Shopify UI UX Design in Figma", time: "30 mints" },
    { title: "Responsive Web Design Basics", time: "25 mints" },
    { title: "Advanced CSS Techniques", time: "40 mints" },
    { title: "JavaScript Essentials", time: "35 mints" },
    { title: "React.js Components", time: "45 mints" },
    { title: "Building APIs with Node.js", time: "50 mints" },
    { title: "Intro to Database Design", time: "55 mints" },
    { title: "Version Control with Git", time: "20 mints" },
  ];

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
    }
  };

  const handleSelect = (index: number) => {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleAdd = () => {
    const selectedVideos = selectedIndexes.map((index) => videos[index]);
    console.log("Selected videos:", selectedVideos);
    onAddVideos(selectedVideos);
    onClose();
  };

  const isAddDisabled = selectedIndexes.length === 0;

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-5 rounded-lg shadow-lg w-[80%] xl:w-[65%] max-h-[781px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="space-y-1 pb-3">
          <h2 className="text-2xl text-[#1D1D1D] font-semibold">
            Select Course Video
          </h2>
          <p className="text-base text-[#1D1D1D] font-normal">
            Select course videos for Responsive web design
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          className="mt-4 bg-[#ECEFF7] py-5 px-[8px] rounded-[20px] max-h-[540px] overflow-y-scroll"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-sm h-[242px] p-3 cursor-pointer `}
                onClick={() => handleSelect(index)}
              >
                <div
                  className={`absolute top-2 left-2 h-[16px] w-[16px] rounded-[4px] border-[0.66px] border-[#8A8A8A] flex items-center justify-center ${
                    selectedIndexes.includes(index)
                      ? "bg-[#00AFF0]"
                      : "bg-white"
                  }`}
                >
                  {selectedIndexes.includes(index) && (
                    <div className="h-[16px] w-[16px] text-white flex items-center justify-center">
                      {/* <img src={TickIcon} alt="tickIcon" /> */}
                      <Image
                        src="/assets/tickIcon.svg"
                        width={20}
                        height={20}
                        alt="tickIcon"
                      />
                    </div>
                  )}
                </div>
                {/* <img
                  src={Thumbnail}
                  alt="thumbnail"
                  className="rounded-[8px] object-cover h-[162px] w-full"
                /> */}
                <Image
                  src="/assets/thumbnailWeb.svg"
                  height={162}
                  alt="thumbnail"
                  className="rounded-[8px] object-cover w-full"
                />

                <h1 className="text-[#1D1D1D] font-semibold text-base mt-2">
                  {video.title}
                </h1>
                <div className="pt-2 flex items-center justify-between">
                  <Image
                    src="/assets/download.svg"
                    alt="download"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                  <p className="text-[#55565B] font-medium text-xs">
                    {video.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={handleAdd} // Add Button Click Event
            disabled={isAddDisabled}
            className={`h-[43px] w-[96px] rounded-[8px] text-white flex items-center justify-center cursor-pointer ${
              isAddDisabled ? "bg-[#00AFF0] opacity-60" : "bg-[#00AFF0]"
            }`}
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-[#D9D9D9] h-[43px] w-[96px] rounded-[8px] text-black flex items-center justify-center cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseVideoModal;
