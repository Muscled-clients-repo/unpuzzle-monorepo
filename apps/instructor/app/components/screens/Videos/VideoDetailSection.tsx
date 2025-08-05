import React from "react";
import Image from "next/image";
import AgentLogs from "./AgentLogs";
import { Video } from "../../../types/videos.types";
type Instructor = {
  name: string;
  designation: string;
  about: string;
  picture: string;
};

type VideoDetailProps = {
  title: string;
  description: string;
  instructor: Instructor;
};

const VideoDetailSection: React.FC<{ video: Video }> = ({
  video,
}) => {
  console.log("video is: ",video)
  return (
    <div className="max-full mx-auto p-4 bg-white rounded ">
      {/* Video Title */}
      <h1 className="font-semibold mb-4 text-base">{video?.title}</h1>
      <div className=" flex justify-between">
        <div className=" w-[60%] ">
          {/* Instructor Info */}
          <div className="flex items-center mb-4">
            <div className=" relative mr-4">
              <img
                src={video?.instructor?.picture || "https://randomuser.me/api/portraits/women/44.jpg"}
                alt={video?.instructor?.name || "Instructor Name"}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <Image
                src="/assets/blue-tick.svg"
                width={18}
                height={18}
                alt="blue tick"
                className=" h-[18px] w-[18px] absolute bottom-0 right-0"
              />
            </div>

            <div>
              <div className="font-semibold text-base">
                {video?.instructor?.name || "Instructor Name"}
              </div>
              <div className="text-sm text-gray-500">
                {video?.instructor?.designation || "Instructor Designation"}
              </div>
            </div>
          </div>
          {/* About Instructor */}
          <div className="mb-6">
            <div className="font-semibold mb-1">About Instructor</div>
            <div className="text-gray-700 text-sm">
              {video?.instructor?.about || "Instructor About"}
            </div>
          </div>
        </div>
        <div className=" w-[40%] ">
          <AgentLogs />
        </div>
      </div>
    </div>
  );
};


export default function VideoDetailSectionWrapper({video}:{video:Video}) {
  // return "video Detail section"
  return <VideoDetailSection video={video} />;
}
