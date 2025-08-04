import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import getBlobDuration from "get-blob-duration";
import {
  CourseVideoPlayerProps,
  CustomDropdownProps,
} from "../../../types/videoeditor.types";
import { RootState } from "../../../redux/store";
import Play from "../../assets/playPlayer.svg";
import Pause from "../../assets/ai-pause.svg";
import PauseMain from "../../assets/pause-main.svg";
import Unmuted from "../../assets/ai-vloume.svg";
import Muted from "../../assets/MutePlayer.svg";
import Maximize from "../../assets/FullscreenPlayer.svg";
import Minimize from "../../assets/FullscreenPlayer.svg";
import PuzzleIcon from "../../assets/puzzle.svg";
import Subtitle from "../../assets/subtitle.svg";
import MergedPuzzles from "../../assets/mergedPuzzles.svg";
import { useVideoTime } from "../../../hooks/useVideoTime";

const videos = [
  { title: "Introduction Video", duration: 5 },
  { title: "Second Video", duration: 10 },
  { title: "Third Video", duration: 5 },
];

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ videoSrc }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  // const videoRef = useRef<HTMLVideoElement | null>(null); // changed by context api
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // const [currentTimeSec, setCurrentTimeSec] = useState<number>(0); // Store in seconds
  // const [durationSec, setDurationSec] = useState<number>(0); // Store in seconds
  // should be in context
  const {
    videoRef,
    currentTimeSec,
    setCurrentTimeSec,
    durationSec,
    setDurationSec,
  } = useVideoTime();

  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const [speeds] = useState<number[]>([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);
  const [isSubtitle, setIsSubtitle] = useState<boolean>(false);

  const screenBlobUrl: string | null = useSelector(
    (state: RootState) => state.video.screenBlob
  );
  const showPreview: boolean = useSelector(
    (state: RootState) => state.preview.showPreview
  );

  const recordingDuration = async (): Promise<number> => {
    try {
      if (!screenBlobUrl) {
        console.error("screenBlobUrl is null");
        return 0;
      }
      const duration = await getBlobDuration(screenBlobUrl);
      console.log(duration + " seconds");
      return duration;
    } catch (error) {
      console.error("Error getting blob duration:", error);
      return 0;
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFullScreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        } else if ((playerRef.current as any).webkitRequestFullscreen) {
          (playerRef.current as any).webkitRequestFullscreen(); // Non-standard API
        } else if ((playerRef.current as any).msRequestFullscreen) {
          (playerRef.current as any).msRequestFullscreen(); // Non-standard API
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen(); // Non-standard API
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen(); // Non-standard API
        }
        setIsFullscreen(false);
      }
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
          if (videoRef.current) {
            const duration = videoRef.current.duration;
            setDurationSec(duration);
          }
        }
      }, 100); // Short delay to ensure metadata is loaded
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeSec(videoRef.current.currentTime); // Update current time in seconds
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTimeSec(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      setVolume(parseFloat(e.target.value));
    }
  };

  const sec2Min = (sec: number) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return `${min}:${secRemain < 10 ? "0" : ""}${secRemain}`;
  };

  const handleSpeed = (val: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = Number(val);
      setSpeed(Number(val));
    }
  };

  const handleSubtitle = () => {
    setIsSubtitle(!isSubtitle);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const getCumulativeStartTimes = (
    videos: { duration: number; title: string }[]
  ) => {
    let cumulativeTime = 0;
    return videos.map((video) => {
      const startTime = cumulativeTime;
      cumulativeTime += video.duration;
      return { ...video, startTime };
    });
  };

  const videosWithStartTimes = getCumulativeStartTimes(videos);

  return (
    <div className="space-y-10">
    <div className={`relative flex flex-row h-full items-center min-h-full justify-center ${showPreview? 'h-[420px]' : 'h-[580px]'} group bg-black rounded-lg`} ref={playerRef}>
      {/* Video Container */}
      <video
        ref={videoRef}
        src={videoSrc || undefined}
        className="h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controls={false}
        onClick={handlePlay}
      ></video>

      {!isPlaying && (
        <img
          src={PauseMain}
          onClick={handlePlay}
          className="h-14 w-14 absolute top-[40%] left-[46%]"
        />
      )}

      {/* Custom Controls */}
      <div
        className="flex flex-col w-full absolute bottom-2 h-14 items-center justify-around 
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

            <img
              src={MergedPuzzles}
              alt="Complete Puzzle"
              className="w-4 h-4 absolute right-0 bottom-[13px]"
            />

            {videosWithStartTimes.map((video, index) => {
              return (
                <div
                  className="absolute bottom-[14px] w-4 h-4 z-40"
                  style={{ left: `${(video.startTime / durationSec) * 100}%` }}
                >
                  <img
                    src={PuzzleIcon}
                    alt="Puzzle Icon"
                    className="w-4 h-4"
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
        <div className="flex flex-row w-full justify-between items-center px-6 -mt-6">
          {/* Left Controls (Play/Pause, Volume, Current Time) */}
          <div className="flex items-center space-x-4">
            <button onClick={handlePlay} className="text-white">
              {isPlaying ? (
                <img src={Pause} alt="" />
              ) : (
                <img src={Play} alt="" />
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
                  <img src={Muted} alt="" />
                ) : (
                  <img src={Unmuted} alt="" />
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
            </div>
          </div>

          {/* Right Controls (Speed, Fullscreen) */}
          <div className="flex items-center space-x-3">
            <div
              className="relative hover:cursor-pointer"
              onClick={handleSubtitle}
            >
              <img src={Subtitle} alt="" />
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
                <img src={Minimize} alt="" />
              ) : (
                <img src={Maximize} alt="" />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div style={{marginBottom: 50}} className="text-[16px] mt-30 text-center ">
        {sec2Min(currentTimeSec.current)?? '00'} /{" "}
          <span className="text-[16px] text-[#D1D1D1]">
         { sec2Min(durationSec)}
          </span>
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: number) => {
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
          {options.map((option, index) => (
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

export default CourseVideoPlayer;
