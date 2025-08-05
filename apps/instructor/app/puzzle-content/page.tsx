"use client";

import React from "react";
// import Sidebar from "../components/Sidebar";
// import { Provider } from "react-redux";
// import store from "../redux/store";
import RootLayout from "../ssrComponent/Layout";
// import CourseScreen from "../components/screens/CourseScreen";
import PuzzleContentScreen from "../components/screens/PuzzleContent/PuzzleContentScreen";

function PuzzleContent() {
  return (
    <div>
      <PuzzleContentScreen />
    </div>
  );
}

export default PuzzleContent;
