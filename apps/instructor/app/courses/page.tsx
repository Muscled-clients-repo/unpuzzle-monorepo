"use client";

import React from "react";
import { Sidebar } from "../components";
import { Provider } from "react-redux";
import store from "../redux/store";
import { CourseScreen } from "../components";
import { CourseProvider } from "../context/CourseContext";

function Courses() {
  return (
    <div>
      <CourseProvider>
        <CourseScreen />
      </CourseProvider>
    </div>
  );
}

export default Courses;
