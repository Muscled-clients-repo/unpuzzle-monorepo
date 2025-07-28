"use client";
import { useState } from "react";
import { useViewAllComments } from "../../../context/ViewAllCommentContext";

export const ViewAllCommentContext = () => {
  const { setViewAllComment } = useViewAllComments();
  const [inputValue, setInputValue] = useState<string>(
    "https://youtu.be/Bc4Kt107dB8?si=Culd6iMJaWZVXBHW"
  );

  const posts = [
    { commenterName: "John Smith", time: "04:56" },
    { commenterName: "Emily Johnson", time: "05:30" },
    { commenterName: "Michael Brown", time: "06:15" },
    { commenterName: "Sarah Davis", time: "07:00" },
    { commenterName: "Chris Miller", time: "07:45" },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="p-2 pt-4 pb-4">
      <div className=" bg-[#F5F4F6] h-auto p-3 rounded-md">
        <h4 className="text-[20px] font-bold">Annotation Overview</h4>
        <div className="mt-4 mb-4">
          <p className="text-[13px]">
            Status: <b>Unsolved</b>
          </p>
          <p className="text-[13px]">
            Unpuzzler: <b>Mahtab Alam</b>
          </p>
        </div>
        <div className="flex items-center border p-1 bg-white rounded-md shadow-sm w-full max-w-md">
          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-[10px] px-3 py-2 text-[#1D1D1D7D] border-none outline-none rounded-l-md"
          />

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-2 py-1 mr-1 text-white bg-blue-500 rounded-sm text-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            Copy
          </button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-[20px] mt-4 mb-4">
          More Confusions in this video
        </h4>
        <div className="flex flex-col gap-2">
          {posts.map((post, index) => (
            <p key={index} className="text-[#1D1D1D] text-[15px]">
              <b>{post.commenterName}</b> is confused at <b>{post.time}</b> -
              How can I post a confusion in a puzzle journey?
            </p>
          ))}
        </div>
      </div>
      <button
        className="px-2 py-1 p-3 mr-1 text-white bg-blue-500 rounded-sm text-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        onClick={() => setViewAllComment(false)}
      >
        Back
      </button>
    </div>
  );
};
