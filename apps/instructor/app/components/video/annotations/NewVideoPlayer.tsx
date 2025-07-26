import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import getBlobDuration from "get-blob-duration";
// import Play from "../../assets/playPlayer.svg";
// import Pause from "../../assets/ai-pause.svg";
// import PauseMain from "../../assets/pause-main.svg";
// import Unmuted from "../../assets/ai-vloume.svg";
// import Muted from "../../assets/MutePlayer.svg";
// import Maximize from "../../assets/FullscreenPlayer.svg";
// import Minimize from "../../assets/FullscreenPlayer.svg";
// import PuzzleIcon from "../../assets/puzzle.svg";
// import Subtitle from "../../assets/subtitle.svg";
// import MergedPuzzles from "../../assets/mergedPuzzles.svg";
// import "../../../../public/assets/style.css";
// import Planets from "/assets/WeAreGoingOnBullrun.mp4";
import { CustomDropdownProps } from "../../../types/videos.types";
import { useVideoTime } from "../../../context/VideoTimeContext";
// import note from "../../assets/QuizeGray.svg";
// import noteWhite from "../../assets/QuizeGrayWhite.svg";
// import audio from "../../assets/MicIconGray.svg";
// import audioWhite from "../../assets/MicIconWhite.svg";
// import youtube from "../../assets/youtubeGray.svg";
// import youtubeWhite from "../../assets/youtubeGrayWhite.svg";
// import tickIcon from "../../assets/tickIconWhite.svg";
import { usePathname } from "next/navigation";
import { Annotation } from "./AnnotationsPuzzleJourney";
import CommentBox from "./Comments";
// import youtubeIcon from "../../assets/youtube.svg";
// import notIcon from "../../assets/notIcon.svg";
// import starIcon from "../../assets/starIcon.svg";
import { useViewAllComments } from "../../../context/ViewAllCommentContext";

// Video Data for 47 seconds
const videos = [
  { title: "Video 1", duration: 16 },
  { title: "Video 2", duration: 8 },
  { title: "Video 3", duration: 8 },
];

// Annotations for the 47-second video, split by segments
// const annotations = [
//   {
//     title: "Chapter 1: Introduction to components",
//     time: 8,
//     img: note,
//     whiteImg: noteWhite,
//   },
//   {
//     title: "Chapter 2: Understanding properties",
//     time: 16,
//     img: audio,
//     whiteImg: audioWhite,
//   },
//   {
//     title: "Chapter 3: Using states effectively",
//     time: 24,
//     img: youtube,
//     whiteImg: youtubeWhite,
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

// // Example of how to use the formatTime function in your annotations
// const formattedAnnotations = annotations.map((annotation) => {
//   return {
//     ...annotation,
//     formattedTime: formatTime(annotation.time),
//   };
// });

interface NewVideoPlayerProps {
  activeIndex: number;
  handleActiveAnnotation: (index: number) => void;
  annotations: Annotation[];
}

