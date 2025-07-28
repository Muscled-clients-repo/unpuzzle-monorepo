"use client";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentCard, CardHeader, CardTitle } from "../shared/ui/content-card";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "../../redux/store";
import {
  Course,
  CourseCardProps,
  UserState,
} from "../../types/course.types";
import {
  useCreateEnrollMutation,
} from "../../redux/services/enroll.services";
import Image from "next/image";

export const CourseCard: React.FC<CourseCardProps> = React.memo(({
  layout,
  index,
  course,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = course?.id;
  const dispatch = useDispatch();
  const [createEnroll, { isLoading, error }] = useCreateEnrollMutation();

  const user = useSelector((state: RootState) => state.user.user);

  const handleClick = useCallback(() => {
    router.push("/student-annotations");
  }, [router]);

  const handleEnroll = useCallback(async () => {
    if (!user?.id || !course?.id) {
      console.error("User ID or Course ID is missing!");
      return;
    }
    try {
      const response = await createEnroll({
        userId: user.id,
        courseId: course.id,
      }).unwrap();
      // Enrollment successful
    } catch (err) {
      console.error("Error enrolling into course:", err);
    }
  }, [user?.id, course?.id, createEnroll]);

  const cardStyle = useMemo(() => 
    layout === "grid-1"
      ? "flex flex-row items-center gap-[24px]"
      : "flex flex-col gap-[12px]",
    [layout]
  );

  const buttonContent = useMemo(() => {
    if (pathname === "/my-courses") {
      return (
        <button
          onClick={handleClick}
          className="bg-[#00AFF0] text-[#FFFFFF] cursor-pointer h-[25px] font-[550] text-xs rounded-[4px] py-[6px] flex items-center justify-center"
        >
          Continue
        </button>
      );
    }
    
    if (pathname === "/courses") {
      return (
        <button
          onClick={handleEnroll}
          className="bg-[#00AFF0] text-[#FFFFFF] cursor-pointer h-[25px] font-[550] text-xs rounded-[4px] py-[6px] flex items-center justify-center 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Enroll
        </button>
      );
    }
    
    return null;
  }, [pathname, handleClick, handleEnroll]);

  const descriptionClassName = useMemo(() => 
    `text-[#55565B] text-start font-normal m-0 text-[12px] leading-normal ${
      layout === "grid-1" ? "truncate" : "truncate-2-lines"
    } flex-1`,
    [layout]
  );

  const headerClassName = useMemo(() => 
    `mt-3 flex items-center ${
      layout === "grid-1" ? " justify-start gap-1" : "justify-between"
    }`,
    [layout]
  );

  return (
    <ContentCard
      className={`p-3 ${cardStyle} rounded-[15.5px] bg-white min-h-[260.98px] relative border shadow group`}
    >
      <Image
        className="object-cover rounded-[10px]"
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
        <p className={descriptionClassName}>
          {course.description}
        </p>
        <div className={headerClassName}>
          <span className="text-[#65686C] font-normal text-xs pb-2">
            Public • 1h 35min • Free
          </span>
        </div>
        {buttonContent}
        {layout === "grid-1" && (
          <div className="text-[#1D1D1D] text-[14px] font-medium">
            {course.duration}
          </div>
        )}
      </CardHeader>
    </ContentCard>
  );
});

CourseCard.displayName = 'CourseCard';