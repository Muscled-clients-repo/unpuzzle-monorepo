import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { useDispatch, useSelector } from "react-redux";
import {
  startCountdown,
  decrementCountdown,
  skipCountdown,
} from "../../../redux/features/recording/recordingSlice";
import "../../style/style.css";
import Image from "next/image";

export default function AssetsPageTab() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const countdown = useSelector((state: any) => state.recording.countdown);
  const [screenBlob, setScreenBlob] = useState<Blob | null>(null);
  const recordingStarted = useSelector((state: any) => state.recording.recordingStarted);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const persistent = useSelector((state: any) => state.sidebar.persistent);

  // Start countdown and trigger screen recording
  const handleStartCountdownAndRecord = () => {
    if (recordingStarted) return; // Prevent multiple triggers

    dispatch(startCountdown()); // Start Redux countdown
    const countdownInterval = setInterval(() => {
      // Use Redux countdown state
      if (countdown === 1) {
        clearInterval(countdownInterval);
        dispatch(decrementCountdown()); // Final decrement
      } else {
        dispatch(decrementCountdown()); // Decrement in Redux
      }
    }, 1000);
  };

  // Stop Screen recording
  const handleStopRecording = () => {
    if (!recordingStarted) return; // Prevent duplicate calls
    // stopScreenRecording();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      // Filter duplicate files
      const newFiles = files.filter(
        (newFile) =>
          !selectedFiles.some(
            (selectedFile) =>
              selectedFile.name === newFile.name &&
              selectedFile.size === newFile.size &&
              selectedFile.lastModified === newFile.lastModified
          )
      );

      if (newFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
      event.target.value = ""; // Reset input
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);

      // Filter duplicate files
      const newFiles = files.filter(
        (newFile) =>
          !selectedFiles.some(
            (selectedFile) =>
              selectedFile.name === newFile.name &&
              selectedFile.size === newFile.size &&
              selectedFile.lastModified === newFile.lastModified
          )
      );

      if (newFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredFiles = (type: "image" | "video" | "recording") =>
    selectedFiles
      .filter((file) => {
        if (type === "image") return file.type.startsWith("image/");
        if (type === "video" || type === "recording") return file.type.startsWith("video/");
        return false;
      })
      .filter((file) => file.name.toLowerCase().includes(searchTerm));

  const renderFiles = (files: File[]) =>
    files.length > 0 ? (
      <div className="flex flex-wrap justify-between max-h-[552px] overflow-y-auto pretty-scrollbar">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative w-[47%] h-max rounded-[4px] overflow-hidden"
          >
            {file.type.startsWith("image/") ? (
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="max-w-full w-full h-[98px] object-cover rounded-[4px]"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                className="max-w-full w-full h-[98px] object-cover rounded-[4px]"
                controls={false}
              >
                <track default kind="captions" />
              </video>
            )}
            <div className="mt-1 text-xs py-[2px] truncate whitespace-nowrap overflow-hidden text-ellipsis text-[10px] font-normal leading-3 text-center break-all">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-sm text-gray-500">No files found</p>
    );

  return (
    <div
      className={`h-auto w-[24%] bg-white transition-transform ${persistent ? "translate-x-0 border-r border-r-[#F4EEEE] px-2" : "-translate-x-full"
        }`}
    >
      <div
        className={`bg-white pt-[24px] pb-[30px] rounded-[16px] h-full w-full ${isDragging ? "border-2 border-dashed border-blue-500" : ""
          }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Search Input */}
        <div className="mb-[10px] h-[35px] w-full flex flex-row items-center justify-start p-[10px] gap-4 ring-[1px] ring-[#D9D9D9]">
          <Image src={'/assets/SearchIcon.svg'} alt="Search" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#F5F4F6] h-full rounded-[6px] text-sm font-medium text-[#5F6165] placeholder-[#A0A3A9] focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Upload Button */}
        <label
          htmlFor="file-upload"
          className="w-full bg-[#00AFF0] mb-4 h-[42px] rounded-[6px] flex items-center justify-center text-white font-medium cursor-pointer"
        >
          Upload Files
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label>
        {pathname === "/assets" && (
          <button
            onClick={recordingStarted ? handleStopRecording : handleStartCountdownAndRecord}
            className="w-full bg-[#FFFFFF] mb-4 h-[42px] rounded-[6px] flex items-center justify-center text-[#000000] font-medium cursor-pointer ring-1 ring-[#D9D9D9]"
          >
            <p>Start Recording</p>
          </button>
        )}

        {/* Tabs */}
        <Tabs defaultValue="images" className="h-auto w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-white py-[10px] px-[8px] h-auto rounded-[12px]">
            <TabsTrigger
              value="images"
              className="text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[25px] hover:bg-[#00AFF0] hover:text-white"
            >
              Images
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[25px] hover:bg-[#00AFF0] hover:text-white"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="recordings"
              className="text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[25px] hover:bg-[#00AFF0] hover:text-white"
            >
              Recordings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images">{renderFiles(filteredFiles("image"))}</TabsContent>
          <TabsContent value="videos">{renderFiles(filteredFiles("video"))}</TabsContent>
          <TabsContent value="recordings">{renderFiles(filteredFiles("recording"))}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
