import React from "react";
import RootLayout from "../ssrComponent/Layout";
import ScreenRecording from "../components/screens/ScreenRecording";

const page = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <ScreenRecording />
    </div>
  );
};

export default page;
