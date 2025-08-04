"use client";

import React from "react";
import NewVideoPlayer from "@/app/components/screens/Videos/NewVideoPlayer";
import VideoDetailSection from "@/app/components/screens/Videos/VideoDetailSection";
import { ViewAllCommentProvider } from "@/app/context/ViewAllCommentContext";

interface AgentPageLayoutProps {
  children: React.ReactNode;
  video?: any; // Video data from the agent
  agentType: 'check' | 'hint' | 'reflect' | 'path';
}

const AgentPageLayout: React.FC<AgentPageLayoutProps> = ({ children, video, agentType }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
          {/* Left Side: Video Player and Content */}
          {video && (
            <div className="flex-1 lg:max-w-[65%]">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <NewVideoPlayer video={video} />
                <div className="p-6">
                  <VideoDetailSection video={video} />
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Agent-specific content */}
          <div className={`${video ? 'lg:w-[35%]' : 'w-full max-w-3xl mx-auto'}`}>
            <ViewAllCommentProvider>
              <div className="bg-white rounded-lg shadow-sm">
                {children}
              </div>
            </ViewAllCommentProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPageLayout;