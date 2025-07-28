// app/admin/dashboard/[courseId]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { dummyCourses } from "../sampleData/dummyInput";
import DataTable from "../shared/data-table"; // Assuming your Table component is in shared folder

const Videos = () => {
  const { courseId } = useParams(); // Access the courseId from the URL
  const [videos, setVideos] = useState<any[] | null>(null);

  useEffect(() => {
    // Find the course with the corresponding courseId
    const course = dummyCourses.courses.find(
      (course) => course.id === courseId
    );
    // If the course is found, set the videos for that course
    if (course) {
      setVideos(course.chapters); // Assuming `videos` are part of the course object
    } else {
      setVideos([]);
    }
  }, [courseId]); // Re-run the effect whenever the courseId changes

  // Define the columns for the video table
  const columns = [
    { title: "Title", key: "chapterTitle" },
    { title: "Duration", key: "chapterDuration" },
    { title: "Puzzle Hint", key: "puzzleHint" },
    { title: "Puzzle Check", key: "puzzleCheck" },
    { title: "Puzzle Reflect", key: "puzzleReflect" },
    { title: "Puzzle Path", key: "puzzlePath" },
  ];

  return (
    <div className="px-6 py-9">
      <div className="text-[32px]">Videos</div>
      <div className="course-table">
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          {videos && videos?.length > 0 && (
            <DataTable
              columns={columns}
              data={videos} // Pass the filtered videos to the Table component
              routePrefix={`/admin/dashboard/analytics/${courseId}`} // Define the route prefix for course navigation
              heading={"All Videos"}
              routing={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos;
