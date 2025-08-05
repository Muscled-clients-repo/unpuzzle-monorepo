"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useGetAllEnrollsQuery,
  useDeleteEnrollMutation,
} from "../../redux/services/enroll.services";
import { usePathname } from "next/navigation";
import { CourseCard } from "./Courses/CourseCard";
import { clearIndexes } from "../../redux/features/selectedCourse/selectedIndexSlice";
import { EnrolledCourse, EnrolledCoursesData } from "../../types/course.types";
import CreateCourseModal from "./Courses/CreateCourseModal";
import SelectCourseVideoModal from "./Courses/SelectCourseVideoModal";
import LoadingSpinner from "./Loading";

// Types

type User = {
  publicMetadata?: {
    privileges?: string;
  };
};

type RootState = {
  user: {
    user: User | null;
  };
};

type LayoutType = "grid-4" | "grid-3" | "list";

const CourseScreen: React.FC = () => {
  const pathname = usePathname();
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(
    null
  );
  const [layout, setLayout]: any = useState<LayoutType>("grid-4");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const { data: courses, isLoading, error } = useGetAllEnrollsQuery(undefined);
  const [deleteCourses] = useDeleteEnrollMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (courses) {
      let updatedCourses: EnrolledCourse[] = Array.isArray(courses) ? courses : (courses as any)?.data || [];

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

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleOpenSelectModal = (data: any) => {
    console.log("courseData", data);
    setIsSelectModalOpen(true);
  };
  const handleCloseSelectModal = () => setIsSelectModalOpen(false);

  const { user } = useSelector((state: RootState) => state.user);
  const userRules: string = "student";
  //const userRules: string = "teacher";
  const userRole = user?.publicMetadata?.privileges || "student";
  const canEdit = userRole === "student" || userRole === "teacher";

  const handleBackClick = () => {
    setSelectedCourse(null);
  };

  const handleFilterClick = (filter: string) => {
    setFilterType(filter);
  };

  const { selectedIndexes } = useSelector((state: any) => state.selectedIndex);
  const isAnySelected = selectedIndexes.length > 0;
  console.log("Selected Indexes", selectedIndexes);

  const handleButtonClick = async () => {
    if (selectedIndexes.length > 0) {
      try {
        await Promise.all(
          selectedIndexes.map((id: string) => deleteCourses(id).unwrap())
        );

        console.log("Courses deleted successfully");
        dispatch(clearIndexes()); // Clear selection after deletion
      } catch (error) {
        console.error("Error deleting courses:", error);
      }
    } else {
      handleOpenCreateModal();
    }
  };

  console.log("selected index", selectedIndexes);

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

          {userRules === "teacher" && (
            <div className="flex gap-2 items-center">
              <button
                onClick={handleButtonClick}
                className="cursor-pointer bg-[#1D1D1D] font-medium text-white text-sm rounded-[8px] px-4 py-[10px]"
              >
                {isAnySelected ? "Delete" : "Create Course"}
              </button>
            </div>
          )}

          <CreateCourseModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onNext={(data: any) => {
              handleCloseCreateModal();
              handleOpenSelectModal(data);
            }}
            isEdit={false}
          />

          <SelectCourseVideoModal
            isOpen={isSelectModalOpen}
            onClose={handleCloseSelectModal}
            courseId={selectedCourse?.id || ''}
          />
        </div>
        <div className="overflow-auto h-[75vh]">
          {isLoading && (
            <div className="w-full h-full">
              <LoadingSpinner />
            </div>
          )}
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
                  <CourseCard layout={layout} course={course as any} index={index} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseScreen;
