"use client";

import Image from "next/image";
import { PlayCircleIcon, PhotoIcon, VideoCameraIcon, ClockIcon } from "@heroicons/react/24/solid";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

interface VideoResourceCardProps {
  src: string;
  title: string;
  type: "Images" | "Screen Recordings" | "Uploaded Videos";
  duration?: string | null;
  size?: string | null;
  companyName?: string;
  onClick?: () => void;
}

export default function VideoResourceCard({
  src,
  title,
  type,
  duration,
  size,
  companyName,
  onClick
}: VideoResourceCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "Images":
        return <PhotoIcon className="h-3 w-3 mr-1" />;
      case "Screen Recordings":
        return <VideoCameraIcon className="h-3 w-3 mr-1" />;
      case "Uploaded Videos":
        return <PlayCircleIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getTypeBadgeStyle = () => {
    switch (type) {
      case "Images":
        return "bg-purple-100/80 text-purple-700";
      case "Screen Recordings":
        return "bg-blue-100/80 text-blue-700";
      case "Uploaded Videos":
        return "bg-green-100/80 text-green-700";
      default:
        return "bg-gray-100/80 text-gray-700";
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
               transform hover:scale-105 transition-all duration-300 cursor-pointer
               border border-gray-100"
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        {type !== "Images" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <PlayCircleIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        )}
        
        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 
                        bg-black/80 backdrop-blur-sm text-white rounded-lg 
                        px-2 py-1 text-sm font-medium">
            <ClockIcon className="h-4 w-4" />
            {duration}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full 
                         text-xs font-medium backdrop-blur-sm ${getTypeBadgeStyle()}`}>
            {getTypeIcon()}
            {type}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        {/* Company Info */}
        {companyName && (
          <div className="flex items-center gap-2 mb-3">
            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {companyName}
            </span>
            {size && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{size}</span>
              </>
            )}
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 
                     group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        
        {/* Additional Info */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Added recently
          </span>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}