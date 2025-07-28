"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetAllVideosQuery } from "../../../redux/services/video.services";
import LearningJourneyDetail from './learning-journey-detail';

const VideoJourney: React.FC = () => {
  const { data: videos, isLoading, error } = useGetAllVideosQuery();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [videosData, setVideosData] = useState([]);

  useEffect(() => {
    if (videos) {
      setVideosData(Array.isArray(videos) ? videos : (videos as any).data || []);
    }
  }, [videos]);

  const handleCreateVideo = () => {
    setShowDetail(true);
  };

  return (
    <div className="h-full">
      {videosData.length > 0 ? (
        <LearningJourneyDetail videos={videosData} />
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <div className="text-center space-y-2">
            <Image
              src="/assets/videosIcon.svg"
              alt="videoIcon"
              width={64}
              height={64}
              className="mx-auto"
            />
            <h1 className="text-[#1D1D1D] font-semibold text-[24px]">
              Start Your Video Journey
            </h1>
            <p className="text-[#1D1D1D] text-lg font-normal w-[70%] mx-auto pb-4">
              Dive into video creation with ease and make your first masterpiece
              today!
            </p>
            <button
              onClick={handleCreateVideo}
              className="text-white font-medium h-[51px] text-base bg-[#00AFF0] px-16 rounded-[8px] cursor-pointer"
            >
              Create course video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoJourney;
