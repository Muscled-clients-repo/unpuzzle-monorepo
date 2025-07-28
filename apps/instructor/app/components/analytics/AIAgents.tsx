"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import PuzzleCheck from "./agents/PuzzleCheck";
import { useVideoTime } from "../../context/VideoTimeContext";
import { useCourse } from "@/hooks/useCourse";

// Refactored agentOptions with all info and component
const AIAgents = ({video}:{video:any}) => {
  // constant 
  const { currentTimeSec, durationSec, setDurationSec, setCurrentTimeSec } =
    useVideoTime();
    const [displayTime, setDisplayTime] = useState(0);

    // Update only the span every 500ms
    useEffect(() => {
      const interval = setInterval(() => {
        setDisplayTime(currentTimeSec.current);
      }, 500); // adjust as needed
      return () => clearInterval(interval);
    }, [currentTimeSec]);
    
  // constant
  const agentOptions = useMemo(() => [
    // TODO: Puzzle Hint, Reflect, and Path components need to be reimplemented
    // They were removed due to missing context dependencies
    {
      key: "puzzleCheck",
      label: "Puzzle Check",
      icon: "/assets/robot.svg",
      iconInactive: "/assets/blind-robot.svg",
      headerTitle: "Puzzle Check",
      description: "Test your knowledge with a quick quiz!",
      component:  () => <PuzzleCheck videoId={video.id} currentTimeSec={currentTimeSec} />,
    },
  ], [video.id, currentTimeSec]);
  // states
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [agentsEnabled, setAgentsEnabled] = useState<boolean>(true);

  const selectedAgentObj = agentOptions.find((a) => a.key === selectedAgent);
  const AgentComponent = selectedAgentObj?.component;
  // console.log("currentTimeSec:: ",currentTimeSec)
  return (
    <div className="max-w-md  bg-white rounded ">
      <div className="flex justify-between items-center my-4">
        <span className="py-2 px-3.5 px border border-[#000] rounded-md">
          {/* {typeof currentTimeSec === "number" && !isNaN(currentTimeSec)
  ? `Confused At ${Math.round(currentTimeSec)}`
  : "Confused At 0"} */}
    {typeof displayTime === "number" && !isNaN(displayTime)
    ? `Confused At ${Math.round(displayTime)}`
    : "Confused At 0"}
        </span>
        <span>20m/hr</span>
      </div>
      <div className="flex items-center justify-between my-5">
        <h2 className="text-xl font-bold">AI Agents</h2>
        {/* Toggle Button */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          {/* toggle button start */}
          <div className="flex pl-9 items-center gap-2">
            <h1 className="text-white text-sm font-normal">Puzzle peices</h1>
            <button
              onClick={() => setAgentsEnabled(!agentsEnabled)}
              className={`w-[45px] h-[20px] flex items-center rounded-full px-1 transition cursor-pointer ${
                agentsEnabled ? "bg-[#1CABF2]" : "bg-[#E0E2EA]"
              }`}
            >
              <div
                className={`w-[17px] h-[17px] rounded-full  transition-transform cursor-pointer ${
                  agentsEnabled
                    ? "translate-x-[23px] bg-white"
                    : "translate-x-0 bg-[#00AFF0]"
                }`}
              />
            </button>
          </div>
          {/* toggle button end */}
        </label>
      </div>

      {agentsEnabled && (
        <>
          <div className="flex gap-2 mb-6 overflow-x-scroll">
            {agentOptions.map((agent) => (
              <div
                key={agent.key}
                className={`w-[100px] min-w-[100px] h-[111px] border rounded border-[#E4E4E4] flex flex-col justify-center items-center transition-colors duration-300 cursor-pointer ${
                  selectedAgent === agent.key ? "bg-[#1cabf2]" : ""
                }`}
                onClick={() => setSelectedAgent(agent.key)}
              >
                <Image
                  src={
                    selectedAgent === agent.key
                      ? agent.icon
                      : agent.iconInactive
                  }
                  height={60}
                  width={40}
                  alt="Picture of the AI Robot"
                  className=" w-10 h-[60px]"
                />
                <div
                  className={`text-xs mt-3 font-semibold ${
                    selectedAgent === agent.key ? " text-white" : " text-black"
                  }`}
                >
                  {agent.key}
                </div>
              </div>
            ))}
          </div>

          {/* Agent Content (Dynamic) */}
          {selectedAgentObj && (
            <div className="w-full border border-[#00AFF0] p-3 rounded-md card-hint">
              <div className="flex flex-row w-full gap-4 mb-4">
                <Image
                  src={selectedAgentObj.icon}
                  width={64}
                  height={64}
                  alt="Picture of the robot"
                  className=" w-16 h-16"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    {selectedAgentObj.headerTitle}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedAgentObj.description}
                  </span>
                </div>
              </div>
              <div className="mt-4">{AgentComponent && <AgentComponent />}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIAgents;