const NewVideoPlayer: React.FC<NewVideoPlayerProps> = ({
  activeIndex,
  handleActiveAnnotation,
  annotations,
}) => {
  const pathname = usePathname();
  const { viewAllComment } = useViewAllComments();
  const isAnnotationsSelected = pathname === "/annotations-puzzlejourney";
  const isConfusionsSelected = pathname == "/confusions-puzzlejourney";
  const playerRef = useRef<HTMLDivElement | any>(null);
  const videoRef = useRef<HTMLVideoElement | any>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { currentTimeSec, durationSec, setDurationSec, setCurrentTimeSec } =
    useVideoTime();

  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const [isPuzzleVisible, setIsPuzzleVisible] = useState<boolean>(false);
  const [speeds, setSpeeds] = useState<number[]>([
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
  ]);

  const [isSubtitle, setIsSubtitle] = useState<boolean>(false);
  const screenBlobUrl = useSelector(
    (state: { video: { screenBlob: string } }) => state.video.screenBlob
  );
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Example of how to use the formatTime function in your annotations
  const formattedAnnotations = annotations.map((annotation) => {
    return {
      ...annotation,
      formattedTime: formatTime(annotation.time),
    };
  });

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
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      // setShowInputControls(true); // Show input controls when paused
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      // setShowInputControls(false); // Hide input controls when playing
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

  const sec2Min = (sec: number) => {
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

  // const [activeIndex, setActiveIndex] = useState(0);
  const scrollRefs: any = useRef([]);

  // Automatically update active annotation based on video time
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef?.current) {
        const currentTime = Math.floor(videoRef.current.currentTime);
        setCurrentTimeSec(currentTime);

        // Find the annotation that matches the current time
        const nextIndex = formattedAnnotations.findIndex(
          (annotation) =>
            currentTime >= annotation.time - 1 &&
            currentTime <= annotation.time + 1
        );

        if (nextIndex !== -1 && nextIndex !== activeIndex) {
          handleActiveAnnotation(nextIndex);
          if (scrollRefs.current[nextIndex]) {
            scrollRefs.current[nextIndex].scrollIntoView({
              behavior: "smooth",
              block: "nearest", // Prevents unnecessary vertical scrolling
              inline: "center", // Scrolls horizontally to center the element
            });
          }
        }
      }
    }, 500); // Check every half-second

    return () => clearInterval(interval);
  }, [videoRef, formattedAnnotations, activeIndex]);

  const handleAnnotationClick = (time: number, index: number) => {
    console.log("Seek time:", time);
    console.log("Video current time:", videoRef.current.currentTime);
    console.log("Ready state:", videoRef.current.readyState); // Must be >= 2
    if (videoRef.current && videoRef.current.readyState >= 2) {
      // Ensure video metadata is loaded
      videoRef.current.currentTime = time; // Jump to time
      handleActiveAnnotation(index); // Highlight annotation

      // Smooth scroll to the annotation
      if (scrollRefs.current[index]) {
        scrollRefs.current[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      // Force re-render of time
      setCurrentTimeSec(time);
    } else {
      console.warn("Video metadata not loaded yet.");
    }
  };

  const getCumulativeStartTimes = (videos: Video[]): Video[] => {
    let cumulativeTime = 0;
    return videos.map((video) => {
      const startTime = cumulativeTime;
      cumulativeTime += video.duration;
      return { ...video, startTime };
    });
  };

  const videosWithStartTimes = getCumulativeStartTimes(videos);

  return (
    <div>
      <div className="relative w-full group" ref={playerRef}>
        {viewAllComment && (
          /* annoation heading  */
          <div className="pb-6 space-y-2">
            <h1 className="text-[#1D1D1D] font-bold text-xl ">
              {isAnnotationsSelected
                ? "Annotation at 04:18"
                : "Confusions at 04:18"}
            </h1>
            <p className="text-[#1D1D1D] font-semibold text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet
              eu, quis lacus eleifend nunc, egestas dignissim auctor. Vel dolor
              congue adipiscing vulputate ut dictum iaculis enim ac. Eget
              vestibulum natoque quis felis cras. Turpis semper id consequat
              justo a purus?
            </p>
          </div>
        )}
        {/* Video Container */}

        <video
          ref={videoRef}
          src={"/assets/WeAreGoingOnBullrun.mp4"}
          className="w-full object-cover rounded-lg"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
          onClick={handlePlay}
        ></video>

        {!isPlaying && (
          // <img
          //   src="/assets/ai-pause.svg"
          //   onClick={handlePlay}
          //   className="h-14 w-14 absolute top-[40%] left-[46%]"
          // />
          <Image
            src="/assets/ai-pause.svg"
            onClick={handlePlay}
            width={56}
            height={56}
            alt=""
            className=" absolute top-[40%] left-[46%]"
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

              {/* <img
                src={MergedPuzzles}
                alt="Complete Puzzle"
                className="w-4 h-4 absolute right-0 bottom-[13px]"
              /> */}

              <Image
                src="/assets/mergedPuzzles.svg"
                alt="Complete Puzzle"
                width={16}
                height={16}
                className="absolute right-0 bottom-[13px]"
              />

              {isPuzzleVisible &&
                videosWithStartTimes.map((video, index) => {
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
                        left: `${(video.startTime / durationSec) * 100}%`,
                      }}
                    >
                      {/* <img
                        src={PuzzleIcon}
                        alt="Puzzle Icon"
                        className="w-4 h-4"
                        style={{ transform: "translateX(-50%)" }}
                        title={video.title}
                      /> */}

                      <Image
                        src="/assets/puzzle.svg"
                        width={16}
                        height={16}
                        style={{ transform: "translateX(-50%)" }}
                        alt="Puzzle Icon"
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
                  // <img src={Pause} alt="" />
                  <Image
                    src="/assets/ai-pause.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                ) : (
                  // <img src={Play} alt="" />
                  <Image
                    src="/assets/playPlayer.svg"
                    width={20}
                    height={20}
                    alt="Play Icon"
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
                    // <img src={Muted} alt="" />
                    <Image
                      src="/assets/MutePlayer.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                  ) : (
                    // <img src={Unmuted} alt="" />

                    <Image
                      src="/assets/ai-vloume.svg"
                      width={20}
                      height={20}
                      alt=""
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
                {/* <img src={Subtitle} alt="" /> */}

                <Image
                  src="/assets/subtitle.svg"
                  width={20}
                  height={20}
                  alt=""
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
                  // <img src={Minimize} alt="" />

                  <Image
                    src="/assets/FullscreenPlayer.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                ) : (
                  // <img src={Maximize} alt="" />
                  <Image
                    src="/assets/FullscreenPlayer.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewAllComment ? (
        /* video reviews and icons  */
        <div>
          <div className="mt-3 flex gap-4">
            {/* <img src={youtubeIcon} alt="" /> */}

            <Image src="/assets/youtube.svg" width={20} height={20} alt="" />

            <div className="flex items-center gap-1">
              <h1 className="text-[#1D1D1D] font-medium text-[15px]">
                Puzzle Piece
              </h1>
              {/* <img src={notIcon} alt="" /> */}

              <Image src="/assets/notIcon.svg" width={20} height={20} alt="" />
            </div>
            <div className="flex items-center gap-1">
              <h1 className="text-[#00AFF0] font-semibold text-[15px]">1</h1>
              {/* <img src={starIcon} alt="" /> */}

              <Image src="/assets/starIcon.svg" width={20} height={20} alt="" />

              <p className="text-[#1D1D1D80] text-xs font-normal">(135)</p>
            </div>
          </div>

          <p className="text-base font-normal text-[#1D1D1DB2] mt-3">
            Unpuzzled by:{" "}
            <span className="font-semibold text-black underline text-base">
              Mahtab Alam
            </span>
          </p>

          <div className="pt-4 flex items-center space-x-4">
            <h1 className="text-[#1D1D1D] text-xl font-bold whitespace-nowrap">
              Answers
            </h1>
            <div className="flex-1 h-[1px] bg-[#1D1D1D1A]"></div>
          </div>
        </div>
      ) : (
        /* Annotations by experts  */
        <div className="mt-3 px-4  dark:bg-[#0F0F0F] dark:text-white">
          <h1 className="text-xl font-bold #1D1D1D dark:text-white">
            The Secrets to Growing a Business with Minimal Resources...
          </h1>

          <div className="flex mt-3 items-center gap-10">
            <div className="w-[45%] flex flex-row flex-nowrap gap-2 overflow-x-auto no-scrollbar">
              {formattedAnnotations.map((annotation, index) => (
                <div
                  key={index}
                  className={`w-[16%] flex flex-col gap-1 rounded-[4px] min-h-[71px] items-center justify-center cursor-pointer flex-shrink-0 ${
                    activeIndex === index
                      ? "bg-[#F9993A] text-white "
                      : "bg-white border border-[#F9993A33] dark:bg-[#1D1D1D] text-gray-700 dark:text-white"
                  }`}
                  ref={(el: any) => (scrollRefs.current[index] = el)}
                  onClick={() => handleAnnotationClick(annotation.time, index)}
                >
                  <img
                    src={
                      activeIndex === index
                        ? annotation.whiteImg
                        : annotation.img
                    }
                    alt=""
                    className="w-[25px] h-[25px]"
                  />
                  <p>{annotation.formattedTime}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-4">
            {/* Custom Checkbox for Annotations */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden peer"
                checked={isAnnotationsSelected}
                readOnly
              />
              <div className="w-5 h-5 border border-[#707070] rounded-sm flex items-center justify-center peer-checked:bg-[#1D1D1D]">
                {/* <img src={tickIcon} alt="" className="h-3 w-3" /> */}

                <Image
                  src="/assets/tickIconWhite.svg"
                  width={12}
                  height={12}
                  alt=""
                />
              </div>
              <span className="text-gray-700">Annotations</span>
            </label>

            {/* Custom Checkbox for Confusions */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden peer"
                checked={isConfusionsSelected}
                readOnly
              />
              <div className="w-5 h-5 border border-[#707070] rounded-sm flex items-center justify-center peer-checked:bg-[#1D1D1D]">
                {/* <img src={tickIcon} alt="" className="h-3 w-3" /> */}
                <Image
                  src="/assets/tickIconWhite.svg"
                  width={12}
                  height={12}
                  alt=""
                />
              </div>
              <span className="text-gray-700">Confusions</span>
            </label>
          </div>
        </div>
      )}

      {viewAllComment && (
        /* comments section  */
        <div>
          <CommentBox />
        </div>
      )}
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
