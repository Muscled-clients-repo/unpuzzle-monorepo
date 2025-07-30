"use client";

import { useRef } from "react";
import Image from "next/image";
import { ContentCard, CardHeader, CardTitle } from "../../shared/ui/content-card";
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
interface Course {
  image: string;
  title: string;
  description: string;
  duration?: string;
  instructorname?: string;
}

const courses: Course[] = [
  {
    image: "/assets/thumbnailWeb.svg",
    title: "Annotated at 03:39",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
];

const RecentPuzzleCard: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth / 4; // Scroll by 1 card width
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth / 4; // Scroll by 1 card width
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* Enhanced Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm 
                 rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 
                 transition-all duration-200 group"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
      </button>

      {/* Enhanced Card Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-scroll scrollbar-hide w-full px-12 py-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {courses.map((course, index) => (
          <ContentCard
            key={index}
            className="group rounded-xl bg-white min-h-[280px] relative border border-gray-100 
                     shadow-md hover:shadow-xl flex-none w-[280px] scroll-snap-align-start
                     transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Enhanced Thumbnail */}
            <div className="relative w-full h-[160px] rounded-t-xl overflow-hidden">
              <Image
                src={course.image}
                alt="Course Thumbnail"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Play Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 flex items-center justify-center">
                <PlayCircleIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Enhanced Card Content */}
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-base font-bold text-gray-900 leading-tight 
                                   group-hover:text-blue-600 transition-colors duration-200">
                  {course.title}
                </CardTitle>
                {course.duration && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {course.description}
              </p>

              {course.instructorname && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700">
                    by {course.instructorname}
                  </p>
                </div>
              )}
              
              {index === 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full 
                                 text-xs font-medium bg-red-100 text-red-700">
                    <PlayCircleIcon className="h-3 w-3 mr-1" />
                    Puzzle Journey
                  </span>
                </div>
              )}
            </CardHeader>
          </ContentCard>
        ))}
      </div>

      {/* Enhanced Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm 
                 rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 
                 transition-all duration-200 group"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600" />
      </button>
    </div>
  );
};

export default RecentPuzzleCard;
