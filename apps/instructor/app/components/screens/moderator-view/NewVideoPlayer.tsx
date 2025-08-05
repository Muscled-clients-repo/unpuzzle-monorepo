"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getBlobDuration from "get-blob-duration";
import Image from "next/image";

import "../../../../public/assets/style.css";
import QuizContainer from "../../shared/ui/QuizContainer";
import AudioContainer from "../../shared/ui/AudioContainer";
import { useGetAllPuzzlePiecesQuery } from "../../../redux/services/puzzlePieces.services";
import {
  Quiz,
  CustomDropdownProps,
  TimelineItem,
} from "../../../types/videoannotationsteacher.type";
// import Planets from "/assets/WeAreGoingOnBullrun.mp4";

import { useVideoTime } from "../../../hooks/useVideoTime";
import { useGetAllQuizzesQuery } from "../../../redux/services/quizzes.services";
import { RootState } from "@reduxjs/toolkit/query";

// Video Data for 47 seconds
const videos = [
  { title: "Video 1", duration: 16 },
  { title: "Video 2", duration: 8 },
  { title: "Video 3", duration: 8 },
  { title: "Video 3", duration: 6 },
];

// const timeline = [
//   {
//     type: "annotation",
//     title: "Chapter 1: Introduction to components",
//     timestamp: 16,
//     audio: { title: "Audio Annotation Example", duration: 5 },
//   },

//   {
//     type: "annotation",
//     title: "Chapter 2: Understanding properties",
//     timestamp: 24,
//     quiz: {
//       title: "JavaScript Basics Introduction Quiz",
//       questions: [
//         {
//           index: 1,
//           questionText: "What is the output of '2' + 2 in JavaScript?",
//           choices: ["22", "4", "NaN", "undefined"],
//           correctAnswer: 0,
//         },
//         {
//           index: 2,
//           questionText: "Which keyword is used to declare a constant in JavaScript?",
//           choices: ["var", "let", "const", "static"],
//           correctAnswer: 2,
//         },
//       ],
//     },
//   },
//   {
//     type: "annotation",
//     title: "Chapter 3: Using states effectively",
//     timestamp: 32,
//     quiz: {
//       title: "React Basics Quiz",
//       questions: [
//         {
//           index: 1,
//           questionText: "What does React use to manage the virtual DOM?",
//           choices: ["Flux", "Redux", "Fiber", "Babel"],
//           correctAnswer: 2,
//         },
//       ],
//     },
//   },
// ];

type HandledAnnotations = Record<string, boolean>;

