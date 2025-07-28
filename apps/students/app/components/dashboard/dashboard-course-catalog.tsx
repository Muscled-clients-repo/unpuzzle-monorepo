import React, { useMemo } from "react";
import { dummyCourses } from "../sampleData/dummyInput";
import DataTable from "../shared/data-table";

const CourseCatalog = React.memo(() => {
  // Define the columns for the table
  const columns = useMemo(() => [
    { title: "Courses", key: "courseTitle" }, // Link column for courses
    { title: "Chapters", key: "numberOfChapters" },
    { title: "Duration", key: "courseDuration" },
  ], []);

  return (
    <div className=" px-6 py-9">
      <div className=" text-[32px]">Course Catalog</div>
      <div className="course-table">
        <div className="relative flex flex-col w-full h-full  text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <DataTable
            columns={columns}
            data={dummyCourses.courses}
            routePrefix="/admin/dashboard/analytics" // Define the route prefix for course navigation
            heading={"All Courses"}
            routing={true}
          />
        </div>
      </div>
    </div>
  );
});

CourseCatalog.displayName = 'CourseCatalog';

export default CourseCatalog;
