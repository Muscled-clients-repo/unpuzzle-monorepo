"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Asset, RootState } from "../../../types/videojourney.types";
import { MagnifyingGlassIcon, VideoCameraIcon, PhotoIcon, FolderIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { ClockIcon, BuildingOfficeIcon, DocumentIcon } from "@heroicons/react/24/solid";

// Demo assets now use public asset paths for src and icon
const demoAssets: Asset[] = [
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Landing Page Design",
    size: "200 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Uploaded Videos",
    companyName: "Muscled Inc.",
    name: "CSS Flexbox Tutorial",
    size: null,
    duration: "45 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Screen Recordings",
    companyName: "Muscled Inc.",
    name: "How to use Redux",
    size: null,
    duration: "20 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Images",
    name: "Shopify UI UX Design in Figma",
    companyName: "Muscled Inc.",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Landing Page Design",
    size: "200 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Uploaded Videos",
    companyName: "Muscled Inc.",
    name: "CSS Flexbox Tutorial",
    size: null,
    duration: "45 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Screen Recordings",
    companyName: "Muscled Inc.",
    name: "How to use Redux",
    size: null,
    duration: "20 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Landing Page Design",
    size: "200 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Uploaded Videos",
    companyName: "Muscled Inc.",
    name: "CSS Flexbox Tutorial",
    size: null,
    duration: "45 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Screen Recordings",
    name: "How to use Redux",
    companyName: "Muscled Inc.",
    size: null,
    duration: "20 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Images",
    companyName: "Muscled Inc.",
    name: "Landing Page Design",
    size: "200 KB",
    duration: null,
    src: "/assets/shopify1.svg",
    icon: "/assets/imageIcon.svg",
  },
  {
    type: "Uploaded Videos",
    companyName: "Muscled Inc.",
    name: "CSS Flexbox Tutorial",
    size: null,
    duration: "45 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
  {
    type: "Screen Recordings",
    companyName: "Muscled Inc.",
    name: "How to use Redux",
    size: null,
    duration: "20 mins",
    src: "/assets/shopify1.svg",
    icon: "/assets/upload.svg",
  },
];

export default function LearningJourneyDetail({ videos }: { videos: Asset[] }) {
  // Use demo assets if no videos provided
  const initialAssets = videos.length > 0 ? videos : demoAssets;
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(initialAssets); // Filtered assets state
  const { persistent } = useSelector((state: RootState) => state.sidebar);
  const [assets, setAssets] = useState<Asset[]>(initialAssets); // Local state for assets
  const [filterType, setFilterType] = useState<string>("all"); // Current filter type
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const dispatch = useDispatch();

  // Handle filtering by type
  const handleTabClick = (type: string): void => {
    setFilterType(type);
    if (type === "all") {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter((asset) => asset.type === type));
    }
  };

  // Filter by search term
  const filteredAndSearchedAssets = useMemo(() => {
    return filteredAssets.filter((asset) =>
      (asset.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [filteredAssets, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Journey</h1>
              <p className="text-gray-600 mt-1">Explore your video content and resources</p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search videos, images, or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                         text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-200
                         hover:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
          {/* Enhanced Filter Tabs */}
          <div className="mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { id: "all", label: "All Content", icon: FolderIcon },
                { id: "Screen Recordings", label: "Screen Recordings", icon: VideoCameraIcon },
                { id: "Uploaded Videos", label: "Uploaded Videos", icon: PlayCircleIcon },
                { id: "Images", label: "Images", icon: PhotoIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                             transition-all duration-200 transform hover:scale-105 ${
                      filterType === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      filterType === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {tab.id === "all" 
                        ? filteredAndSearchedAssets.length 
                        : assets.filter(a => a.type === tab.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Asset Grid */}
          <div className="relative">
            {filteredAndSearchedAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <FolderIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                persistent ? "lg:grid-cols-3" : "lg:grid-cols-4"
              } md:grid-cols-2 sm:grid-cols-1`}>
                {filteredAndSearchedAssets.map((asset, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                             transform hover:scale-105 transition-all duration-300 cursor-pointer
                             border border-gray-100"
                  >
                    {/* Enhanced Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={asset.src || "/assets/shopify1.svg"}
                        alt={asset.name || "Asset"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                          <PlayCircleIcon className="h-10 w-10 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      {asset.duration && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 
                                      bg-black/80 backdrop-blur-sm text-white rounded-lg 
                                      px-2 py-1 text-sm font-medium">
                          <ClockIcon className="h-4 w-4" />
                          {asset.duration}
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full 
                                       text-xs font-medium backdrop-blur-sm ${
                          asset.type === "Images" 
                            ? "bg-purple-100/80 text-purple-700"
                            : asset.type === "Screen Recordings"
                            ? "bg-blue-100/80 text-blue-700"
                            : "bg-green-100/80 text-green-700"
                        }`}>
                          {asset.type === "Images" && <PhotoIcon className="h-3 w-3 mr-1" />}
                          {asset.type === "Screen Recordings" && <VideoCameraIcon className="h-3 w-3 mr-1" />}
                          {asset.type === "Uploaded Videos" && <PlayCircleIcon className="h-3 w-3 mr-1" />}
                          {asset.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Content Section */}
                    <div className="p-5">
                      {/* Company Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {asset.companyName}
                        </span>
                        {asset.size && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{asset.size}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 
                                   group-hover:text-blue-600 transition-colors duration-200">
                        {asset.name}
                      </h3>
                      
                      {/* Additional Info */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Added 2 hours ago
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium
                                         opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