interface Video {
  duration: number;
  [key: string]: any;
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

// Example of how to use the formatTime function in your annotations

const NewVideoPlayer = () => {
  const playerRef = useRef<HTMLDivElement | any>(null); // Reference for the video container
  const videoRef = useRef<HTMLVideoElement | any>(null);

  // State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [currentTimeSec, setCurrentTimeSec] = useState<number>(0); // Store in seconds
  // const [durationSec, setDurationSec] = useState<number>(0); // Store in seconds
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false); // State to track hover
  const [isPuzzleVisible, setIsPuzzleVisible] = useState<boolean>(false);
  const [isQuizVisible, setIsQuizVisible] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz]: any = useState<Quiz>(null); // Store the active quiz
  const [isAudioVisible, setIsAudioVisible] = useState<boolean>(false);
  const [isPausedByOverlay, setIsPausedByOverlay] = useState<boolean>(false);
  const [handledAnnotations, setHandledAnnotations] =
    useState<HandledAnnotations>({}); // Track processed annotations
  const [speeds, setSpeeds] = useState<number[]>([
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
  ]);
  const [isSubtitle, setIsSubtitle] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const { currentTimeSec, durationSec, setDurationSec, setCurrentTimeSec } =
    useVideoTime();

  // Redux state
  const screenBlobUrl = useSelector(
    (state: { video: { screenBlob: string } }) => state.video.screenBlob
  );
  // const [showInputControls, setShowInputControls] = useState(false);
  // const dispatch = useDispatch();
  // const [inputValue, setInputValue] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRefs: any = useRef([]);

  const [isAudioSkipped, setIsAudioSkipped] = useState(false);
  const [isQuizSkipped, setIsQuizSkipped] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [quizData, setQuizData] = useState([]);

  const user = useSelector((state: any) => state.user);

  const { data } = useGetAllPuzzlePiecesQuery({
    userId: user.id,
    courseId: "85be16bd-ac0f-40a1-a438-f4feea3ff043",
  });

  useEffect(() => {
    if (data) {
      setPuzzlePieces(data.data);
      // Perform any action with the data here
    }
  }, [data]);

  const { data: quiz } = useGetAllQuizzesQuery({
    // id: "71f3b819-b99e-463a-b0d0-0c39b958f1b6",
    userId: user.id,
    courseId: "85be16bd-ac0f-40a1-a438-f4feea3ff043",
  });

  useEffect(() => {
    if (quiz) {
      setQuizData(quiz.data);
      // Perform any action with the data here
    }
  }, [quiz]);

  // Function to transform puzzlePieces into timeline annotation
  const transformPuzzleToAnnotation = (puzzle: any) => {
    if (puzzle.puzzleType === "audioPuzzle") {
      return {
        type: "annotation",
        title: puzzle.title,
        timestamp: puzzle.startAt,
        audio: {
          title: puzzle.audioPuzzle,
          duration: puzzle.endAt - puzzle.startAt,
        },
      };
    }
    return null;
  };

  // Function to transform quizData into timeline annotation
  const transformQuizToAnnotation = (quiz: any, puzzle: any) => {
    return {
      type: "annotation",
      title: puzzle.title,
      timestamp: puzzle.startAt,
      quiz: {
        title: `Quiz for ${puzzle.title}`,
        questions: [
          {
            index: quiz.quizzNumber,
            questionText: quiz.question,
            choices: [
              quiz.choice1,
              quiz.choice2,
              quiz.choice3,
              quiz.choice4,
            ].filter(Boolean),
            correctAnswer:
              parseInt(quiz.correctChoise.replace("choice", "")) - 1,
          },
        ],
      },
    };
  };

  // Combine both transformations into a single timeline
  const timeline: TimelineItem[] = [];

  puzzlePieces?.forEach((puzzle: any) => {
    if (puzzle.puzzleType === "audioPuzzle") {
      const annotation = transformPuzzleToAnnotation(puzzle);
      console.log("annotation audio");
      console.log(annotation);

      if (annotation) timeline.push(annotation);
    } else {
      console.log("quizData");
      console.log(quizData);

      const relatedQuiz = quizData?.find(
        (quiz: any) => quiz?.puzzlepiecesId === puzzle.id
      );
      if (relatedQuiz) {
        const annotation = transformQuizToAnnotation(relatedQuiz, puzzle);
        timeline.push(annotation);
      }
    }
  });

  const formattedAnnotations = timeline
    .map((item) => {
      return {
        ...item,
        formattedTime: formatTime(item.timestamp), // Format the timestamp
      };
    })
    .slice(-10);

  console.log("formattedAnnotations");
  console.log(formattedAnnotations);

  //const { data, isLoading, error } = useGetAllPuzzlePiecesQuery({ userId, courseId });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(videoElement.currentTime);
      console.log(currentTime, "This is the current time");
      setCurrentTimeSec(currentTime);

      // Find the next annotation based on the current time
      const nextIndex = timeline.findIndex(
        (item) =>
          currentTime >= item.timestamp &&
          currentTime < item.timestamp + (item.audio?.duration || 1)
      );

      console.log("Next Index:", nextIndex);
      console.log("Active Index:", activeIndex);

      // Handle annotations only if they haven't been processed yet
      if (nextIndex !== -1 && !handledAnnotations[nextIndex]) {
        setActiveIndex(nextIndex);

        // Mark this annotation as handled
        setHandledAnnotations((prev) => ({ ...prev, [nextIndex]: true }));

        // Reset skipped states for new annotation
        setIsAudioSkipped(false);
        setIsQuizSkipped(false);

        // Reset overlays
        setIsAudioVisible(false);
        setIsQuizVisible(false);

        const activeAnnotation: any = timeline[nextIndex];
        console.log("Active Annotation:", activeAnnotation);

        // Handle audio overlay
        if (activeAnnotation.audio) {
          setIsAudioVisible(true);
          if (!videoElement.paused) {
            videoElement.pause();
            setIsPausedByOverlay(true);
          }
        }

        // Handle quiz overlay
        if (activeAnnotation.quiz) {
          setIsQuizVisible(true);
          setCurrentQuiz(activeAnnotation.quiz);
          if (!videoElement.paused) {
            videoElement.pause();
            setIsPausedByOverlay(true);
          }

          // Auto-hide quiz after 30 seconds
          setTimeout(() => {
            setIsQuizVisible(false);
            setCurrentQuiz(null);
          }, 30000);
        }
      }
    };

    // Add event listener for time updates
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup listener when component unmounts
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [timeline, activeIndex, handledAnnotations]);

  console.log("Is audio skipped", isAudioSkipped);
  console.log("Is audio visible", isAudioVisible);

  // Resume playback when skipping audio or completing a quiz
  const handleAudioSkip = () => {
    setIsAudioVisible(false);
    setIsAudioSkipped(true);
    if (isPausedByOverlay) {
      videoRef.current.play();
      setIsPausedByOverlay(false);
    }
  };

  const handleQuizComplete = () => {
    setIsQuizVisible(false);
    setIsQuizSkipped(true);
    setCurrentQuiz(null);
    if (isPausedByOverlay) {
      videoRef.current.play();
      setIsPausedByOverlay(false);
    }
  };

  // Pause video when overlays are visible, and resume when they are not
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (
      (isQuizVisible || isAudioVisible) &&
      videoRef.current &&
      !videoRef.current.paused
    ) {
      videoRef.current.pause();
      setIsPausedByOverlay(true);
    } else if (!isQuizVisible && !isAudioVisible && isPausedByOverlay) {
      videoRef.current.play();
      setIsPausedByOverlay(false);
    }
  }, [isQuizVisible, isAudioVisible, isPausedByOverlay]);

  const handleAnnotationClick = (time: number, index: number): void => {
    // Seek the video to the clicked annotation time
    if (videoRef?.current) {
      console.log("time");
      console.log(time);

      videoRef.current.currentTime = time;
    }
    setActiveIndex(index);

    // Scroll the clicked annotation into view
    if (scrollRefs.current[index]) {
      scrollRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setCurrentTimeSec(time);
  };

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent): void => {
  //     if (event.code === "Space") {
  //       event.preventDefault();
  //       handlePlay();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  // }, [isPlaying]);

  const getCumulativeStartTimes = (videos: TimelineItem[]): TimelineItem[] => {
    let cumulativeTime = 0;
    return videos.map((video) => {
      const startTime = cumulativeTime;
      cumulativeTime += video.timestamp;
      return { ...video, startTime };
    });
  };

  const videosWithStartTimes = getCumulativeStartTimes(timeline);

  const recordingDuration = async () => {
    try {
      const duration = await getBlobDuration(screenBlobUrl);
      console.log(duration + " seconds");
      return duration;
    } catch (error) {
      console.error("Error getting blob duration:", error);
      return 0;
    }
  };

  const handleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handlePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      // setShowInputControls(true);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      // setShowInputControls(false);
    }
  };

  const handleFullScreen = () => {
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleLoadedMetadata = async () => {
    if (videoRef.current) {
      setTimeout(async () => {
        // Check if the video source is a blob URL and get duration accordingly
        if (screenBlobUrl && videoSrc === screenBlobUrl) {
          // If the video is from a blob (recorded), get duration using getBlobDuration
          const duration = await recordingDuration();
          setDurationSec(duration);
        } else {
          // If the video is an uploaded file, use videoRef.current.duration
          const duration = videoRef.current.duration;
          setDurationSec(duration);
        }
      }, 100); // Short delay to ensure metadata is loaded
    }
  };

  const handleTimeUpdate = () => {
    console.log("it's running");
    setCurrentTimeSec(videoRef.current.currentTime); // Update current time in seconds
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTimeSec(newTime);
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = parseFloat(e.target.value) / 100;
    videoRef.current.volume = newVolume;
    setVolume(e.target.value);
  };

  const sec2Min = (sec: number): string => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return `${min}:${secRemain < 10 ? "0" : ""}${secRemain}`;
  };

  const handleSpeed = (val: string) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = Number(val);
      setSpeed(Number(val));
    }
  };

  const handleSubtitle = () => {
    setIsSubtitle(!isSubtitle);
  };

  return (
    <div className="">
      <div className="relative w-full h-full group" ref={playerRef}>
        {/* Quiz Overlay */}
        {isQuizVisible && currentQuiz && (
          <QuizContainer
            quizzes={[currentQuiz]}
            onComplete={handleQuizComplete}
          />
        )}

        {/* Audio Annotation Overlay */}
        {isAudioVisible && !isAudioSkipped && (
          <AudioContainer onSkip={handleAudioSkip} />
        )}
        {/* Video Container */}
        <div className="w-full h-full">
          <video
            ref={videoRef}
            src={"/assets/WeAreGoingOnBullrun.mp4"}
            className="w-full object-cover rounded-lg z-20"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controls={false}
            onClick={handlePlay}
          ></video>
        </div>

        {!isPlaying && (
          <Image
            src="/assets/pause-main.svg"
            onClick={handlePlay}
            alt="Pause"
            // fill
            width={56}
            height={56}
            className="h-14 w-14 absolute top-[40%] left-[46%]"
          />
        )}

        {/* Custom Controls */}
        <div
          className="flex flex-col w-full absolute -bottom-2 h-14 items-center justify-around 
           bg-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-b-lg"
        >
          {/* Progress Bar */}
          {durationSec > 0 && (
            <div className="relative -mt-[2px] w-[95%] h-1 bg-[rgba(255,255,255,0.25)] rounded-full mb-6 z-10">
              {/* Main Progress Bar */}
              <div
                className="absolute h-full bg-[#00AFF0] rounded-full"
                style={{ width: `${(currentTimeSec.current / durationSec) * 100}%` }}
              ></div>

              <Image
                src="/assets/mergedPuzzles.svg"
                alt="Complete Puzzle"
                width={16}
                height={16}
                className="absolute right-0 bottom-[13px]"
              />
              {isPuzzleVisible &&
                videosWithStartTimes.map((video: any, index) => {
                  console.log(
                    "This is video start time",
                    video.startTime,
                    "This durationSec",
                    durationSec
                  );

                  return (
                    <div
                      key={index}
                      className="absolute bottom-[14px] w-4 h-4 z-40"
                      style={{
                        left: `${(video.timestamp / durationSec) * 100}%`,
                      }}
                    >
                      <Image
                        src="/assets/puzzle.svg"
                        alt="Puzzle Icon"
                        width={16}
                        height={16}
                        style={{ transform: "translateX(-50%)" }}
                        title={video.title}
                      />

                      <div
                        className="w-1 bg-blue-500 opacity-90 h-[4px] mt-[10px]"
                        style={{
                          transform: "translateX(-50%)",
                        }}
                      ></div>
                    </div>
                  );
                })}

              {/* Global Seek Bar */}
              <input
                type="range"
                min="0"
                max={durationSec}
                value={currentTimeSec.current}
                onChange={handleSeek}
                className="absolute top-[-6px] left-0 w-full h-1 opacity-0 cursor-pointer"
              />
            </div>
          )}

          {/* Controls Row */}
          {/* {!showInputControls ? ( */}
          <div className="flex  flex-row w-full justify-between items-center px-6 -mt-6">
            {/* Left Controls (Play/Pause, Volume, Current Time) */}
            <div className="flex items-center space-x-4">
              <button onClick={handlePlay} className="text-white">
                {isPlaying ? (
                  <Image
                    src="/assets/ai-pause.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                ) : (
                  <Image
                    src="/assets/playPlayer.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                )}
              </button>

              <span className="text-white text-sm">
                {sec2Min(currentTimeSec.current)} / {sec2Min(durationSec)}
              </span>

              {/* Volume Control */}
              <div
                className="relative flex items-center gap-2 "
                onMouseEnter={() => setIsVolumeHovered(true)}
                onMouseLeave={() => setIsVolumeHovered(false)}
              >
                <button onClick={handleMute} className="text-white">
                  {isMuted ? (
                    <Image
                      src="/assets/MutePlayer.svg"
                      alt=""
                      width={22}
                      height={22}
                    />
                  ) : (
                    <Image
                      src="/assets/ai-vloume.svg"
                      alt=""
                      width={22}
                      height={22}
                    />
                  )}
                </button>

                {/* Volume Slider (shown on hover) */}
                {isVolumeHovered && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className=" top-[13px] left-[45px] w-[60px] h-1 bg-gray-500 rounded cursor-pointer accent-white"
                  />
                )}

                <div className="flex pl-9 items-center gap-2">
                  <h1 className="text-white text-sm font-normal">
                    Puzzle peices
                  </h1>
                  <button
                    onClick={() => setIsPuzzleVisible(!isPuzzleVisible)}
                    className={`w-[40px] h-[20px] flex items-center rounded-full px-1 transition cursor-pointer ${
                      isPuzzleVisible ? "bg-[#1CABF2]" : "bg-[#E0E2EA]"
                    }`}
                  >
                    <div
                      className={`w-[17px] h-[17px] rounded-full  transition-transform cursor-pointer ${
                        isPuzzleVisible
                          ? "translate-x-[23px] bg-white"
                          : "translate-x-0 bg-[#00AFF0]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Controls (Speed, Fullscreen) */}
            <div className="flex items-center space-x-3">
              <div
                className="relative hover:cursor-pointer"
                onClick={handleSubtitle}
              >
                <Image
                  src="/assets/subtitle.svg"
                  alt=""
                  width={22}
                  height={22}
                />

                {isSubtitle && (
                  <span className="block absolute -bottom-2 left-0 h-[2px] bg-[#00AFF0] w-full"></span>
                )}
              </div>

              <CustomDropdown
                options={speeds}
                label={speed}
                handleSpeed={handleSpeed}
              />
              <button onClick={handleFullScreen} className="text-white">
                {isFullscreen ? (
                  <Image
                    src="/assets/FullscreenPlayer.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                ) : (
                  <Image
                    src="/assets/FullscreenPlayer.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                )}
              </button>
            </div>
          </div>
          {/* ) : ( */}
          {/* <div className="flex gap-4 flex-row w-full justify-between items-center px-6 -mt-6 ">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-[75%] p-1 text-white h-[35px] text-sm px-5 outline-none bg-transparent border-[2px] rounded-[39px] border-[#00AFF0]"
              placeholder={`Comment at ${sec2Min(currentTimeSec.current)}`}
            />

            <div className="w-[25%] flex items-center gap-3">
              <button
                onClick={handleAddComment}
                className={`text-white font-normal text-sm rounded-[20px] h-[30px] p-[12px] flex items-center justify-center ${
                  inputValue.trim()
                    ? "bg-[#00AFF0] cursor-pointer"
                    : "bg-[#363342] cursor-not-allowed"
                }`}
                disabled={!inputValue.trim()} // Disable the button when inputValue is empty
              >
                Comment at {sec2Min(currentTimeSec.current)}
              </button>
              <button onClick={handleCancel} className="text-white p-2 rounded">
                Cancel
              </button>
            </div>
          </div> */}
          {/* )} */}
        </div>
      </div>

      {/* Annotations by Students  */}
      <div className="mt-3 px-4 bg-[#F7F7F7] dark:bg-[#0F0F0F] ">
        <h1 className="font-medium text-base text-black dark:text-white">
          Annotations by Students
        </h1>

        <div className="flex mt-1 items-center gap-10">
          <div className="w-[45%] flex flex-row flex-nowrap gap-2 overflow-x-auto no-scrollbar">
            {formattedAnnotations.map((annotation: any, index) => (
              <div
                key={index}
                className={`w-[16%] flex flex-col gap-1 rounded-[4px] min-h-[71px] items-center justify-center cursor-pointer flex-shrink-0 ${
                  activeIndex === index
                    ? "bg-[#1CABF2] text-white"
                    : "bg-white dark:bg-[#1D1D1D] text-gray-700 dark:text-white"
                }`}
                ref={(el: any) => (scrollRefs.current[index] = el)}
                onClick={() =>
                  handleAnnotationClick(annotation.timestamp, index)
                }
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.75 15.625V13.75H5.625V15.625H3.75Z"
                    fill={activeIndex === index ? "white" : "gray"}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.5 25H2.5C1.83696 25 1.20107 24.7366 0.732233 24.2678C0.263392 23.7989 0 23.163 0 22.5V2.5C0 1.83696 0.263392 1.20107 0.732233 0.732233C1.20107 0.263392 1.83696 0 2.5 0H17.5C18.163 0 18.7989 0.263392 19.2678 0.732233C19.7366 1.20107 20 1.83696 20 2.5V22.5C20 23.163 19.7366 23.7989 19.2678 24.2678C18.7989 24.7366 18.163 25 17.5 25ZM8.75 5.625C8.75 5.45924 8.81585 5.30027 8.93306 5.18306C9.05027 5.06585 9.20924 5 9.375 5H16.875C17.0408 5 17.1997 5.06585 17.3169 5.18306C17.4342 5.30027 17.5 5.45924 17.5 5.625C17.5 5.79076 17.4342 5.94973 17.3169 6.06694C17.1997 6.18415 17.0408 6.25 16.875 6.25H9.375C9.20924 6.25 9.05027 6.18415 8.93306 6.06694C8.81585 5.94973 8.75 5.79076 8.75 5.625ZM9.375 7.5C9.20924 7.5 9.05027 7.56585 8.93306 7.68306C8.81585 7.80027 8.75 7.95924 8.75 8.125C8.75 8.29076 8.81585 8.44973 8.93306 8.56694C9.05027 8.68415 9.20924 8.75 9.375 8.75H16.875C17.0408 8.75 17.1997 8.68415 17.3169 8.56694C17.4342 8.44973 17.5 8.29076 17.5 8.125C17.5 7.95924 17.4342 7.80027 17.3169 7.68306C17.1997 7.56585 17.0408 7.5 16.875 7.5H9.375Z"
                    fill={activeIndex === index ? "white" : "gray"}
                  />
                </svg>
                <p>{annotation.formattedTime}</p>
              </div>
            ))}
          </div>

          <div className="w-[50%] flex items-center gap-3">
            <div>
              <h1 className="text-[#1D1D1D] dark:text-white text-base font-medium">
                Unpuzzle{" "}
                {formattedAnnotations[activeIndex]?.formattedTime || "00:00"}
              </h1>
              <p className="text-[#1D1D1D] dark:text-white text-base font-normal">
                {formattedAnnotations[activeIndex]?.title ||
                  "No description available"}
              </p>
            </div>
            <Image
              src="/assets/Thumbnail.svg"
              alt="thumbnail"
              className="w-[200px] h-[91px] object-cover"
              width={20}
              height={9}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  label,
  handleSpeed,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    handleSpeed(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className=" relative z-[9999]">
      <button
        className="text-white p-2.5 rounded-[5px] cursor-pointer flex justify-between items-center text-base duration-300"
        onClick={toggleDropdown}
      >
        <span>{selectedOption ? selectedOption : label} x</span>
      </button>
      {isOpen && (
        <ul className="absolute bottom-10 rounded-md shadow-md   bg-black bg-opacity-80  z-20  w-[60px] duration-300 ">
          {options.map((option: any, index: any) => (
            <li
              key={index}
              className="p-2 cursor-pointer duration-300 text-xs hover:bg-[#1a1a1a] text-white"
              onClick={() => handleOptionClick(option)}
            >
              {option} x
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewVideoPlayer;
