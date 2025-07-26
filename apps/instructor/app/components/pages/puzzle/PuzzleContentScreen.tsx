"use client"

import { useState } from "react";
import Image from "next/image";

// import SearchIcon from "../../assets/searchIcon.svg";
import RecentPuzzleCard from "./RecentPuzzleCard";
import { UnpuzzleJourneyCard } from "./UnpuzzleJourneyCard";
// import thumbnail from "../../assets/courseThumbnail.svg";
// import thumbnailWeb from "../../assets/thumbnailWebCourse.svg";

const data = [
  {
    id: 1,
    title: "How I Find Influencers That Make Me $14K A Week...",
    badge: "Solved",
    thumbnail: "/assets/courseThumbnail.svg",
    annotationStatus: "Confusions",
  },
  {
    id: 2,
    title: "The Secrets to Growing a Business with Minimal Resources...",
    thumbnail: "/assets/thumbnailWebCourse.svg",
    annotationStatus: "Annotations",
  },
  {
    id: 3,
    title: "10 Strategies for Effective Social Media Marketing...",
    badge: "Solved",
    thumbnail: "/assets/courseThumbnail.svg",
    annotationStatus: "Confusions",
  },
  {
    id: 4,
    title: "The Secrets to Growing a Business with Minimal Resources...",
    thumbnail: "/assets/thumbnailWebCourse.svg",
    annotationStatus: "Annotations",
  },
  {
    id: 5,
    title: "Building a Loyal Customer Base from Scratch...",
    badge: "Solved",
    thumbnail: "/assets/courseThumbnail.svg",
    annotationStatus: "Confusions",
  },
  {
    id: 6,
    title: "Mastering the Art of Negotiation in Business...",
    thumbnail: "/assets/thumbnailWebCourse.svg",
    annotationStatus: "Confusions",
  },
  {
    id: 7,
    title: "Turning Your Passion Into a Profitable Venture...",
    thumbnail: "/assets/courseThumbnail.svg",
    annotationStatus: "Confusions",
  },
  {
    id: 8,
    title: "The Secrets to Growing a Business with Minimal Resources...",
    thumbnail: "/assets/thumbnailWebCourse.svg",
    annotationStatus: "Annotations",
  },
];

const PuzzleContentScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
    setIsDropdownOpen(false);
  };

  const filteredData =
    filter === "All"
      ? data
      : data.filter((item) => item.annotationStatus === filter);
  return (
    <div className="">
      {/* header  */}
      <div className="border-b border-b-[#F4EEEE] flex justify-between py-[14px] px-[40px]">
        <div className="w-[50%] flex items-center px-4 py-2 bg-[#F5F4F6] rounded-[100px]">
          {/* <img src={SearchIcon} alt="searchIcon" /> */}
          <Image
            src="/assets/searchIcon.svg"
            width={15}
            height={15}
            alt="searchIcon"
          />

          <input
            type="text"
            placeholder="Search or type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none bg-transparent px-3 bg-"
          />
        </div>

        <button className="cursor-pointer bg-[#1D1D1D] font-medium text-white text-sm rounded-[8px] px-4 py-[10px]">
          Continue as Teacher
        </button>
      </div>

      <div className="px-[40px]">
        <div className="flex justify-between mt-12">
          <h1 className="text-black text-2xl font-bold ">
            Recent Puzzle pieces
          </h1>
          <p className="text-[#1CABF2] text-sm underline font-normal cursor-pointer">
            View All
          </p>
        </div>

        <div className="mt-4">
          <RecentPuzzleCard />
        </div>

        <div className="flex items-center justify-between mt-16">
          <h1 className="text-[#1D1D1D] font-bold text-xl">
            My puzzle journey
          </h1>
          <div className="relative">
            <div
              className="flex items-center cursor-pointer border border-[#1D1D1D1A] p-[6px]"
              onClick={toggleDropdown}
            >
              {/* Use `filter` state to display the selected filter */}
              <span className="text-[#1D1D1D] font-medium text-sm">
                {filter}
              </span>
              <svg
                className={`ml-2 w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md border border-gray-200 z-50">
                <div
                  className="px-4 py-[6px] hover:bg-[#00AFF0] hover:text-white cursor-pointer text-sm"
                  onClick={() => handleFilterChange("All")}
                >
                  All
                </div>
                <div
                  className="px-4 py-[6px] hover:bg-[#00AFF0] hover:text-white cursor-pointer text-sm"
                  onClick={() => handleFilterChange("Annotations")}
                >
                  Annotations
                </div>
                <div
                  className="px-4 py-[6px] hover:bg-[#00AFF0] hover:text-white cursor-pointer text-sm"
                  onClick={() => handleFilterChange("Confusions")}
                >
                  Confusions
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 gap-4 flex flex-wrap">
          {filteredData.map((item, index) => (
            <UnpuzzleJourneyCard
              key={index}
              title={item.title}
              badge={item.badge}
              thumbnail={item.thumbnail}
              annotationStatus={item.annotationStatus}
              cardId={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleContentScreen;
