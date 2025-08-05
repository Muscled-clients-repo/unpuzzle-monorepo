"use client";
import { useState } from "react";
import NewVideoPlayer from "./NewVideoPlayer";
import {
  ViewAllCommentProvider,
  useViewAllComments,
} from "../../../context/ViewAllCommentContext";
import { JourneyTextAnnotation } from "./JourneyTextAnnotation";
import { JourneyAudioAnnotation } from "./JourneyAudioAnnotation";
import { JourneyVideoAnnotation } from "./JourneyVideoAnnotation";
// import note from "../../assets/QuizeGray.svg";
// import noteWhite from "../../assets/QuizeGrayWhite.svg";
// import audio from "../../assets/MicIconGray.svg";
// import audioWhite from "../../assets/MicIconWhite.svg";
// import youtube from "../../assets/youtubeGray.svg";
// import youtubeWhite from "../../assets/youtubeGrayWhite.svg";
// import audioSample from "/assets/test2.mp3";
// import videoSample from "/assets/planets.mp4";

import { ViewAllCommentContext } from "./ViewAllComments";

export interface Annotation {
  name: string;
  title: string;
  time: number;
  img: string; // Adjust the type if `note`, `audio`, etc., are not strings (e.g., `StaticImageData` for Next.js images).
  whiteImg: string; // Same adjustment as above.
}

const annotations: Annotation[] = [
  {
    name: "note",
    title: "Chapter 1: Introduction to components",
    time: 8,
    img: "/assets/QuizeGray.svg",
    whiteImg: "/assets/QuizeGrayWhite.svg",
  },
  {
    name: "audio",
    title: "Chapter 2: Understanding properties",
    time: 16,
    img: "/assets/MicIconGray.svg",
    whiteImg: "/assets/MicIconWhite.svg",
  },
  {
    name: "video",
    title: "Chapter 3: Using states effectively",
    time: 24,
    img: "/assets/youtubeGray.svg",
    whiteImg: "/assets/youtubeGrayWhite.svg",
  },
];

const AnnotationsPuzzleJourney = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation>({
    name: "note",
    title: "Chapter 1: Introduction to components",
    time: 8,
    img: "/assets/QuizeGray.svg",
    whiteImg: "/assets/QuizeGrayWhite.svg",
  });
  const { viewAllComment } = useViewAllComments();

  const handleActiveAnnotation = (index: number) => {
    const active = annotations.find((a, i) => {
      return i === index;
    });
    if (active) {
      setActiveAnnotation(active);
    }

    setActiveIndex(index);
  };

  console.log(activeAnnotation + "this is active annotation");

  return (
    <div className="flex gap-2 ">
      <div className="w-[73%] p-5">
        
          <NewVideoPlayer
            activeIndex={activeIndex}
            handleActiveAnnotation={handleActiveAnnotation}
            annotations={annotations}
          />
        
      </div>

      <div className="w-[27%] border-l border-l-[#1D1D1D33]">
        {viewAllComment ? (
          <ViewAllCommentContext />
        ) : (
          <div className="">
            <div className="p-5 border ">
              <h3 className="font-bold">Annotation Preview</h3>
            </div>
            {activeAnnotation.name === "note" && (
              <JourneyTextAnnotation
                time={activeAnnotation.time}
                title="In this section of the video, we're discussing the importance of alignment in UI design."
                text="Alignment creates order and consistency in your design. Properly aligned elements help guide the user s eye and make content...."
              />
            )}

            {activeAnnotation.name === "audio" && (
              <JourneyAudioAnnotation
                time={activeAnnotation.time}
                title="In this section of the video, we're discussing the importance of alignment in UI design."
                audio={"/assets/test2.mp3"}
              />
            )}
            {activeAnnotation.name === "video" && (
              <JourneyVideoAnnotation
                time={activeAnnotation.time}
                title="In this section of the video, we're discussing the importance of alignment in UI design."
                video={"/assets/planets.mp4"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationsPuzzleJourney;
