import React, {  useContext } from "react";
import { CourseContext } from "../context/CourseContext";
// Custom hook for using the context
export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) throw new Error("useCourse must be used within ContextProvider!");
    return context;
  };  