import React from "react";
import InstructorSidebar from "@/app/components/dashboard/InstructorSidebar";

const page = ({ children: content }: { children: React.ReactNode }) => {
  return (
    <div className="Dashboard-inner flex">
      <div className="dashboard-sidebbar">
        <InstructorSidebar />
      </div>
      <div className="dashboard-main flex-1">{content}</div>
    </div>
  );
};

export default page;
