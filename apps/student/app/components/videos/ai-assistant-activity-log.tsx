import React from "react";
import Image from "next/image";

// Dummy agent logs data (replace with backend data as needed)
const agentLogs = [
  {
    agent: "Puzzle Hint",
    title: "Hint provided for step 2",
    timestamp: "00:01:23",
  },
  {
    agent: "Puzzle Check",
    title: "Checked answer for question 3",
    timestamp: "00:03:45",
  },
  {
    agent: "Puzzle Reflect",
    title: "Reflection prompt shown",
    timestamp: "00:05:10",
  },
  {
    agent: "Puzzle Path",
    title: "Suggested next learning path",
    timestamp: "00:07:22",
  },
];

const AgentLogs = () => {
  return (
    <div className="p-4">
      <h2 className=" text-base font-bold mb-4">Agent Logs</h2>
      <div className="flex flex-col my-2">
        {agentLogs.map((log, idx) => (
          <div key={idx} className="flex items-center gap-2 px-3">
            <Image
              src="/assets/check-circle-fill.svg"
              width={20}
              height={20}
              alt="Check Mark"
              className="h-5 w-5"
            />
            {/* <Music className="w-4 h-4 text-blue-500" /> */}
            <span className="text-sm">{log.title}</span>-
            <span className="text-sm text-primary-blue">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentLogs;
