"use client";

import React from "react";
import StudentNavigationSidebar from "../components/student-navigation-sidebar";
import { Provider } from "react-redux";
import store from "../redux/store";
import CourseCatalogPage from "../components/courses/catalog-page";
import { CourseProvider } from "../context/CourseContext";

function Courses() {
  return (
    <div>
      <CourseProvider>
        <CourseCatalogPage />
      </CourseProvider>
    </div>
  );
}

export default Courses;
