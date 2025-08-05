import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useReactMediaRecorder } from "react-media-recorder";
import { AnnotationButton } from "../../../types/videoannotationsteacher.type";
import {
  useGetAllPuzzlePiecesQuery,
  useCreatePuzzlePieceMutation,
} from "../../../redux/services/puzzlePieces.services";
import WaveSurfer from "wavesurfer.js";
import CreateQuizModal from "./CreateQuizModal";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import Draggable from "react-draggable";

// import UpArrow from "/assets/UpArrow.svg";
// import TextIconGray from "/assets/TextIconGray.svg";
// import MicIconGray from "/assets/MicIconGray.svg";
// import CameraIconGray from "/assets/CameraIconGray.svg";
// import TextIconWhite from "/assets/TextIconWhite.svg";
// import MicIconWhite from "/assets/MicIconWhite.svg";
// import CameraIconWhite from "/assets/CameraIconWhite.svg";
// import RecordAnnotation from "/assets/RecordAnnotation.svg";
// import StartRec from "/assets/StartRec.svg";
// import StopRec from "/assets/StopRec.svg";
// import CreateQuizGray from "/assets/createQuizGray.svg";
// import CreateQuizWhite from "/assets/createQuizWhite.svg";

// import PuzzleIcon from "/assets/puzzleBlack.svg";
// import NotePad from "/assets/notepad.svg";
// import StopIconBlue from "/assets/recording-stop-blue.svg";
// import RefreshIcon from "/assets/rewind.svg";
// import TrashIcon from "/assets/trash.svg";
// import StopIconOrange from "/assets/recording-stop-orange.png";
// import PauseIcon from "/assets/recording-pause.png";
// import ResumeIcon from "/assets/recording-resume.png";

import { useVideoTime } from "../../../hooks/useVideoTime";

type ButtonType = "GPT Search" | "My Annotations" | "Puzzle Content";

type AnnotationType = "Text" | "Audio" | "Video Rec" | "Create quiz";

import { useDispatch, useSelector } from "react-redux";
import {
  setActiveIndex,
  setActiveTab,
  // setCountdown,
  setIsRecording,
  // setScreenBlob,
  setShowControls,
  // setIsAudioRecording,
  setQuizModal,
  // setRecordedAudioUrl,
} from "../../../redux/features/annotationSlice";
import {
  useGetAllQuizzesQuery,
  useGetQuizzQuery,
} from "../../../redux/services/quizzes.services";
import { ConstructionIcon } from "lucide-react";
import PuzzlePieceContent from "./PuzzlePieceContent";
import { CurrentAnnotation } from "../../../types/videos.types";
import { AnnotationPreview } from "../../shared/ui/AnnotationPreview";
import { RootState } from "@reduxjs/toolkit/query";

// Annotation buttons array
const annotationButtons: AnnotationButton[] = [
  {
    id: "Text",
    iconGray: "/assets/TextIconGray.svg",
    iconWhite: "/assets/TextIconWhite.svg",
  },
  {
    id: "Audio",
    iconGray: "/assets/MicIconGray.svg",
    iconWhite: "/assets/MicIconWhite.svg",
  },
  {
    id: "Create quiz",
    iconGray: "/assets/createQuizGray.svg",
    iconWhite: "/assets/createQuizWhite.svg",
  },
  {
    id: "Video Rec",
    iconGray: "/assets/CameraIconGray.svg",
    iconWhite: "/assets/CameraIconWhite.svg",
  },
];
const buttons: ButtonType[] = [
  "GPT Search",
  "My Annotations",
  "Puzzle Content",
];

const items: string[] = ["Audio PP", "Text PP", "Quizzes", "Video PP"];

