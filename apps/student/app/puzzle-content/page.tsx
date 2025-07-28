"use client";

import React from "react";
// import StudentNavigationSidebar from "../components/student-navigation-sidebar";
// import { Provider } from "react-redux";
// import store from "../redux/store";
import RootLayout from "../ssrComponent/Layout";
// import CourseCatalogPage from "../components/screens/course-catalog-page";
// import { VideoTimeProvider } from "../context/VideoTimeContext";
import StudentPuzzleJourneyPage from "../components/learning/puzzle-journey/student-puzzle-journey-page";

function PuzzleContent() {
  return (
    <div>
      <StudentPuzzleJourneyPage />
    </div>
  );
}

export default PuzzleContent;
