"use client";

import React from "react";
import ChildConfusionsPuzzleJourney from "../components/learning/confusions/student-confusions-tracker";
import { ViewAllCommentProvider } from "../context/ViewAllCommentContext";
function ConfusionsPuzzleJourney() {
  return (
    <div>
      {/* <VideoTimeProvider> */}
      <ViewAllCommentProvider>
        <ChildConfusionsPuzzleJourney />
      </ViewAllCommentProvider>
      {/* </VideoTimeProvider> */}
    </div>
  );
}

export default ConfusionsPuzzleJourney;
