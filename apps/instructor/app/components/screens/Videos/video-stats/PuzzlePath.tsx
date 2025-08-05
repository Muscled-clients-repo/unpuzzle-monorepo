import React from "react";

const puzzlePathTopics = [
  { time: "1:20", topic: "How to Download Figma", url: "https://example.com/video1" },
  { time: "2:20", topic: "How to Install Figma", url: "https://example.com/video2" },
  { time: "3:20", topic: "How to Create a New File", url: "https://example.com/video3" },
  { time: "4:20", topic: "Figma Interface Overview", url: "https://example.com/video4" },
  { time: "5:20", topic: "How to Use Auto Layout", url: "https://example.com/video5" },
];

const PuzzlePath = () => {
  return (
    <div className="bg-white rounded-lg">
      <div className="">
        <div className="grid grid-cols-4 gap-4 mb-3 font-medium text-gray-700">
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Time</div>
          <div className="col-span-2 h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Topic</div>
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Action</div>
        </div>
        <div className="space-y-3">
          {puzzlePathTopics.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] h-12 flex items-center">{item.time}</div>
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] col-span-2 h-12 flex items-center">{item.topic}</div>
              <div className="h-12 flex items-center h-12 flex items-center">
                <button
                  className="bg-black text-white font-inter text-xs font-medium leading-normal px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzlePath; 