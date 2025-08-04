import React, { useState } from "react";
import PuzzleHint from "./video-stats/PuzzleHint";
import PuzzleCheck from "./video-stats/PuzzleCheck";
import PuzzleReflect from "./video-stats/PuzzleReflect";
import PuzzlePath from "./video-stats/PuzzlePath";
import "./video-stats/d5-video-stats.css";

const tabs = [
  { id: "PuzzleHint", label: "PuzzleHint", component: PuzzleHint },
  { id: "PuzzleCheck", label: "PuzzleCheck", component: PuzzleCheck },
  { id: "PuzzleReflect", label: "PuzzleReflect", component: PuzzleReflect },
  { id: "PuzzlePath", label: "PuzzlePath", component: PuzzlePath },
];

const VideoStats = () => {
  const [activeTab, setActiveTab] = useState("PuzzleHint");
  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || PuzzleHint;

  return (
    <>
      <h4 className="text-[ #1D2026] font-inter text-lg font-semibold leading-[32px] tracking[-0.2px]">
        Video Stats{" "}
      </h4>
      <div className="space-y-6 px-3 py-3 rounded-lg border border-[#E5E5E5] mt-2">
        {/* Tab Bar */}

        <div className="mb-4 rounded-l-lg rounded-r-none bg-[#F4F6F8] p-2">
          <div className="flex justify-start overflow-x-auto scrollbar-hidden d5-tab-container gap-4 gap-2">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`cursor-pointer transition-colors p-2 min-w-[90px] d5-tab-button ${
                  activeTab === tab.id
                    ? "bg-white text-gray-800 rounded"
                    : "hover:bg-gray-50 text-gray-800"
                }`}
                onClick={() => setActiveTab(tab.id)}
                role="button"
                tabIndex={0}
              >
                <div className="text-[#1C252E] font-inter text-[12px] font-normal leading-normal">
                  {tab.label}
                </div>
                <div className="text-2xl font-boldtext-[#1C252E] font-inter font-medium leading-normal tracking[-0.24px]">
                  20
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div>
          <ActiveComponent />
        </div>
      </div>
    </>
  );
};

export default VideoStats;
