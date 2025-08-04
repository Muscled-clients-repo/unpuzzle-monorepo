import React, { useState } from "react";

// Sample hint data for each time
const hintAttempts = [
  {
    time: "1:20",
    status: "Still Confused",
    hint: {
      title: "Set Consistent Spacing",
      time: "02:15",
      steps: [
        "Select the two elements together.",
        "Enable auto-layout and set gap.",
        "Adjust container padding for spacing.",
      ],
      description:
        "Here's a step-by-step hint guide for Set Consistent Spacing:",
    },
  },
  {
    time: "2:20",
    status: "Got It",
    hint: {
      title: "Align Elements",
      time: "03:10",
      steps: [
        "Select all elements.",
        "Click the align button.",
        "Choose the desired alignment.",
      ],
      description: "Here's a step-by-step hint guide for Align Elements:",
    },
  },
  {
    time: "3:20",
    status: "Still Confused",
    hint: {
      title: "Use Auto Layout",
      time: "04:05",
      steps: [
        "Select the frame.",
        "Enable auto layout.",
        "Adjust spacing as needed.",
      ],
      description: "Here's a step-by-step hint guide for Auto Layout:",
    },
  },
  {
    time: "4:20",
    status: "Got It",
    hint: {
      title: "Distribute Spacing Evenly",
      time: "05:20",
      steps: [
        "Select all items.",
        "Use distribute spacing tool.",
        "Check for even gaps.",
      ],
      description:
        "Here's a step-by-step hint guide for Distribute Spacing Evenly:",
    },
  },
  {
    time: "5:20",
    status: "Still Confused",
    hint: {
      title: "Resize Frames",
      time: "06:00",
      steps: [
        "Select the frame.",
        "Drag to resize.",
        "Hold shift for proportional scaling.",
      ],
      description: "Here's a step-by-step hint guide for Resize Frames:",
    },
  },
  {
    time: "6:20",
    status: "Got It",
    hint: {
      title: "Group Elements",
      time: "07:10",
      steps: [
        "Select elements.",
        "Right-click and choose group.",
        "Name the group for clarity.",
      ],
      description: "Here's a step-by-step hint guide for Group Elements:",
    },
  },
];

const PuzzleHint = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // If a hint is selected, show the drawer/details view
  if (selectedIndex !== null) {
    const hint = hintAttempts[selectedIndex].hint;
    return (
      <div className="p-3 bg-white rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedIndex(null)}
            className="text-gray-600 hover:text-gray-800 gap-4 flex items-center space-x-1 cursor-pointer font-inter text-xs font-medium leading-normal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="13"
              viewBox="0 0 16 13"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 6.50022C16 5.99043 15.5867 5.57717 15.077 5.57717L3.15164 5.57717L6.49913 2.23002C6.85962 1.86957 6.85965 1.28512 6.49919 0.924634C6.13874 0.564142 5.5543 0.564113 5.19381 0.924568L0.270388 5.84749C0.0972624 6.0206 0 6.25539 0 6.50022C0 6.74504 0.0972624 6.97984 0.270388 7.15295L5.19381 12.0759C5.5543 12.4363 6.13874 12.4363 6.49919 12.0758C6.85965 11.7153 6.85962 11.1309 6.49913 10.7704L3.15164 7.42327L15.077 7.42327C15.5867 7.42327 16 7.01 16 6.50022Z"
                fill="#1D1D1D"
              />
            </svg>
            <span className="text-sm text-[#1D1D1D] font-inter text-sm font-semibold leading-normal">
              Puzzle Hint
            </span>
          </button>
          <div className="text-[#00AFF0] font-inter text-sm font-medium leading-normal">
            {hint.time}
          </div>
        </div>

        <div className="rounded-lg border border-[#E4E4E4] bg-[#F9F9F9] p-3">
          <div className="text-[#1D1D1D] font-inter text-sm font-medium leading-normal">
            {hint.title}
          </div>
          <div className="text-[#606060] font-inter text-sm font-normal leading-[24px]">
            {hint.description}
          </div>
          <ol className="list-decimal ml-5 space-y-1 font-inter text-[#212636]">
            {hint.steps.map((step, idx) => (
              <li
                key={idx}
                className="text-[#1D1D1D] font-inter text-sm font-normal leading-[24px]"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // Otherwise, show the table of hint attempts
  return (
    <div className="bg-white rounded-lg">
      <div className="">
        <div className="grid grid-cols-4 gap-4 mb-3 font-medium text-gray-700">
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">
            Time
          </div>
          <div className="col-span-2 h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">
            Status
          </div>
          <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">
            Action
          </div>
        </div>
        <div className="space-y-3">
          {hintAttempts.map((attempt, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] h-12 flex items-center">
                {attempt.time}
              </div>
              <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] col-span-2 h-12 flex items-center">
                {attempt.status}
              </div>
              <div className="h-12 flex items-center">
                <button
                  className="bg-black text-white font-inter font-medium leading-normal px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedIndex(idx)}
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

export default PuzzleHint;
