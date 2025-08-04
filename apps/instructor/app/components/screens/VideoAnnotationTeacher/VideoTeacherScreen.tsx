import { useDispatch, useSelector } from "react-redux";
import CourseInstructorDetail from "./CourseInstructorDetail";
import CourseContent from "./CourseContent";
import NewVideoPlayer from "./NewVideoPlayer";
import { ViewAllCommentProvider } from "../../../context/ViewAllCommentContext";

export default function VideoTeacherScreen() {
  const userRole: string = "admin";
  console.log(userRole);
  const canEdit: boolean = userRole === "admin" || userRole === "teacher";

  return (
    <div className="flex flex-row gap-[20px]  px-6 bg-[white] dark:bg-[#0F0F0F] ">
      {/* Left Side: Video Player and Content */}
      <div className="flex flex-col flex-1 w-[70%] mt-4">
        {/* Video Player */}
        <div className="">
          <NewVideoPlayer />
        </div>
        {/* About Course */}
        <div className="rounded-lg p-4 bg-gray-100 dark:bg-[#0F0F0F]  min-w-full">
          <div className="mb-4 items-center  pt-2 border-b border-gray-300   pb-3 space-y-1">
            <h2 className="text-2xl font-semibold text-[#1D1D1D] dark:text-white">
              Introductions to website design
            </h2>
            <p className="text-[#1D1D1D] dark:text-white text-base font-semibold">
              Ecommerce, Web Design, Shopify
            </p>
            <p className="text-[#55565B] dark:text-white text-base font-normal">
              Vue (pronounced /vjuː/, like view) is a progressive framework for
              building user interfaces. Unlike other monolithic frameworks, Vue
              is designed from the ground up to be incrementally adoptable.
            </p>
          </div>
        </div>
        {/* Course Content */}
        <div className="rounded-lg">
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
}
