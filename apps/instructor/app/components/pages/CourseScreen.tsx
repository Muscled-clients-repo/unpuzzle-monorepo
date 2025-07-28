"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useGetCoursesQuery, useDeleteCourseMutation } from "../../redux/services/course.services";
import { usePathname } from "next/navigation";
import { clearIndexes } from "../../redux/features/selectedCourse/selectedIndexSlice";
import { EnrolledCourse } from '../../types/course.types';
import CreateCourseModal from "../modals/CreateCourseModal";
import SelectCourseVideoModal from "../modals/SelectCourseVideoModal";
import Image from "next/image";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

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

const CourseScreen: React.FC = () => {
  const pathname = usePathname();
  const { navigate } = useNavigationWithLoading();
  const [filterType, setFilterType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const { data: courses, isLoading } = useGetCoursesQuery(undefined);
  const [deleteCourses] = useDeleteCourseMutation();
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (courses) {
      let updatedCourses: EnrolledCourse[] = courses.data;
      if (filterType !== "All") {
        updatedCourses = updatedCourses.filter(course => course.category === filterType);
      }
      if (searchTerm) {
        updatedCourses = updatedCourses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredCourses(updatedCourses);
    }
  }, [courses, filterType, searchTerm]);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleOpenSelectModal = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsSelectModalOpen(true);
  };
  const handleCloseSelectModal = () => {
    setIsSelectModalOpen(false);
    setSelectedCourseId(null);
  };

  const { user } = useSelector((state: RootState) => state.user);
  const userRules: string = "teacher";
  const userRole = user?.publicMetadata?.privileges || "student";

  const handleFilterClick = (filter: string) => {
    setFilterType(filter);
  };

  const { selectedIndexes } = useSelector((state: any) => state.selectedIndex);
  const isAnySelected = selectedIndexes.length > 0;

  const handleButtonClick = async () => {
    if (selectedIndexes.length > 0) {
      try {
        await Promise.all(selectedIndexes.map((id: string) => deleteCourses({ courseId: id })));
        dispatch(clearIndexes());
      } catch (error) {}
    } else {
      handleOpenCreateModal();
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and create your educational content</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image src="/assets/searchIcon.svg" width={20} height={20} alt="search" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Create Course Button */}
            {userRules === "teacher" && (
              <button
                onClick={handleButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                {isAnySelected ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Course
                  </>
                )}
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "Shopify UI", "Shopify Theme Design", "App Development"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterType === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden group"
              >
                {/* Course Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-4xl font-bold text-white">
                        {course.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {course.description || "No description available"}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {course.duration || "Duration not set"}
                    </span>
                    {course.category && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      View Course
                    </button>
                    {userRules === "teacher" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSelectModal(course.id);
                        }}
                        className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCourseModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onNext={(courseId: string) => {
          handleCloseCreateModal();
          handleOpenSelectModal(courseId);
        }}
        isEdit={false}
        courseId={undefined}
      />
      
      {isSelectModalOpen && selectedCourseId && (
        <SelectCourseVideoModal
          isOpen={isSelectModalOpen}
          onClose={handleCloseSelectModal}
          courseId={selectedCourseId}
        />
      )}
    </div>
  );
};

export default CourseScreen;