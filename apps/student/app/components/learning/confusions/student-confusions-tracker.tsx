import { useState } from "react";
import { VideoTimeProvider } from "../../../context/VideoTimeContext";
import EnhancedVideoPlayer from "../annotations/annotation-video-player";
// import note from "../../assets/QuizeGray.svg";
// import noteWhite from "../../assets/QuizeGrayWhite.svg";
// import audio from "../../assets/MicIconGray.svg";
// import audioWhite from "../../assets/MicIconWhite.svg";
// import youtube from "../../assets/youtubeGray.svg";
// import youtubeWhite from "../../assets/youtubeGrayWhite.svg";
// import audioSample from "/assets/test2.mp3";
// import videoSample from "/assets/planets.mp4";

import { TextAnnotationDisplay } from "../annotations/text-annotation-display";
import { AudioAnnotationDisplay } from "../annotations/audio-annotation-display";
import { VideoAnnotationDisplay } from "../annotations/video-annotation-display";
import {
  ViewAllCommentProvider,
  useViewAllComments,
} from "../../../context/ViewAllCommentContext";
import { ViewAllCommentContext } from "../annotations/all-comments-viewer";

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

const ConfusionsPuzzleJourney = () => {
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

  return (
    <div className="flex gap-2 ">
      <div className="w-[73%] p-5">
        <VideoTimeProvider>
          <EnhancedVideoPlayer
            activeIndex={activeIndex}
            handleActiveAnnotation={handleActiveAnnotation}
            annotations={annotations}
          />
        </VideoTimeProvider>
      </div>

      <div className="w-[27%] border-l border-l-[#1D1D1D33]">
        {viewAllComment ? (
          <ViewAllCommentContext />
        ) : (
          <div className="">
            <div className="p-5 border ">
              <h3 className="font-bold">Confusion Preview</h3>
            </div>
            {activeAnnotation.name === "note" && (
              <TextAnnotationDisplay
                time={activeAnnotation.time}
                title="In this section of the video, we're discussing the importance of alignment in UI design."
                text="Alignment creates order and consistency in your design. Properly aligned elements help guide the user s eye and make content...."
              />
            )}

            {activeAnnotation.name === "audio" && (
              <AudioAnnotationDisplay
                time={activeAnnotation.time}
                title="In this section of the video, we're discussing the importance of alignment in UI design."
                audio={"/assets/test2.mp3"}
              />
            )}
            {activeAnnotation.name === "video" && (
              <VideoAnnotationDisplay
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

export default ConfusionsPuzzleJourney;