const CourseInstructorDetail: React.FC = () => {
  const [activeButton, setActiveButton] = useState<ButtonType>("GPT Search");
  const [activeAnnotationButton, setActiveAnnotationButton] =
    useState<AnnotationType>("Text");

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [currentAnnotation, setCurrentAnnotation] =
    useState<CurrentAnnotation | null>(null);

  console.log("user");
  console.log(user);

  const [countdown, setCountdown] = useState<number | null>(null);

  const [puzzlePieces, setPuzzlePieces] = useState([]);

  // Destructure all states from the Redux store
  const {
    activeIndex,
    activeTab,
    // countdown,
    isRecording,
    // screenBlob,
    showControls,
    // isAudioRecording,
    quizModal,
    // recordedAudioUrl,
  } = useSelector((state: any) => state.teacherAnnotations);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [screenBlob, setScreenBlob] = useState<any>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<any>(null);
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(false);

  const wavesurferRef = useRef<WaveSurfer | any>(null);
  const recordPluginRef = useRef<any>(null);

  const RecordingStatus: string = "resumed";

  const { data } = useGetAllPuzzlePiecesQuery({
    userId: user.id,
    courseId: "85be16bd-ac0f-40a1-a438-f4feea3ff043",
  });

  const { data: quiz } = useGetAllQuizzesQuery({
    // id: "71f3b819-b99e-463a-b0d0-0c39b958f1b6",
    userId: user.id,
    courseId: "85be16bd-ac0f-40a1-a438-f4feea3ff043",
  });

  useEffect(() => {
    if (quiz) {
      console.log("puzzlePieces quiz", quiz);
      // Perform any action with the data here
    }
  }, [quiz]);

  // const { data: quiz } = useGetQuizzQuery({
  //   id: "71f3b819-b99e-463a-b0d0-0c39b958f1b6",
  //   userId: user.id,
  //   courseId: "85be16bd-ac0f-40a1-a438-f4feea3ff043",
  // });
  // useEffect(() => {
  //   if (quiz) {
  //     console.log("puzzlePieces quiz", quiz);
  //     // Perform any action with the data here
  //   }
  // }, [quiz]);

  useEffect(() => {
    if (data) {
      setPuzzlePieces(data.data);
      // Perform any action with the data here
    }
  }, [data]);

  const [createPuzzlePiece] = useCreatePuzzlePieceMutation();

  const sec2Min = (sec: number) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return `${min}:${secRemain < 10 ? "0" : ""}${secRemain}`;
  };

  const { currentTimeSec } = useVideoTime();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submission working");

    const formData = new FormData();

    // Append common data (e.g., user ID, timestamp, etc.)
    formData.append("title", "testing annotation4");
    formData.append("startAt", currentTimeSec.toString());
    formData.append("endAt", "80");
    // formData.append("videoId", "481bd4b8-d554-4469-bbb9-ca9105445e90");
    formData.append("totalCredit", "5");

    // Handle data based on the active annotation type
    switch (activeAnnotationButton) {
      case "Text":
        const textAnnotation = (
          e.currentTarget.elements.namedItem(
            "textAnnotation"
          ) as HTMLTextAreaElement
        ).value;
        formData.append("textPuzzle", textAnnotation);
        formData.append("puzzleType", "textPuzzle");

        // Clear text annotation
        (
          e.currentTarget.elements.namedItem(
            "textAnnotation"
          ) as HTMLTextAreaElement
        ).value = "";
        break;

      case "Video Rec":
        if (screenBlob) {
          formData.append("videoPuzzle", screenBlob);
          formData.append("puzzleType", "videoPuzzle");

          // Clear screenBlob state
          setScreenBlob(null);
        } else {
          console.error("No video recorded");
          return;
        }
        break;

      case "Audio":
        if (recordedAudioUrl) {
          formData.append("audioPuzzle", recordedAudioUrl);
          formData.append("puzzleType", "audioPuzzle");

          // Clear recordedAudioUrl state
          setRecordedAudioUrl(null);
        } else {
          console.error("No audio recorded");
          return;
        }
        break;

      default:
        console.error("Invalid annotation type");
        return;
    }

    try {
      await createPuzzlePiece(formData).unwrap();
      console.log("Puzzle piece created successfully");
    } catch (err) {
      console.error("Error creating puzzle piece:", err);
    }
  };

  const createWaveSurfer = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    wavesurferRef.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#00AFF0",
      progressColor: "#00AFF0",
      cursorColor: "#FFFFFF",
      height: 100,
      barWidth: 2,
      barGap: 0.3,
      barRadius: 2,
      hideScrollbar: true,
    });
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({ scrollingWaveform: false })
    );

    recordPluginRef.current.on("record-end", (blob: Blob) => {
      const recordedUrl = URL.createObjectURL(blob);
      dispatch(setRecordedAudioUrl(recordedUrl));
      wavesurferRef.current.load(recordedUrl);
    });

    // recordPluginRef.current.on("record-progress", (time) => {
    //   updateProgress(time);
    // });
  };

  useEffect(() => {
    if (
      activeAnnotationButton === "Audio" &&
      document.getElementById("waveform")
    ) {
      console.log("Wavesurfer is now working");
      createWaveSurfer();
    }
  }, [activeAnnotationButton]);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await recordPluginRef.current.startRecording();
      dispatch(setIsAudioRecording(true));
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopAudioRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopRecording();
      dispatch(setIsAudioRecording(false));

      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      dispatch(setRecordedAudioUrl(null));
    }

    // if (progressRef.current) {
    //   progressRef.current.textContent = "00:00";
    // }
  };

  // const playAudio = (recordedUrl:string) => {
  //   if (recordedUrl && wavesurferRef.current) {
  //     if (isPlaying && url === recordedUrl) {
  //       wavesurferRef.current.pause();
  //     } else {
  //       wavesurferRef.current.load(recordedUrl);
  //       wavesurferRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //     setRecordedAudioUrl(recordedUrl);
  //   }
  // };

  // const updateProgress = (time) => {
  //   if (progressRef.current) {
  //     const formattedTime = [
  //       Math.floor((time % 3600000) / 60000),
  //       Math.floor((time % 60000) / 1000),
  //     ]
  //       .map((v) => (v < 10 ? "0" + v : v))
  //       .join(":");
  //     progressRef.current.textContent = formattedTime;

  //     setDuration(formattedTime);
  //   }
  // };

  const isDeletingRef = useRef(false);
  //Screen Recording Functionality

  const {
    status: screenStatus,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl: screenBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({
    screen: true,
    onStop: (blobUrl) => {
      setIsRecording(false);
      setShowControls(false);

      // Only set blob if not deleting
      if (!isDeletingRef.current) {
        setScreenBlob(blobUrl);
        console.log("delete is not workig");
      } else {
        // Cleanup if deleting
        URL.revokeObjectURL(blobUrl);
        setScreenBlob(null);
        isDeletingRef.current = false;
      }
      console.log("Recording stopped, blob:", blobUrl);
    },
  });
  console.log("screenBlob");
  console.log(screenBlob);

  // Start countdown and trigger screen recording
  const handleStartCountdownAndRecord = () => {
    if (isRecording) return; // Prevent multiple triggers
    setCountdown(3); // Start countdown from 3

    const countdownInterval = setInterval(() => {
      setCountdown((prev: any) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          dispatch(setIsRecording(true)); // Update state to indicate recording started
          return null; // Clear countdown UI
        }
        return prev - 1; // Decrement countdown
      });
    }, 1000);
  };

  // Screen Recording Start useEffect
  useEffect(() => {
    if (isRecording) {
      startScreenRecording(); // Start only screen recording first
      dispatch(setShowControls(true));
    }
  }, [isRecording]);

  // Stop Screen recording
  const handleStopRecording = () => {
    if (!isRecording) return; // Prevent duplicate calls
    dispatch(setShowControls(false));
    stopScreenRecording();
    dispatch(setIsRecording(false));
  };

  const handleCloseQuizModal = () => dispatch(setQuizModal(false));

  const handlePreview = (data: any) => {
    setCurrentAnnotation(data); // Set the selected piece whatever it will be
  };
  const handleRemovePrivew = () => {
    setCurrentAnnotation(null); // Set the selected div
  };

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null; // Initialize as null

    if (screenStatus === "recording") {
      timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (screenStatus === "paused") {
      if (timerInterval) clearInterval(timerInterval); // Check if it exists
    } else if (screenStatus === "stopped") {
      if (timerInterval) clearInterval(timerInterval); // Check if it exists
      setElapsedTime(0);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval); // Cleanup safely
    };
  }, [screenStatus]);

  // Format the elapsed time in MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const deleteRecording = () => {
    isDeletingRef.current = true;

    // Stop recording if in progress (onStop will handle cleanup)
    if (screenStatus === "recording" || screenStatus === "paused") {
      stopScreenRecording();
    } else {
      // If not recording, manually clean up
      if (screenBlobUrl) URL.revokeObjectURL(screenBlobUrl);
      setScreenBlob(null);
      setIsRecording(false);
      setElapsedTime(0);
      if (clearBlobUrl) clearBlobUrl();
    }
  };

  const handlePauseResume = () => {
    if (screenStatus === "recording") {
      // Pause recording
      pauseRecording(); // You'll need to destructure this from useReactMediaRecorder
    } else if (screenStatus === "paused") {
      // Resume recording
      resumeRecording(); // You'll need to destructure this from useReactMediaRecorder
    }
  };

  return (
    <div className="h-full  p-4 flex flex-col">
      <CreateQuizModal
        isOpen={quizModal}
        onClose={handleCloseQuizModal}
        onNext={() => {
          // handleCloseCreateModal();
          // handleOpenSelectModal(data);
        }}
        courseId="123"
        isEdit={false}
      />
      {countdown !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            className="flex flex-col justify-center items-center rounded-full w-[280px] pt-[20px] pb-[40px] px-[100px] h-[280px]"
            style={{
              background:
                "linear-gradient(215deg, #5B5BF0 2.4%, #00AFF0 102.51%)",
            }}
          >
            <span className="text-white  text-[100px] font-bold countdown-animation">
              {countdown}
            </span>
            <button className="bg-transparent text-white text-2xl font-bold">
              Skip
            </button>
          </div>
        </div>
      )}

      {currentAnnotation === null ? (
        <>
          <div className="flex flex-row items-center justify-between w-full h-[42px]">
            {/* Buttons */}
            {buttons.map((button) => (
              <button
                key={button}
                style={
                  activeButton === button
                    ? { borderBottom: "3px solid #1CABF2" }
                    : { border: "none" }
                }
                onClick={() => setActiveButton(button)}
                className="pb-2 text-sm font-sans font-medium cursor-pointer flex items-center justify-center text-[#1D1D1D] dark:text-white w-full border-b-2"
              >
                {button}
              </button>
            ))}
          </div>
          <div className="flex-1 w-full">
            {/* Content can be dynamically rendered here based on the active button */}
            {/* Example of dynamic content */}
            {activeButton === "GPT Search" && (
              <div className=" min-w-full flex flex-col items-center justify-end min-h-[554px]">
                <div className="w-full flex flex-col gap-[2px]">
                  <div className="h-[61px] w-full border-[0.5px] border-[#00000033] dark:border-[#DADADA33] rounded-[5px] px-[10px] py-[12px] flex flex-col justify-center">
                    <p className="font-sans font-medium text-[15px] text-[#1D1D1D] dark:text-white">
                      Explain line 4 to 8
                    </p>
                    <p className="font-sans text-sm">
                      It will explain the code to you
                    </p>
                  </div>
                  <div className="h-[61px] w-full border-[0.5px] border-[#00000033] dark:border-[#DADADA33] rounded-[5px] px-[10px] py-[12px] flex flex-col justify-center">
                    <p className="font-sans font-medium text-[15px] text-[#1D1D1D] dark:text-white">
                      Popular VS Code recommendations
                    </p>
                    <p className="font-sans text-sm">
                      Learn about VS code extensions
                    </p>
                  </div>
                  <div className="h-[61px] w-full border-[0.5px] border-[#00000033] dark:border-[#DADADA33] rounded-[5px] px-[10px] py-[12px] flex flex-col justify-center">
                    <p className="font-sans font-medium text-[15px] text-[#1D1D1D] dark:text-white">
                      Explain each HTML tag{" "}
                    </p>
                    <p className="font-sans text-sm">
                      Learn all the HTML tags from line 1 to 12
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-row items-center h-[48px] mt-2 rounded-[6px] justify-center p-4 bg-[#F4F4F4] dark:bg-[#1D1D1D]">
                  <input
                    className="w-full h-[48px]  text-[#1D1D1D66] dark:text-white  font-medium text-xs outline-none break-words bg-transparent"
                    placeholder="Choose a prompt to ask question"
                  />
                  <button>
                    <Image
                      src="/assets/UpArrow.svg"
                      width={20}
                      height={20}
                      alt="Picture of the author"
                    />
                  </button>
                </div>
              </div>
            )}
            {activeButton === "My Annotations" && (
              <div className="h-full w-full flex flex-col items-start mt-4 gap-4">
                <div className="w-full flex flex-col gap-4">
                  <p className="text-[15px] font-semibold">
                    {" "}
                    <p className="text-[15px] font-semibold">
                      Annotation at
                      <span className="text-[#00AFF0] ml-1">
                        {sec2Min(currentTimeSec.current)}
                      </span>
                    </p>
                  </p>
                  <div className="w-full h-[47px] flex flex-row items-center justify-between gap-[10px]">
                    {/* Annotation Buttons with Conditional Icons */}
                    {annotationButtons.map(({ id, iconGray, iconWhite }) => (
                      <button
                        key={id}
                        onClick={() => setActiveAnnotationButton(id)}
                        className={`h-[57px] w-full flex flex-col items-center cursor-pointer justify-center rounded-[4px] gap-[3px] ${
                          activeAnnotationButton === id
                            ? "bg-[#00AFF0]"
                            : "bg-[#0000000D] dark:bg-[#1D1D1D]"
                        }`}
                      >
                        <Image
                          src={
                            activeAnnotationButton === id ? iconWhite : iconGray
                          }
                          alt={id}
                          width={20}
                          height={20}
                        />
                        <p
                          className={`text-xs   ${
                            activeAnnotationButton === id
                              ? "text-white"
                              : "dark:text-black"
                          }`}
                        >
                          {id}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                  <div>
                    {activeAnnotationButton === "Text" && (
                      <div className="h-[150px] ">
                        <textarea
                          className="w-full h-full px-[15px] py-[10px] text-sm text-[#1D1D1D] font-sans border-[1px] bg-[#F3F3F3] dark:bg-[#1D1D1D] dark:text-white placeholder:dark:text-white rounded-[4px] border-[#E0E2EA] dark:border-none outline-none resize-none"
                          placeholder="Start typing..."
                          // value={textAnnoValue}
                          name="textAnnotation"
                          // onChange={(e) => setTextAnnoValue(e.target.value)}
                        />
                      </div>
                    )}
                    {activeAnnotationButton === "Audio" && (
                      <div className="w-full h-[150px] flex flex-col items-center justify-center border-[1px] bg-[#F3F3F3] dark:bg-[#1D1D1D] border-none rounded-[4px] border-[#E0E2EA]">
                        {/* Always include the waveform div, but hide it when not recording */}
                        <div
                          className={`w-1/2 mt-4 ${
                            isAudioRecording ? "block" : "hidden"
                          }`}
                          id="waveform"
                        ></div>

                        {/* Centered image when not recording */}
                        {!isAudioRecording && (
                          <div className="w-full h-full flex items-center justify-center">
                            <button onClick={startAudioRecording} type="button">
                              <Image
                                src="/assets/RecordAnnotation.svg"
                                alt={"Record Audio"}
                                width={52}
                                height={52}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Audio Player */}
                    {recordedAudioUrl &&
                      !isAudioRecording &&
                      activeAnnotationButton === "Audio" && (
                        <div className="w-full mt-4">
                          <audio controls className="w-full h-10">
                            <source src={recordedAudioUrl} type="audio/mpeg" />
                          </audio>
                        </div>
                      )}

                    {activeAnnotationButton === "Video Rec" && (
                      <div className="flex flex-col gap-1">
                        <div className="w-full h-[150px] flex flex-row items-center justify-center border-[1px] bg-[#F3F3F3] dark:bg-[#1D1D1D] dark:border-none rounded-[4px] border-[#E0E2EA]">
                          <button
                            type="button"
                            onClick={
                              isRecording
                                ? handleStopRecording
                                : handleStartCountdownAndRecord
                            }
                          >
                            {/* <img
                              src={isRecording ? StopRec : StartRec}
                              className="h-[88px] w-[88px]"
                            /> */}
                            <Image
                              src={
                                isRecording
                                  ? "/assets/StopRec.svg"
                                  : "/assets/StartRec.svg"
                              }
                              alt={"Record Audio"}
                              width={88}
                              height={88}
                            />
                          </button>
                        </div>
                        {screenBlob &&
                          activeAnnotationButton === "Video Rec" &&
                          !isRecording && (
                            <div className="w-full mt-4">
                              <video controls className="w-full h-64">
                                <source src={screenBlob} type="video/mp4" />
                                Your browser does not support the video element.
                              </video>
                            </div>
                          )}
                      </div>
                    )}

                    {activeAnnotationButton === "Create quiz" && (
                      <div className="w-full h-[150px] flex flex-row items-center justify-center border-[1px] bg-[#F3F3F3] dark:bg-[#1D1D1D] border-none rounded-[4px] border-[#E0E2EA]">
                        <button
                          type="button"
                          className="w-[147px] h-[37px] rounded-[4px] flex items-center justify-center bg-[#00AFF0] text-[#FFFFFF] text-sm cursor-pointer"
                          onClick={() => dispatch(setQuizModal(true))}
                        >
                          Create a quiz
                        </button>
                      </div>
                    )}
                  </div>
                  {/* <button
                className="w-[147px] h-[37px] rounded-[4px] flex items-center justify-center bg-[#00AFF0] text-[#FFFFFF] text-sm cursor-pointer"
                onClick={stopAudioRecording}
                type="button"
              >
                stop on 04:18
              </button> */}
                  <button
                    className="w-[147px] h-[37px] rounded-[4px] mt-2 flex items-center justify-center bg-[#00AFF0] text-[#FFFFFF] text-sm cursor-pointer"
                    onClick={isAudioRecording ? stopAudioRecording : () => {}}
                    type={isAudioRecording ? "button" : "submit"}
                  >
                    Post on {sec2Min(currentTimeSec.current)}
                  </button>
                </form>
              </div>
            )}
            {activeButton === "Puzzle Content" && (
              <div className="mt-4">
                {/* for tabs */}
                <div className="flex overflow-x-scroll gap-2 no-scrollbar">
                  {/* const items: string[] = ["Audio PP", "Text PP", "Quizzes", "Text PP"]; */}

                  {items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => dispatch(setActiveTab(item))}
                      className={`flex-shrink-0 flex items-center justify-center border text-sm border-[#00000033] py-[4px] px-5 rounded-[18px] min-w-[109px] max-w-[120px] cursor-pointer ${
                        activeTab === item
                          ? "bg-[#00AFF0]   text-white"
                          : "bg-[#F9F9F9] dark:dark:bg-[#1D1D1D] dark:text-white text-black"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-1">
                  {puzzlePieces?.map((piece: any, index) => {
                    if (
                      piece?.puzzleType === "quizzesPuzzle" &&
                      activeTab === "Quizzes"
                    ) {
                      console.log("puzzle pieces are rendering");
                      return (
                        <PuzzlePieceContent
                          piece={piece}
                          index={index}
                          handlePreview={handlePreview}
                        />
                      );
                    }

                    if (
                      piece?.puzzleType === "textPuzzle" &&
                      activeTab === "Text PP"
                    ) {
                      console.log("running textPuzzle");
                      return (
                        <PuzzlePieceContent
                          piece={piece}
                          index={index}
                          handlePreview={handlePreview}
                        />
                      );
                    }

                    if (
                      piece?.puzzleType === "audioPuzzle" &&
                      activeTab === "Audio PP"
                    ) {
                      return (
                        <PuzzlePieceContent
                          piece={piece}
                          index={index}
                          handlePreview={handlePreview}
                        />
                      );
                    }

                    if (
                      piece?.puzzleType === "videoPuzzle" &&
                      activeTab === "Video PP"
                    ) {
                      return (
                        <PuzzlePieceContent
                          piece={piece}
                          index={index}
                          handlePreview={handlePreview}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {activeTab === "Text PP" && (
            <AnnotationPreview
              handleRemovePrivew={handleRemovePrivew}
              time={currentAnnotation?.startAt}
              data={currentAnnotation?.textPuzzle}
              activeTab={activeTab}
            />
          )}

          {activeTab === "Audio PP" && (
            <AnnotationPreview
              handleRemovePrivew={handleRemovePrivew}
              time={currentAnnotation.startAt}
              data={currentAnnotation.audioPuzzle}
              activeTab={activeTab}
            />
          )}

          {activeTab === "Video PP" && (
            <AnnotationPreview
              handleRemovePrivew={handleRemovePrivew}
              time={currentAnnotation?.startAt}
              data={currentAnnotation?.videoPuzzle}
              activeTab={activeTab}
            />
          )}
        </>
      )}

      {showControls && (
        <Draggable>
          <div className="fixed h-auto w-auto bottom-4 z-50 left-4 flex flex-col">
            <div
              className={
                "h-14 w-auto bottom-4 z-50 left-4 transition-all duration-300"
              }
            >
              <div className="h-14 w-[150px] hover:w-[200px] ease-in-out duration-500 bottom-8 z-50 left-8 pr-2 pl-2 bg-[#000] rounded-full gap-5 flex items-center justify-center text-white shadow-lg group">
                <div className="relative h-full w-full flex flex-row items-center justify-start">
                  <div className="sticky left-0 flex items-center gap-3">
                    <button className="h-10 w-10" onClick={handleStopRecording}>
                      {/* <img
                        className="w-10 h-10"
                        src={
                          screenStatus === "paused"
                            ? "/assets/recording-stop-orange.png"
                            : "/assets/recording-stop-blue.svg"
                        }
                        alt="Stop"
                      /> */}
                      <Image
                        src={
                          screenStatus === "paused"
                            ? "/assets/recording-stop-orange.png"
                            : "/assets/recording-stop-blue.svg"
                        }
                        alt="Stop"
                        width={40}
                        height={40}
                      />
                    </button>
                    <span className="text-white text-sm font-semibold leading-normal text-center">
                      {formatTime(elapsedTime)}
                    </span>
                    <button className="h-10 w-10" onClick={handlePauseResume}>
                      {/* <img
                        className="w-4 h-4"
                        src={screenStatus === "paused" ? "/assets/recording-resume.png" : "/assets/recording-pause.png"}
                        alt={screenStatus === "paused" ? "Resume" : "Pause"}
                      /> */}
                      <Image
                        src={
                          screenStatus === "paused"
                            ? "/assets/recording-resume.png"
                            : "/assets/recording-pause.png"
                        }
                        alt={screenStatus === "paused" ? "Resume" : "Pause"}
                        width={40}
                        height={40}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-5 transition-[width,opacity] duration-500 ease-in-out overflow-hidden w-0 opacity-0 group-hover:w-[250px] group-hover:opacity-100">
                    <button onClick={deleteRecording}>
                      {/* <img className="h-4 w-4" src={TrashIcon} alt="Delete" /> */}
                      <Image
                        src="/assets/trash.svg"
                        alt="Delete"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default CourseInstructorDetail;
