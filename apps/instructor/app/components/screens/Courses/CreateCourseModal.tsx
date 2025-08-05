"use client";
import { MouseEvent, useEffect, useState } from "react";
import { CreateCourseModalProps } from "../../../types/course.types";
import { useCourse } from "@/app/hooks/useCourse";
import CreateChaptersModal from "./CreateChaptersModal";
import { useOptionalAuth } from "../../../hooks/useOptionalAuth";

interface CreateCourseModalPropsFixed extends Omit<CreateCourseModalProps, 'onNext'> {
  onNext: (courseId: string) => void;
}
const API_BASE_URL = "https://dev.nazmulcodes.org/api";
// Remove TestApiComponent and its usage

const CreateCourseModal: React.FC<CreateCourseModalPropsFixed> = ({
  isOpen,
  onClose,
  isEdit,
  courseId,
  onNext,
}) => {
  const { createCourse, updateCourse, loading } = useCourse();
  const { getToken } = useOptionalAuth();
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
    }
  };



  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const thumbnail = formData.get('thumbnail') as File;
    if (!title || !description) return;
    const courseData = {
      title,
      description,
      price,
      visibility: 'public' as const,
    };
    try {
      const response = await createCourse(courseData);
      if (response) {
        setCreatedCourseId(response.id);
        setShowChaptersModal(true);
      }
    } catch (err) {}
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    courseId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const thumbnail = formData.get('thumbnail') as File;
    if (!title || !description) return;
    const courseData = {
      title,
      description,
      price,
      visibility: 'public' as const
    };
    try {
      await updateCourse(courseId, courseData);
      setCreatedCourseId(courseId);
      setShowChaptersModal(true);
    } catch (error) {}
  };

  const handleChaptersModalClose = () => {
    setShowChaptersModal(false);
    setCreatedCourseId(null);
    onClose();
  };

  // Remove apiTestRes function

  return (
    <>
      {/* TestApiComponent removed */}
      <div
        id="modal-backdrop"
        className="fixed inset-0 bg-[#000000a3] flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        {loading && (
          <div className="absolute center z-index-1" role="status">
            
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <div
          className="bg-white p-4 rounded-lg shadow-lg w-[50%] xl:w-[38%]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Removed Test API button here */}
          <div className="flex justify-between items-center pb-3">
            <h2 className="text-2xl text-[#1D1D1D] font-semibold">
              {isEdit ? "Edit Course" : "Create Course"}
            </h2>
          </div>
          <form
            onSubmit={(e) =>
              isEdit && courseId ? handleUpdate(e, courseId) : handleCreate(e)
            }
          >
            <div className="mt-2">
              <label className=" text-[#1D1D1D] font-medium text-sm">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="UI/UX Design"
                className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <div className="w-[50%]">
                <label className=" text-[#1D1D1D] font-medium text-sm">
                  Price
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  placeholder="Price"
                  className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <label className=" text-[#1D1D1D] font-medium text-sm">
                Upload thumbnail
              </label>
              <input type="file" name="thumbnail" />
            </div>
            <div className="mt-5">
              <label className=" text-[#1D1D1D] font-medium text-sm">
                Course Description
              </label>
              <textarea
                required
                name="description"
                placeholder="Learn how to design the Shopify interfaces with a practical Figma tutorial for UI/UX professionals like me and others."
                className="mt-1 w-full border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] outline-none min-h-[137px] text-[#1D1D1D] font-normal text-sm"
              ></textarea>
            </div>
            <div className="mt-2">
              <button
                type="submit"
                className="cursor-pointer bg-[#00AFF0] font-medium text-white text-sm rounded-[8px] h-[44px] w-[22%] flex items-center justify-center"
              >
                {isEdit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showChaptersModal && createdCourseId && (
        <CreateChaptersModal
          isOpen={showChaptersModal}
          onClose={handleChaptersModalClose}
          courseId={createdCourseId}
        />
      )}
    </>
  );
};

export default CreateCourseModal;