import React, { useState, useCallback, useMemo } from "react";
import PuzzleHintModule from "./learning-stats/puzzle-hint-module";
import PuzzleCheckModule from "./learning-stats/puzzle-check-module";
import PuzzleReflectModule from "./learning-stats/puzzle-reflect-module";
import PuzzlePathModule from "./learning-stats/puzzle-path-module";
import "./learning-stats/d5-video-stats.css";

const tabs = [
  { id: "PuzzleHint", label: "PuzzleHint", component: PuzzleHintModule },
  { id: "PuzzleCheck", label: "PuzzleCheck", component: PuzzleCheckModule },
  { id: "PuzzleReflect", label: "PuzzleReflect", component: PuzzleReflectModule },
  { id: "PuzzlePath", label: "PuzzlePath", component: PuzzlePathModule },
];

const VideoStats: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState("PuzzleHint");
  
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);
  
  const ActiveComponent = useMemo(() => 
    tabs.find(tab => tab.id === activeTab)?.component || PuzzleHintModule,
    [activeTab]
  );

  return (
    <>
    <h4 className="text-[ #1D2026] font-inter text-lg font-semibold leading-[32px] tracking[-0.2px]">Video Stats </h4>
    <div className="space-y-6 px-3 py-3 rounded-lg border border-[#E5E5E5] mt-2">
      {/* Tab Bar */}
      
      <div className="mb-4 rounded-l-lg rounded-r-none bg-[#F4F6F8] p-2">
        <div className="flex justify-start overflow-x-auto scrollbar-hidden d5-tab-container gap-4 gap-2">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`cursor-pointer transition-colors p-2 min-w-[90px] d5-tab-button ${
              activeTab === tab.id
                ? "bg-white text-gray-800 rounded"
                : "hover:bg-gray-50 text-gray-800"
            }`}
            onClick={() => handleTabClick(tab.id)}
            role="button"
            tabIndex={0}
          >
            <div className="text-[#1C252E] font-inter text-[12px] font-normal leading-normal">{tab.label}</div>
            <div className="text-2xl font-boldtext-[#1C252E] font-inter text-2xl font-medium leading-normal tracking[-0.24px]">20</div>
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
});

VideoStats.displayName = 'VideoStats';

export default VideoStats;
