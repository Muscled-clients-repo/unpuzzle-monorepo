"use client";
import { useState, useEffect } from "react";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { SelectCourseVideoModalProps } from "@/types/course.types";
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = "https://dev.nazmulcodes.org/api";

interface Chapter {
  chapter_id: string;
  title: string;
  thumbnail: string;
}

const SelectCourseVideoModal: React.FC<SelectCourseVideoModalProps> = ({
  isOpen,
  onClose,
  courseId,
}) => {
  const { getToken } = useAuth();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: "", thumbnail: "" });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [noChapters, setNoChapters] = useState(false);
  const { navigate } = useNavigationWithLoading();

  useEffect(() => {
    if (isOpen && courseId) getChapters();
  }, [isOpen, courseId]);

 
  const getChapters = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/chapters?course_id=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      let chaptersArr = data.data;
      if (chaptersArr && !Array.isArray(chaptersArr)) chaptersArr = [chaptersArr];
      if (!chaptersArr || chaptersArr.length === 0) {
        setNoChapters(true);
        setChapters([]);
      } else {
        setNoChapters(false);
        setChapters(
          (chaptersArr || []).map((ch: any) => ({
            chapter_id: ch.id,
            title: ch.title,
            thumbnail: ch.thumbnail || "",
          }))
        );
      }
    } catch {
      setNoChapters(true);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const generateId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);

  const handleSaveChapter = async () => {
    if (!newChapter.title) return;
    try {
      setLoading(true);
      const token = await getToken();
      const chapterPayload = {
        id: generateId(),
        title: newChapter.title,
        course_id: courseId,
        order_index: 1,
      };
      await fetch(`${API_BASE_URL}/chapters`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chapterPayload),
      });
      setShowCreateModal(false);
      setNewChapter({ title: "", thumbnail: "" });
      await getChapters();
    } catch {} finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") onClose();
  };

  const handleSelect = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddClick = () => navigate("/teacher-annotations");
  const handleCreateClick = () => setShowCreateModal(true);
  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setNewChapter({ title: "", thumbnail: "" });
  };
  const handleInputChange = (field: string, value: string) => {
    setNewChapter((prev) => ({ ...prev, [field]: value }));
  };
  const isAddDisabled = selectedIndexes.length === 0;

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-[#000000a3] flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-5 rounded-lg shadow-lg w-[80%] xl:w-[65%] max-h-[781px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1 pb-3">
          <h2 className="text-2xl text-[#1D1D1D] font-semibold">Create Course</h2>
          <p className="text-base text-[#1D1D1D] font-normal">
            Select course videos for Responsive web design
          </p>
        </div>
        <div
          className="mt-4 bg-[#ECEFF7] py-5 px-[8px] rounded-[20px] max-h-[540px] overflow-y-scroll"
          style={{ scrollbarWidth: "thin" }}
        >
          {noChapters ? (
            <div className="flex flex-col items-center justify-center h-[200px]">
              <p className="text-lg text-gray-600 mb-4">No chapters present. Create one!</p>
              <button
                onClick={handleCreateClick}
                className="bg-[#28A745] h-[43px] w-[160px] rounded-[8px] text-white flex items-center justify-center cursor-pointer hover:bg-[#218838]"
              >
                Create Chapter
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.chapter_id}
                  className={`relative bg-white rounded-lg shadow-sm h-[242px] p-3 cursor-pointer `}
                  onClick={() => handleSelect(index)}
                >
                  <div
                    className={`absolute top-2 left-2 h-[16px] w-[16px] rounded-[4px] border-[0.66px] border-[#8A8A8A] flex items-center justify-center ${
                      selectedIndexes.includes(index)
                        ? "bg-[#00AFF0]"
                        : "bg-white"
                    }`}
                  >
                    {selectedIndexes.includes(index) && (
                      <div className="h-[16px] w-[16px] text-white flex items-center justify-center">
                        <img src="/assets/icons/assets/tickIcon.svg" alt="tickIcon" />
                      </div>
                    )}
                  </div>
                  <img
                    src={chapter.thumbnail}
                    alt="thumbnail"
                    className="rounded-[8px] object-cover h-[162px] w-full"
                  />
                  <h1 className="text-[#1D1D1D] font-semibold text-base mt-2">
                    {chapter.title}
                  </h1>
                  <div className="pt-2 flex items-center justify-between">
                    <img
                      src="/assets/icons/assets/download.svg"
                      alt="download"
                      className="cursor-pointer"
                    />
                    <p className="text-[#55565B] font-medium text-xs">30 mints</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {!noChapters && (
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={handleCreateClick}
              className="bg-[#28A745] h-[43px] w-[96px] rounded-[8px] text-white flex items-center justify-center cursor-pointer hover:bg-[#218838]"
            >
              Create
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleAddClick}
                disabled={isAddDisabled}
                className={`h-[43px] w-[96px] rounded-[8px] text-white flex items-center justify-center cursor-pointer ${
                  isAddDisabled ? "bg-[#00AFF0] opacity-60" : "bg-[#00AFF0]"
                }`}
              >
                Add
              </button>
              <button
                onClick={onClose}
                className="bg-[#D9D9D9] h-[43px] w-[96px] rounded-[8px] text-black flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {showCreateModal && (
        <div
          id="create-modal-backdrop"
          className="fixed inset-0 bg-[#000000a3] flex items-center justify-center z-[60]"
          onClick={(e) => {
            if ((e.target as HTMLDivElement).id === "create-modal-backdrop") handleCreateModalClose();
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1 pb-4">
              <h2 className="text-2xl text-[#1D1D1D] font-semibold">Create New Chapter</h2>
              <p className="text-base text-[#1D1D1D] font-normal">Add a new chapter to your course</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1D1D1D] mb-2">Chapter Title</label>
                <input
                  type="text"
                  value={newChapter.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9D9D9] rounded-[8px] focus:outline-none focus:border-[#00AFF0]"
                  placeholder="Enter chapter title"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleSaveChapter}
                disabled={!newChapter.title}
                className={`h-[43px] w-[96px] rounded-[8px] text-white flex items-center justify-center cursor-pointer ${
                  !newChapter.title ? "bg-[#28A745] opacity-60" : "bg-[#28A745] hover:bg-[#218838]"
                }`}
              >
                Save
              </button>
              <button
                onClick={handleCreateModalClose}
                className="bg-[#D9D9D9] h-[43px] w-[96px] rounded-[8px] text-black flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCourseVideoModal;
