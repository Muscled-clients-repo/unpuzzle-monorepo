"use client";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle } from "../../shared/ui/Card";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "../../../redux/store";
import {
  Course,
  CourseCardProps,
  UserState,
} from "../../../types/course.types";
import CreateCourseModal from "./CreateCourseModal";
import { useState } from "react";
import { toggleIndex } from "../../../redux/features/selectedCourse/selectedIndexSlice";
import {
  useCreateEnrollMutation,
  useDeleteEnrollMutation,
} from "../../../redux/services/enroll.services";
import Image from "next/image";

export const CourseCard: React.FC<CourseCardProps> = ({
  layout,
  index,
  course,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = course?.id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const dispatch = useDispatch();
  const [createEnroll, { isLoading, error }] = useCreateEnrollMutation();

  const { selectedIndexes } = useSelector((state: any) => state.selectedIndex);

  const handleSelect = (index: string) => {
    dispatch(toggleIndex(index));
  };

  const user = useSelector((state: any) => state.user);
  //const userRules: string = "student";
  const userRules: string = "teacher";
  //const userRole = user?.publicMetadata?.privileges || "student";
  //const canEdit = userRole === "student" || userRole === "teacher";

  const handleClick = () => {
    router.push("/student-annotations");
  };

  const handleEnroll = async () => {
    if (!user?.id || !course?.id) {
      console.error("User ID or Course ID is missing!");
      return;
    }
    try {
      const response = await createEnroll({
        userId: user.id,
        courseId: course.id,
      }).unwrap();
      console.log("Enrollment successful:", response);
    } catch (err) {
      console.error("Error enrolling into course:", err);
    }
  };

  const totalStars = 5;

  const cardStyle =
    layout === "grid-1"
      ? "flex flex-row items-center gap-[24px]"
      : "flex flex-col gap-[12px]";

  return (
    <Card
      className={`p-3 ${cardStyle}   rounded-[15.5px] bg-white  min-h-[260.98px] relative border shadow group`}
    >
      {/* {userRules === "student" && (
          location.pathname === "/my-courses" ? (
            <button
              onClick={() => handleDeleteEnroll(courseId)} // Call handleClick for "Continue"
              className="absolute top-0 right-0"
            >
              <Image src={deleteIcon} width={24} height={24} />
            </button>
          ) : null
        )} */}

      {userRules === "teacher" && (
        <>
          <div
            onClick={() => handleSelect(courseId)}
            className={`absolute top-5 left-5 h-[16px] w-[16px] rounded-[4px] border-[0.66px] border-[#8A8A8A] flex items-center justify-center cursor-pointer ${
              selectedIndexes.includes(courseId) ? "bg-[#00AFF0]" : "bg-white"
            }`}
          >
            {selectedIndexes.includes(courseId) && (
              <div className="h-[16px] w-[16px] text-white flex items-center justify-center">
                <Image
                  src="/assets/icons/assets/tickIcon.svg"
                  alt="tickIcon"
                  width={12}
                  height={12}
                />
              </div>
            )}
          </div>
          <div
            className="absolute top-5 right-5 cursor-pointer"
            onClick={handleOpenCreateModal}
          >
            <Image
              src="/assets/editIcon 2.svg"
              alt="editIcon"
              width={12}
              height={12}
            />
          </div>
        </>
      )}
      <Image
        className={`object-cover rounded-[10px]`}
        src={course.thumbnail || '/placeholder-course.jpg'}
        width={200}
        height={120}
        loading="lazy"
        alt="Course Thumbnail"
        crossOrigin="anonymous"
      />
      <CardHeader className="p-0 gap-0 w-full">
        <CardTitle className="text-base text-[#1D1D1D] text-start leading-normal font-semibold">
          {course.title}
        </CardTitle>
        <p
          className={`text-[#55565B] text-start font-normal m-0 text-[12px] leading-normal ${
            layout === "grid-1" ? "truncate" : "truncate-2-lines"
          } flex-1`}
        >
          {course.description}
        </p>
        <div
          className={`mt-3 flex items-center  ${
            layout === "grid-1" ? " justify-start gap-1" : "justify-between"
          }`}
        >
          <span className="text-[#65686C] font-normal text-xs pb-2">
            Public • 1h 35min • Free
          </span>
        </div>
        {userRules === "student" &&
          (pathname === "/my-courses" ? (
            <button
              onClick={handleClick} // Call handleClick for "Continue"
              className="bg-[#00AFF0] text-[#FFFFFF] cursor-pointer h-[25px] font-[550] text-xs rounded-[4px] py-[6px] flex items-center justify-center"
            >
              Continue
            </button>
          ) : pathname === "/all-courses" ? (
            <button
              onClick={handleEnroll} // Call handleEnroll for "Enroll"
              className="bg-[#00AFF0] text-[#FFFFFF] cursor-pointer h-[25px] font-[550] text-xs rounded-[4px] py-[6px] flex items-center justify-center 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Enroll
            </button>
          ) : null)}
        {layout === "grid-1" ? (
          <div className="text-[#1D1D1D] text-[14px] font-medium">
            {course.duration}
          </div>
        ) : null}
      </CardHeader>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onNext={() => {}}
        isEdit
        courseId={courseId}
      />
    </Card>
  );
};
