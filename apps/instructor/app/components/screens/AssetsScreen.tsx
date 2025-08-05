'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStopRecording } from '../../redux/features/recording/recordingSlice';
import { Popover, PopoverContent, PopoverTrigger } from "../../components/shared/ui/Popover";
import AssetsPageTab from "../../components/shared/ui/AssetsPageTab";
import { useReactMediaRecorder } from "react-media-recorder";
import Draggable from "react-draggable";
import Image from "next/image";
import { Asset, RootState } from "../../types/assets.types";

const demoAssets: Asset[] = [
  {
    type: "Images",
    name: "Shopify UI UX Design in Figma",
    size: "150 KB",
    duration: null,
    src: "/assets/shopify2.svg",
    icon: "/assets/imageIcon.svg",
  }
];

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>(demoAssets);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [screenBlob, setScreenBlob] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen]= useState<boolean>(false)
  const dispatch = useDispatch();
  const showControls = useSelector((state: RootState) => state.recording.showControls);
  const recordingStarted = useSelector((state: RootState) => state.recording.recordingStarted);
  const countdown = useSelector((state: RootState) => state.recording.countdown);
  const isVisible = useSelector((state: RootState) => state.sidebar.isVisible);
  const persistent = useSelector((state: RootState) => state.sidebar.persistent);

  const { status: recordingStatus, startRecording: startScreenRecording, stopRecording: stopScreenRecording, mediaBlobUrl: screenBlobUrl } =
    useReactMediaRecorder({
      screen: true,
      // videoConstraints: { frameRate: { ideal: 30, max: 60 } },
      onStop: (blobUrl) => {
        setScreenBlob(blobUrl);
        console.log("Recording stopped, blob:", blobUrl);
      },
    });

  // Handle tab clicks to set the filter type
  const handleTabClick = (tab:string) => {
    setFilterType(tab);
  };
  
  // Filter and search functionality
  const filteredAndSearchedAssets = assets.filter((asset) => {
    const matchesFilter = filterType === "all" || asset.type === filterType;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Screen Recording Start useEffect
  useEffect(() => {
    if (recordingStarted) {
      startScreenRecording(); // Start only screen recording first
    }
  }, [recordingStarted]);

  // Stop Screen recording
  const handleStopRecording = () => {
    if (!recordingStarted) return; // Prevent duplicate calls
    dispatch(setStopRecording());
    stopScreenRecording();
    //setIsRecording(false);
  };

  // Timer effect: Start/Stop the timer based on recording status
  useEffect(() => {
    let timerInterval: any;
    
    if (recordingStatus === 'recording') {
      // Start or resume the timer
      timerInterval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1); // Increment the timer every second
      }, 1000);
    } else if (recordingStatus === 'paused') {
      // Pause the timer
      clearInterval(timerInterval);
    } else if (recordingStatus === 'stopped') {
      // Stop and reset the timer
      clearInterval(timerInterval);
      setElapsedTime(0); // Reset the timer when recording stops
    }

    return () => clearInterval(timerInterval); // Cleanup interval on component unmount or status change
  }, [recordingStatus]);

  // Format the elapsed time in MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="w-full flex gap-2 justify-center px-3">
      {persistent && <AssetsPageTab />}
      <div
        className={`w-full h-full flex gap-6 justify-center flex-col ${
          !persistent ? "px-10" : "px-3"
        }`}
      >
        <div className="w-[70%] flex items-center px-4 py-2 bg-[#F5F4F6] rounded-[100px]">
          <Image src="/assets/searchIcon.svg" alt="searchIcon" width={20} height={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none bg-transparent px-3 bg-"
          />
        </div>
        <div className="w-full flex flex-col gap-5">
          {/* Tabs for filtering */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2 cursor-pointer">
              {["all", "Screen Recordings", "Uploaded Videos", "Images"].map(
                (type) => (
                  <button
                    key={type}
                    className={`py-[12px] w-fit px-4 rounded-[8px] ${
                      filterType === type
                        ? "bg-[#00AFF0] text-white"
                        : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
                    } text-[16px] font-medium leading-normal`}
                    onClick={() => handleTabClick(type)}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("-", " ")}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Display filtered assets */}
          <div className="overflow-auto h-[90vh] ">
            <div
              className={`grid pr-[20px] ${
                persistent ? "grid-cols-3" : "grid-cols-4"
              } gap-x-3 gap-y-6`}
            >
              {filteredAndSearchedAssets.map((asset, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[15px] p-3 col-span-1 border border-[#F4EEEE]"
                >
                  <div className="relative">
                    <Image
                      src={asset.src}
                      alt={asset.name}
                      width={200}
                      height={120}
                      className="rounded-md w-full object-cover"
                    />
                  </div>

                  <p className="text-[16px] mb-2 mt-2 text-[#1d1d1d] leading-normal font-semibold">
                    {asset.name}
                  </p>

                  <div className="flex items-center justify-between">
                    <Image src="/assets/download.svg" alt="" width={16} height={16} />
                    <p className="text-[#55565B] font-medium text-xs">500 Mb</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {countdown !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            className="flex flex-col justify-center items-center rounded-full w-[280px] pt-[20px] pb-[40px] px-[100px] h-[280px]"
            style={{
              background:
                "linear-gradient(215deg, #5B5BF0 2.4%, #00AFF0 102.51%)",
            }}
          >
            <span className="text-white text-[100px] font-bold countdown-animation">
              {countdown}
            </span>
            <button
              // onClick={handleSkipCountdown}
              className="bg-transparent text-white text-2xl font-bold"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {showControls && (
        <Draggable>
          <div className="fixed h-auto w-auto bottom-4 z-50 left-4 flex flex-col">
            <div
              className={
                "h-14 w-auto bottom-4 z-50 left-4 transition-all duration-300"
              }
            >
              <div className="h-14 w-[150px] hover:w-[260px] ease-in-out duration-500 bottom-8 z-50 left-8 pr-2 pl-2 bg-[#000] rounded-full gap-5 flex items-center justify-center text-white shadow-lg group ">
                <div className="relative h-full w-full flex flex-row items-center justify-start">
                  <div className="sticky left-0 flex items-center gap-3">
                    <button className="h-10 w-10" onClick={handleStopRecording}>
                      <Image
                        className="w-10 h-10"
                        src="/assets/recording-stop-blue.svg"
                        alt="Stop"
                        width={40}
                        height={40}
                      />
                    </button>
                    <span className="text-white text-sm font-semibold leading-normal text-center">
                      {formatTime(elapsedTime)}
                    </span>
                    <button className="h-10 w-10">
                      <Image className="w-4 h-4" src="/assets/ai-pause.svg" width={16} height={16} alt="Pause" />
                    </button>
                  </div>
                  <div className="flex items-center gap-5 transition-[width,opacity] duration-500 ease-in-out overflow-hidden w-0 opacity-0 group-hover:w-[250px] group-hover:opacity-100">
                    <Popover>
                      <button
                        className="mt-[5px]"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Image className="h-4 w-4" src="/assets/puzzles.svg" alt="Grid" width={16} height={16} />
                      </button>
                      <PopoverContent className="w-[355px] my-12 px-3 py-[9px] bg-[#F5F4F6] shadow-none border border-[rgba(95,97,101,0.20)]"></PopoverContent>
                    </Popover>
                    <button>
                      <Image
                        className="h-4 w-4"
                        src="/assets/rewind.svg"
                        alt="Refresh"
                        width={16}
                        height={16}
                      />
                    </button>
                    <button /*onClick={() => dispatch(stopRecording())}*/>
                      <Image className="h-4 w-4" src="/assets/trash.svg" alt="Delete" width={16} height={16} />
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
}
