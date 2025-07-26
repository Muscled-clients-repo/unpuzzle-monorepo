"use client"

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = "https://dev.nazmulcodes.org/api";

interface CreateChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

// Add Video type
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

// Update Chapter type
interface Chapter {
  title: string;
  videos: Video[];
}

const CreateChaptersModal: React.FC<CreateChaptersModalProps> = ({ isOpen, onClose, courseId }) => {
  const { getToken } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([{ title: "", videos: [] }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [chapterTitleErrors, setChapterTitleErrors] = useState<number[]>([]);

  // 1. Update static video data with provided thumbnails
  const VIDEO_LIBRARY: Video[] = [
    { id: '1', title: 'Shopify UI UX Design in Figma', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '30 mins' },
    { id: '2', title: 'React Basics Crash Course', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '45 mins' },
    { id: '3', title: 'Advanced CSS Animations', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '25 mins' },
    { id: '4', title: 'UI Patterns for Mobile', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '40 mins' },
    { id: '5', title: 'Wireframing Essentials', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '35 mins' },
    { id: '6', title: 'Prototyping in Figma', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '50 mins' },
    { id: '7', title: 'Design Systems Overview', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '38 mins' },
    { id: '8', title: 'Typography for Web', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '28 mins' },
    { id: '9', title: 'Color Theory Basics', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '32 mins' },
    { id: '10', title: 'Component Libraries', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '42 mins' },
    { id: '11', title: 'UX Research Methods', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_48.png?v=1749733728', duration: '27 mins' },
    { id: '12', title: 'Accessibility in Design', thumbnail: 'https://cdn.shopify.com/s/files/1/0562/7763/1105/files/Rectangle_28.png?v=1749733728', duration: '36 mins' },
  ];

  // 2. Add state for video modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalChapterIdx, setVideoModalChapterIdx] = useState<number | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]); // video ids for modal selection

  // 3. Update chapter state to store video objects instead of strings
  //    (for backward compatibility, handle both string and object)

  // 4. Open modal on addVideo
  const openVideoModal = (chapterIdx: number) => {
    setVideoModalChapterIdx(chapterIdx);
    setSelectedVideos(chapters[chapterIdx].videos.map((v) => v.id));
    setVideoModalOpen(true);
  };

  // 5. Handle video selection in modal
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleAddVideosToChapter = () => {
    if (videoModalChapterIdx === null) return;
    const selectedVideoObjs = VIDEO_LIBRARY.filter(v => selectedVideos.includes(v.id));
    setChapters(
      chapters.map((ch, i) =>
        i === videoModalChapterIdx ? { ...ch, videos: selectedVideoObjs } : ch
      )
    );
    setVideoModalOpen(false);
    setVideoModalChapterIdx(null);
    setSelectedVideos([]);
  };

  const handleRemoveVideoFromChapter = (chapterIdx: number, videoId: string) => {
    setChapters(
      chapters.map((ch, i) =>
        i === chapterIdx
          ? { ...ch, videos: ch.videos.filter((v: Video) => v.id !== videoId) }
          : ch
      )
    );
  };

  // Update addChapter to use new type
  const addChapter = () => setChapters([...chapters, { title: "", videos: [] }]);
  const removeChapter = (idx: number) => setChapters(chapters.filter((_, i) => i !== idx));
  const handleChapterTitle = (idx: number, value: string) => {
    setChapters(
      chapters.map((ch, i) => (i === idx ? { ...ch, title: value } : ch))
    );
    setChapterTitleErrors(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };
  const generateId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);

  const handleSaveChapters = async () => {
    // Validation: all chapters must have a title
    const emptyTitleIndexes = chapters
      .map((ch, idx) => (ch.title.trim() === '' ? idx : -1))
      .filter(idx => idx !== -1);
    setChapterTitleErrors(emptyTitleIndexes);
    if (emptyTitleIndexes.length > 0) {
      setError('Each chapter must have a title.');
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        if (!chapter.title) continue;
        const chapterPayload = {
          id: generateId(),
          title: chapter.title,
          course_id: courseId,
          order_index: i + 1,
        };
        await fetch(`${API_BASE_URL}/chapters`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chapterPayload),
        });
      }
      onClose();
    } catch (e) {
      setError("Failed to save chapters. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop-chapters") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop-chapters"
      className="fixed inset-0 bg-[#000000a3] flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {saving && (
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
        className="bg-white p-6 rounded-lg shadow-lg w-[50%] xl:w-[38%] max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[#1D1D1D] font-inter text-[20px] font-semibold not-italic leading-none">Create Chapters</h2>
        </div>
        <div className="mt-6">
          
          {chapters.map((chapter, cIdx) => (
            <div key={cIdx} className="mb-6">
            <span className="font-medium block w-full text-[#1D1D1D] font-inter text-[14px] font-medium not-italic leading-[20px] mb-2">Chapter {cIdx + 1}</span>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-2 rounded px-2 border border-[#D0D5DD] h-[45px] flex-1">
                <input
                  type="text"
                  value={chapter.title}
                  onChange={e => handleChapterTitle(cIdx, e.target.value)}
                  placeholder="Chapter title"
                  className={`border-none py-1 flex-1 outline-none ${chapterTitleErrors.includes(cIdx) ? 'border border-red-500' : ''}`}
                  required
                />
                {chapters.length > 1 && (
                  <button type="button" onClick={() => removeChapter(cIdx)} className="ml-2 text-red-500 cursor-pointer">✕</button>
                )}
              </div>
              <button type="button" onClick={() => openVideoModal(cIdx)} className="flex w-[120px] h-[45px] justify-center items-center rounded-[8px] border border-[#00AFF0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:shadow-md hover:bg-[#00AFF0]/10 text-[#00AFF0] font-inter text-[14px] font-medium not-italic leading-[24px] cursor-pointer">Add Videos</button>
              </div>
              {/* Show selected videos */}
              {Array.isArray(chapter.videos) && chapter.videos.length > 0 ? (
                <div className="grid">
                  {chapter.videos.map((video: Video, vIdx: number) => (
                    <div key={video.id} className="flex items-center gap-2 p-2 border border-[#D0D5DD] rounded mb-2 justify-between">
                     <div className="text-black font-inter text-[12px] not-italic font-normal leading-none">{video.title}</div>
                      <button type="button" onClick={() => handleRemoveVideoFromChapter(cIdx, video.id)} className="text-red-500 cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              ) : null}
              {/* If no videos, show nothing or a message */}
            </div>
          ))}
          <button type="button" onClick={addChapter} className="flex w-[120px] h-[45px] justify-center items-center rounded-[8px] border border-[#00AFF0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:shadow-md hover:bg-[#00AFF0]/10 text-[#00AFF0] font-inter text-[14px] font-medium not-italic leading-[24px] cursor-pointer px-4">Add chapter</button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="mt-6 flex justify-start">
          <button
            type="button"
            onClick={handleSaveChapters}
            className="cursor-pointer bg-[#00AFF0] font-medium text-white text-sm rounded-[8px] h-[44px] w-[22%] flex items-center justify-center"
            disabled={saving}
          >
            Next
          </button>
        </div>
      </div>

      {/* Video Selection Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-[#000000a3] flex items-center justify-center z-50" onClick={() => setVideoModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-3xl max-h-[80vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-2">Select Course Video</h2>
            <div className="text-sm text-gray-500 mb-4">Select course videos for this chapter</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {VIDEO_LIBRARY.filter(video => {
                // Exclude videos already assigned to any other chapter
                const assigned = chapters.some((ch, idx) =>
                  idx !== videoModalChapterIdx && ch.videos.some(v => v.id === video.id)
                );
                return !assigned;
              }).map(video => (
                <div
                  key={video.id}
                  className={`relative border rounded-lg p-3 cursor-pointer ${selectedVideos.includes(video.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${chapters.some((ch, idx) => idx !== videoModalChapterIdx && ch.videos.some(v => v.id === video.id)) ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => handleVideoSelect(video.id)}
                >
                  <div className="w-full aspect-[1.3] rounded-[8px] overflow-hidden relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    {/* Always show the dark overlay for disabled videos */}
                    
                    {/* Show a blue overlay and checkmark if selected */}
                    {selectedVideos.includes(video.id) && (
                      <div className="absolute top-0 left-0 w-full h-full flex bg-[#00000090]"></div>
                    )}
                  </div>
                  <div className="text-[#1D1D1D] font-inter text-[16px] not-italic font-semibold leading-normal mb-2 mt-3">{video.title}</div>
                  <div className="flex items-center justify-between">
                    <button className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                      <path d="M11.3363 6.51758C12.7863 6.52558 13.5717 6.59025 14.0837 7.1023C14.6697 7.68835 14.6697 8.6311 14.6697 10.5166V11.1833C14.6697 13.0695 14.6697 14.0122 14.0837 14.5983C13.4984 15.1837 12.555 15.1837 10.6696 15.1837H5.33607C3.45068 15.1837 2.50731 15.1837 1.92196 14.5983C1.33594 14.0116 1.33594 13.0695 1.33594 11.1833V10.5166C1.33594 8.6311 1.33594 7.68835 1.92196 7.1023C2.43397 6.59025 3.21933 6.52558 4.66938 6.51758" stroke="#55565B" stroke-width="1.45877" stroke-linecap="round"/>
                      <path d="M8.00025 10.5159V1.84766M8.00025 1.84766L10.0005 4.18142M8.00025 1.84766L6 4.18142" stroke="#55565B" stroke-width="1.45877" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </button>
                    <span className="text-[#55565B] font-inter text-[12px] not-italic font-medium leading-normal">{video.duration}
                    </span>
                    </div>
                  <div className="absolute top-[22px] left-[22px]">
                    <input type="checkbox" checked={selectedVideos.includes(video.id)} readOnly />
                  </div>
                </div>
              ))}
            </div>
            {/* Sticky Footer */}
            <div className="sticky bottom-[-25px] left-0 bg-white pt-4 pb-2 flex justify-end gap-2 z-10 border-t border-gray-200">
              <button type="button" className=" py-2 rounded bg-gray-200 cursor-pointer px-8" onClick={() => setVideoModalOpen(false)}>Back</button>
              <button type="button" className="cursor-pointer bg-[#00AFF0] font-medium text-white text-sm rounded-[8px] h-[44px] px-8 flex items-center justify-center" onClick={handleAddVideosToChapter}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChaptersModal; 