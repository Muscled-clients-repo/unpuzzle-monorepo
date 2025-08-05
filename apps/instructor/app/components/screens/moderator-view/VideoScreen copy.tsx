import { useDispatch, useSelector } from "react-redux";

import NewVideoPlayer from "./NewVideoPlayer";
import CourseInstructorDetail from "./CourseInstructorDetail";
import CourseContent from "./CourseContent";
import { ViewAllCommentProvider } from "../../../context/ViewAllCommentContext";

type UserRole = "teacher" | "student" | "admin" | "guest";
const VideoScreen: React.FC = () => {
  const userRole: UserRole = "teacher"; // Hardcoded for demonstration
  const canEdit: boolean = userRole === "teacher" || userRole === "student";
  return (
    <div className="flex flex-row   px-6 gap-[20px]">
      {/* Left Side: Video Player and Content */}
      <div className="flex flex-col flex-1 w-[70%] mt-4">
        {/* Video Player */}
        <div className="mb-6">
          <NewVideoPlayer />
        </div>
        {/* About Course */}
        <div className="rounded-lg p-4  min-w-full">
          <div className="mb-4 items-center  pt-2 border-b border-gray-300  pb-3 space-y-1">
            <h2 className="text-2xl font-semibold text-[#1D1D1D] dark:text-white">
              Introductions to website design
            </h2>
            <p className="text-[#55565B] text-base font-normal">
              Ecommerce, Web Design, Shopify
            </p>
            <div className="flex gap-6">
              <p className="font-bold text-base">
                385K <span className="font-[300]  text-base">Views</span>
              </p>
              <span className="font-[300] text-base">Updated 3 weeks ago</span>
            </div>
          </div>
        </div>
        {/* Course Content */}
        <div className="bg-white dark:bg-[#0F0F0F] rounded-lg">
          <CourseContent />
        </div>
      </div>

      {/* Right Side: Instructor Details */}
      <div className="flex flex-col gap-2 w-[30%] border-l">
        <div className="flex-1 h-full">
          <ViewAllCommentProvider>
            <CourseInstructorDetail />
          </ViewAllCommentProvider>
        </div>
      </div>
    </div>
  );
};

export default VideoScreen;
