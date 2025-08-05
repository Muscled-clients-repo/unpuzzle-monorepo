"use client";
import React, { useMemo, useState } from "react";
import Table from "../shared/Table";
import { useGetCoursesQuery } from "../../redux/hooks";
import LoadingSpinner from "../screens/Loading";
import { CoursesApiResponse, EnrolledCourse } from "../../types/course.types";

const CourseCatalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch courses from API with pagination
  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useGetCoursesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Define the columns for the table
  const columns = [
    { title: "Course Title", key: "title" },
    { title: "Chapters", key: "chapterCount" },
    { title: "Videos", key: "videoCount" },
    { title: "Created Date", key: "createdDate" },
  ];

  // Transform the API data to match table requirements
  const transformedData = useMemo(() => {
    if (!coursesResponse?.data || !Array.isArray(coursesResponse.data))
      return [];

    return coursesResponse.data.map((course: EnrolledCourse) => ({
      id: course.id,
      title: course.title,
      chapterCount:
        course.chapters_count !== undefined
          ? course.chapters_count.toString()
          : "Not found",
      videoCount:
        course.videos_count !== undefined
          ? course.videos_count.toString()
          : "Not found",
      createdDate: new Date(
        course.created_at || course.createdAt || new Date()
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));
  }, [coursesResponse]);

  // Pagination data from API
  const totalCount = coursesResponse?.count || 0;
  const totalPages = coursesResponse?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  console.log("course is: ", coursesResponse);
  if (error) {
    return (
      <div className="px-6 py-9">
        <div className="text-red-500">
          Error loading courses. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-9">
      <div className="text-[32px] mb-6">Course Catalog</div>
      <div className="course-table">
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <Table
            columns={columns}
            data={transformedData}
            routePrefix="/instructor/dashboard/analytics"
            heading={`All Courses (${totalCount})`}
            routing={true}
          />

          {/* Backend Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              {/* Show page numbers */}
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>

              <span className="text-sm text-gray-600 ml-4">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
