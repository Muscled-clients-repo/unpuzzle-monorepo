"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Asset, RootState } from "../../../types/videojourney.types";

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
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(videos); // Filtered assets state
  const { persistent } = useSelector((state: RootState) => state.sidebar);
  const [assets, setAssets] = useState<Asset[]>(videos); // Local state for assets
  const [filterType, setFilterType] = useState<string>("all"); // Current filter type
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const dispatch = useDispatch();

  // Handle filtering by type
  const handleTabClick = (type: string): void => {
    setFilterType(type);
    if (type === "all") {
      setFilteredAssets(videos);
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
    <div className="py-8">
      <div className="w-[70%] flex items-center border border-gray-300 px-4 py-2 bg-[#F5F4F6] rounded-[100px] mx-10 mb-4">
        <Image
          src="/assets/searchIcon.svg"
          alt="searchIcon"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow outline-none bg-transparent px-3 bg-"
        />
      </div>
      <div className="w-full h-full flex gap-6 justify-center px-10">
        <div className="w-full flex flex-col gap-5">
          {/* Tabs for filtering */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2 cursor-pointer">
              {["all", "Screen Recordings", "Uploaded Videos", "Images"].map(
                (type) => (
                  <button
                    key={type}
                    className={`py-[12px] w-fit px-4 rounded-[8px] ${
                      filterType === type
                        ? "bg-[#00AFF0] text-white"
                        : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
                    } text-[16px] font-medium leading-normal`}
                    onClick={() => handleTabClick(type)}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("-", " ")}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Display filtered assets */}
          <div className="overflow-auto h-[90vh]">
            <div
              className={`grid pr-[20px] ${
                persistent ? "grid-cols-3" : "grid-cols-4"
              } gap-x-3 gap-y-6`}
            >
              {filteredAndSearchedAssets?.length > 0 &&
                filteredAndSearchedAssets.map((asset, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[15px] p-3 col-span-1 border border-[#F4EEEE]"
                  >
                    <div className="relative">
                      <Image
                        src={asset.src || "/assets/shopify1.svg"}
                        alt={asset.name || "Asset"}
                        width={300}
                        height={180}
                        className="rounded-md w-full object-cover"
                      />
                      <div className="bg-[#212121] text-white rounded-[100px] py-[4px] px-[8px] font-semibold text-[10px] absolute bottom-2 right-2 cursor-pointer">
                        {asset.duration || "22 min"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <p className="text-[#1D1D1D] font-semibold text-sm">
                        {asset.companyName}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-[4px] h-[4px] rounded-full bg-[#1D1D1D66]"></div>
                        <p className="text-[#1D1D1D66] font-medium text-xs">
                          2 hours
                        </p>
                      </div>
                    </div>

                    <p className="text-[16px] mb-2 mt-1 text-[#1d1d1d] leading-normal font-semibold">
                      {asset.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

