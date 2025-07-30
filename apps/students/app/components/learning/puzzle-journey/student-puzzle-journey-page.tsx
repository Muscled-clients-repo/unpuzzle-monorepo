"use client";

import { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import RecentActivityCard from './recent-activity-card';
import { LearningJourneyCard } from './learning-journey-card';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with modern gradient */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-between items-center py-5 px-8">
          {/* Modern Search Bar */}
          <div className="relative w-[55%] max-w-2xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search puzzles, courses, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                         text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-200
                         hover:bg-gray-100"
              />
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 
                           hover:from-blue-700 hover:to-blue-800 text-white font-semibold 
                           px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 
                           transition-all duration-200">
            <AcademicCapIcon className="h-5 w-5" />
            Continue as Teacher
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-8 lg:px-12 py-8">
        {/* Recent Puzzle Section with enhanced styling */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Recent Puzzle Pieces
              </h1>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm 
                             flex items-center gap-1 group transition-colors duration-200">
              View All
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <RecentActivityCard />
          </div>
        </div>

        {/* My Puzzle Journey Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              My Puzzle Journey
            </h2>
            
            {/* Enhanced Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 
                         rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-200
                         shadow-sm hover:shadow-md"
                onClick={toggleDropdown}
              >
                <span className="text-gray-700 font-medium text-sm">
                  {filter}
                </span>
                <ChevronDownIcon 
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                              border border-gray-200 overflow-hidden z-50 animate-in fade-in 
                              slide-in-from-top-2 duration-200">
                  <div
                    className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer 
                             text-sm font-medium text-gray-700 transition-colors duration-150"
                    onClick={() => handleFilterChange("All")}
                  >
                    All Puzzles
                  </div>
                  <div
                    className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer 
                             text-sm font-medium text-gray-700 transition-colors duration-150"
                    onClick={() => handleFilterChange("Annotations")}
                  >
                    Annotations
                  </div>
                  <div
                    className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer 
                             text-sm font-medium text-gray-700 transition-colors duration-150"
                    onClick={() => handleFilterChange("Confusions")}
                  >
                    Confusions
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Grid Layout for Journey Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item, index) => (
              <LearningJourneyCard
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
    </div>
  );
};

export default PuzzleContentScreen;
