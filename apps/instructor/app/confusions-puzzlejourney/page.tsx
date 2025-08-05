"use client";

import React from "react";
import ChildConfusionsPuzzleJourney from "../components/screens/ConfusionsPuzzleJourney/ConfusionsPuzzleJourney";
import { ViewAllCommentProvider } from "../context/ViewAllCommentContext";
function ConfusionsPuzzleJourney() {
  return (
    <div>
      {/*  */}
      <ViewAllCommentProvider>
        <ChildConfusionsPuzzleJourney />
      </ViewAllCommentProvider>
      {/*  */}
    </div>
  );
}

export default ConfusionsPuzzleJourney;
