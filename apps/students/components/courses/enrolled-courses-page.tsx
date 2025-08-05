"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useGetAllEnrollsQuery,
} from "../../redux/services/enroll.services";
import { CourseCard } from "./course-card";
import { EnrolledCourse } from "../../types/course.types";
import { CourseListSkeleton } from "@unpuzzle/ui";

// Types
type LayoutType = "grid-4" | "grid-3" | "list";

const CourseScreen: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("All");
  const [layout] = useState<LayoutType>("grid-4");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const { data: courses, isLoading } = useGetAllEnrollsQuery(undefined);

  useEffect(() => {
    if (courses) {
      let updatedCourses: EnrolledCourse[] = courses;

      if (filterType !== "All") {
        updatedCourses = updatedCourses.filter(
          (course) => course.category === filterType
        );
      }

      if (searchTerm) {
        updatedCourses = updatedCourses.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredCourses(updatedCourses);
    }
  }, [courses, filterType, searchTerm]);


  const handleFilterClick = (filter: string) => {
    setFilterType(filter);
  };

  return (
    <div>
      <div className="px-10">
        <div className="w-[70%] flex items-center px-4 py-2 bg-[#F5F4F6] rounded-[100px]">
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
        <div className="flex justify-between items-center w-full mb-5 mt-3">
          <div className="flex items-center gap-2">
            <button
              className={`py-[12px] w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "All"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("All")}
            >
              All
            </button>
            <button
              className={`py-[12px] w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "Shopify UI"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("Shopify UI")}
            >
              Shopify UI
            </button>
            <button
              className={`py-3 w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "Shopify Theme Design"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("Shopify Theme Design")}
            >
              Shopify Theme Design
            </button>

            <button
              className={`py-3 w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "App Development"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("App Development")}
            >
              App Development
            </button>
          </div>

        </div>
        <div className="overflow-auto h-[75vh]">
          {isLoading ? (
            <CourseListSkeleton count={8} />
          ) : (
            <div
              className={`pr-[20px] grid ${
                layout === "grid-1"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } gap-x-[15px] gap-y-6`}
            >
              {filteredCourses.map((course, index) => (
                <button
                  key={index}
                  // onClick={() => handleCardClick(course)}
                  className=" cursor-pointer"
                >
                  <div>
                    <CourseCard layout={layout} course={course} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseScreen;
