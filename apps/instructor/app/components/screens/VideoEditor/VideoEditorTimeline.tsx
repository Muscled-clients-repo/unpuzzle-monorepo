import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AiFile } from "../../../types/videoeditor.types";
import { RootState } from "../../../redux/rootReducer";
import "../../style/style.css";
import getBlobDuration from "get-blob-duration";
import WaveSurfer from "wavesurfer.js";
import Image from 'next/image';

import { useVideoTime } from "../../../hooks/useVideoTime";

const OrignalTimeline = ({videoClips,aiAudioClips, cb}:{videoClips:{id:String, url:String},aiAudioClips:{id:String, url:String}, cb:void}) => {

  const [timelineItems, setTimelineItems] = useState<AiFile[]>([]);
  const [aiFiles, setAiFiles] = useState<AiFile[]>([]);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const audioWaveformsRef = useRef<(WaveSurfer | null)[]>([]); // To store WaveSurfer instances for each audio file
  const aiAudioWaveformsRef = useRef<(WaveSurfer | null)[]>([]); // To store WaveSurfer instances for each AI audio file
  const videoTimelineRef = useRef<HTMLDivElement | null>(null);
  const audioTimelineRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | any>(null);

  const {
    videoRef,
    setCurrentTimeSec,
    currentTimeSec,
    setDurationSec,
    durationSec,
  } = useVideoTime();

  const screenBlobUrl = useSelector(
    (state: RootState) => state.video.screenBlob

  );

  console.log("Timeline items", timelineItems);
  console.log("Screenblob", screenBlobUrl);
 

  const maxZoomLevel = 3;
  const minZoomLevel = 0.5;

  // Update the parent width on load and window resize
  useEffect(() => {
    if (parentRef.current) {
      setParentWidth(parentRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    timelineItems.forEach((item, index) => {
      if (item.duration === 0) {
        const videoElement = document.createElement("video");
        videoElement.src = item.url;
        videoElement.onloadedmetadata = () => {
          setTimelineItems((prev) =>
            prev.map((it, idx) =>
              idx === index
                ? {
                    ...it,
                    duration: videoElement.duration,
                    audio: { ...it.audio, duration: videoElement.duration },
                  }
                : it
            )
          );
        };
      }
    });
  }, [timelineItems]);

  const generateThumbnails = async (
    videoUrl: string,
    interval = 5,
    duration: number
  ): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.muted = true; // Ensures autoplay works
      video.preload = "metadata";

      video.addEventListener("loadedmetadata", async () => {
        const thumbnails: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas to a lower resolution for faster processing (adjust as needed)
        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;

        const captureFrame = (time: number): Promise<string> =>
          new Promise((resolve) => {
            video.currentTime = time;
            video.addEventListener(
              "seeked",
              () => {
                requestAnimationFrame(() => {
                  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                  resolve(canvas.toDataURL("image/png"));
                });
              },
              { once: true }
            );
          });

        // Generate all timestamps in parallel
        const timestamps = Array.from(
          { length: Math.ceil(duration / interval) },
          (_, i) => i * interval
        );

        try {
          // Capture all frames asynchronously
          const results = await Promise.all(timestamps.map(captureFrame));
          resolve(results);
        } catch (error) {
          reject(`Thumbnail generation failed: ${error}`);
        }
      });

      video.addEventListener("error", () => {
        reject("Error loading video for thumbnails.");
      });
    });
  };

  const handleScreenRecording = async () => {
    if (screenBlobUrl) {
      const duration = await getBlobDuration(screenBlobUrl);
      console.log("This is the video blob duration:", duration);
      setVideoDuration(duration);

      // Create a new video timeline item when screenBlobUrl changes
      const file = new File(
        [screenBlobUrl],
        `screen-recording-${Date.now()}.webm`,
        {
          type: "video/webm",
        }
      );

      // Generate all thumbnails with a 0.5-second interval
      const thumbnails = await generateThumbnails(screenBlobUrl, 5, duration);
      const newItem = {
        id: `${file.name}-${Date.now()}`,
        type: "video",
        file,
        url: URL.createObjectURL(file),
        duration: duration,
        thumbnails, // Add the array of thumbnails
        audio: {
          url: URL.createObjectURL(file), // Use the same URL for extracting audio waveform
          duration: duration,
        },
      };

      setTimelineItems((prev: any) => [...prev, newItem]);
    }
  };
  
  useEffect(() => {
    handleScreenRecording();
  }, [screenBlobUrl]);

  const handleAiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newItems: AiFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      type: "audio",
      file,
      url: URL.createObjectURL(file),
      duration: 0, // Placeholder
    }));

    setAiFiles((prev) => [...prev, ...newItems]);
    (e.target as any).value = null;
  };

  const updateFileDuration = (
    file: AiFile,
    duration: number,
    type: "video" | "audio"
  ) => {
    if (type === "video") {
      setTimelineItems((prevFiles) =>
        prevFiles.map((f) => (f.id === file.id ? { ...f, duration } : f))
      );
    } else if (type === "audio") {
      setAiFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === file.id ? { ...f, duration } : f))
      );
    }
  };

  console.log("These are the AI audio files", aiFiles);

  // Drag and drop for timeline files
  const handleDragStartItems = (index: number) => {
    setDraggingVideoIndex(index);
  };

  const handleDragOverItems = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggingVideoIndex === null || draggingVideoIndex === index) return;

    const updatedVideos = [...timelineItems];
    const draggedItem = updatedVideos.splice(draggingVideoIndex, 1)[0];
    updatedVideos.splice(index, 0, draggedItem);
    setDraggingVideoIndex(index);
    setTimelineItems(updatedVideos);
  };

  const handleDropItems = () => {
    setDraggingVideoIndex(null); // Clears the dragging state
  };

  useEffect(() => {
    // Iterate over the timelineItems and create waveforms for each audio file
    timelineItems.forEach((aud, index) => {
      if (!aud.audio) {
        return; // Skip if audio is undefined or the waveform already exists
      }

      if (!audioWaveformsRef.current[index]) {
        // Initialize a new WaveSurfer instance for each item in the timeline
        const wavesurfer = WaveSurfer.create({
          container: `#waveform-${index}`,
          waveColor: "#FFFBE6",
          progressColor: "#0047AB",
          height: 50,
        });

        // Load the audio file from the item's audio URL
        wavesurfer.load(aud.audio.url);

        // When the waveform is ready, update the duration in timelineItems if it's not set
        wavesurfer.on("ready", () => {
          if (aud.duration === 0) {
            updateFileDuration(aud, wavesurfer.getDuration(), "audio");
          }
        });

        // Store the WaveSurfer instance in the ref for cleanup
        audioWaveformsRef.current[index] = wavesurfer;
      }
    });

    // Cleanup: Destroy all WaveSurfer instances when the component unmounts
    return () => {
      audioWaveformsRef.current.forEach((waveform, idx) => {
        if (waveform) {
          waveform.destroy();
          audioWaveformsRef.current[idx] = null;
        }
      });
    };
  }, [timelineItems]);

  useEffect(() => {
    aiFiles.forEach((aud, index) => {
      console.log("These are the audios and its indexes", aud, index);
      if (!aiAudioWaveformsRef.current[index]) {
        const wavesurfer = WaveSurfer.create({
          container: `#aiwaveform-${index}`,
          waveColor: "#FFFBE6",
          progressColor: "#ADEBB3",
          height: 40,
        
        });

        wavesurfer.load(aud.url);
        wavesurfer.on("ready", () => {
          if (aud.duration === 0) {
            updateFileDuration(aud, wavesurfer.getDuration(), "audio");
          }
        });

        aiAudioWaveformsRef.current[index] = wavesurfer;
      }
    });

    // Cleanup on unmount
    return () => {
      aiAudioWaveformsRef.current.forEach((waveform, idx) => {
        if (waveform) {tailwind
          waveform.destroy();
          aiAudioWaveformsRef.current[idx] = null;
        }
      });
    };
  }, [aiFiles]);



  // Calculate width based on duration
  const getWidthByDuration = (duration: number) => {
    const basePixelsPerSecond = 200 / 19.8; // Original scale
    const pixelsPerSecond = basePixelsPerSecond * zoomLevel;
    return Math.max(duration * pixelsPerSecond); // Ensure minimum width
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoTimelineRef.current || !videoRef.current) return;

    const timelineRect = videoTimelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - timelineRect.left;

    const totalTimelineWidth = timelineItems.reduce(
      (total, video) => total + video.duration * 10,
      0
    );

    const totalDuration = timelineItems.reduce(
      (total, video) => total + video.duration,
      0
    );

    // Calculate the new current time based on click position
    const newCurrentTime = (clickPosition / totalTimelineWidth) * totalDuration;

    // Update currentTimeSec and video time
    setCurrentTimeSec(newCurrentTime); // From context
    videoRef.current.currentTime = newCurrentTime;
    if (!videoTimelineRef.current) return;
    const timelineDiv = videoTimelineRef.current;
    const timelineRect2 = timelineDiv.getBoundingClientRect();
    // Calculate absolute playhead position (including scroll)
    const newPlayheadPosition =
      e.clientX - timelineRect2.left + timelineDiv.scrollLeft;
    setPlayheadPosition(newPlayheadPosition);
    console.log("Playhead position set to:", newPlayheadPosition);
  };


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd + S
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault(); // Prevent default save dialog
        const timelineDiv = videoTimelineRef.current;
        if (!timelineDiv) return;

        const timelineRect = timelineDiv.getBoundingClientRect();
        const scrollLeft = timelineDiv.scrollLeft;
        // Calculate clientX relative to viewport
        const clientX = timelineRect.left + (playheadPosition - scrollLeft);

        const syntheticEvent = {
          clientX,
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as React.MouseEvent;

        const divUnderPlayhead = findDivUnderPlayhead();
        if (divUnderPlayhead) {
          handleSplit(divUnderPlayhead.index, syntheticEvent);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playheadPosition, timelineItems]);


  const handleSplit = (index: number, event: React.MouseEvent) => {
    const timelineDiv = videoTimelineRef.current;
    if (!timelineDiv) return;

    // Get the position of the click relative to the timeline container
    const rect = timelineDiv.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;

    // Calculate the total width up to this point
    let totalWidth = 0;
    for (let i = 0; i < index; i++) {
      totalWidth += Math.round(getWidthByDuration(timelineItems[i].duration));
    }
    // Determine the clicked item's rendered width and split time
    const currentItem = timelineItems[index];
    const itemWidth =
      timelineDiv.children[index]?.getBoundingClientRect()?.width ||
      Math.round(getWidthByDuration(currentItem.duration));
    const relativeClickPosition = Math.max(
      0,
      Math.min(clickPosition - totalWidth, itemWidth)
    );
    // Calculate split time accurately
    const splitTime = parseFloat(
      ((relativeClickPosition / itemWidth) * currentItem.duration).toFixed(2)
    );

    // Avoid splitting at boundaries
    if (splitTime <= 0 || splitTime >= currentItem.duration) return;

    // Create new timeline items
    const firstPart = { ...currentItem, duration: splitTime };
    const secondPart = {
      ...currentItem,
      id: `${currentItem.id}-split`,
      duration: currentItem.duration - splitTime,
    };
    // Update timeline state
    const newItems = [...timelineItems];
    newItems.splice(index, 1, firstPart, secondPart);
    setTimelineItems(newItems);
  };
  

  const findDivUnderPlayhead = () => {
    let accumulatedWidth = 0;
    const scrollOffset = videoTimelineRef.current?.scrollLeft || 0;
    const adjustedPlayheadPosition = playheadPosition + scrollOffset;

    for (let i = 0; i < timelineItems.length; i++) {
      const currentDivWidth = getWidthByDuration(timelineItems[i].duration);
      if (
        adjustedPlayheadPosition >= accumulatedWidth &&
        adjustedPlayheadPosition < accumulatedWidth + currentDivWidth
      ) {
        const clickPosition = adjustedPlayheadPosition - accumulatedWidth;
        return { index: i, clickPosition };
      }
      accumulatedWidth += currentDivWidth;
    }

    // If the playhead is out of bounds (beyond the last div)
    return null;
  };

  const handleVideoDelete = (id: number) => {
    // Filter out the item with the specified id
    setTimelineItems((prev) => prev.filter((item, index) => index !== id));
  };

  const handleAiAudioDelete = (id: number) => {
    // Filter out the item with the specified id
    setAiFiles((prev) => prev.filter((item, index) => index !== id));
  };

  const handleScrollSync = (
    source: HTMLDivElement | null,
    target: HTMLDivElement | null
  ): void => {
    if (source && target) {
      target.scrollLeft = source.scrollLeft;
    }
  };

  return (

    <div ref={parentRef} className="">

      <div className="flex gap-3 mt-2 w-full">
        <div
          className="flex flex-col gap-3"
          style={{ width: `${parentWidth}px` }}
        >
          {/* Video timeline */}
          <div className={`flex w-full items-end gap-3`}>
            <div className="flex flex-col items-center gap-1">
              <Image src="/assets/video.svg" width={32} height={32} className="max-w-[33px]" alt="Video Icon" />
              {/* <p className="text-[8px] font-normal text-[#5F6165] leading-normal text-center">
                Video
              </p> */}
            </div>
            <div className="border-b  border-[rgba(217,217,217,0.70)] w-full relative">
              <Image
                src="/assets/head.svg"
                width={14}
                height={24}
                className="playhead absolute "
                style={{
                  transition: "linear 300ms", // Smooth animation
                  left:
                    timelineItems.length > 0
                      ? `${
                          (currentTimeSec /
                            timelineItems.reduce(
                              (total, video) => total + video.duration,
                              0
                            )) *
                          (timelineItems.reduce(
                            (total, video) => total + video.duration * 10 -1.1,
                            0
                          ) +
                            timelineItems.length - 4) // Add gaps between videos
                        }px`
                      : // ? Math.ceil(currentTimeSec * 50)
                        "0",
                  zIndex: "1",
                }}
                alt="Playhead"
              />

              <div className="w-full  flex flex-row">
                <div
                  ref={videoTimelineRef}
                  onScroll={() =>
                    handleScrollSync(
                      videoTimelineRef.current,
                      audioTimelineRef.current
                    )
                  }
                  onClick={handleTimelineClick}
                  className="flex flex-row space-x-1 w-full overflow-x-auto whitespace-nowrap"
                  style={{height: "42px"}}
                >
                  {timelineItems.map((video, index) => (
                    <div
                      key={video.id}
                      className="border-2 border-[#1D1D1D] ml-1 relative"
                      style={{ width: `${Math.round(video.duration * 10 - 4 )}px` }} // Scale the container width dynamically
                      draggable
                      onDragStart={() => handleDragStartItems(index)}
                      onDragOver={(e) => handleDragOverItems(e, index)}
                      onDrop={handleDropItems}
                      onDoubleClick={(e) => handleSplit(index, e)}
                    >
                      <div className="flex h-full overflow-x-scroll no-scrollbar">
                        {video.thumbnails.map(
                          (thumbnail, thumbIndex: number) => (
                            <Image
                              key={thumbIndex}
                              src={thumbnail}
                              width={Math.round((video.duration * 10 -2) / video.thumbnails.length)}
                              height={42}
                              alt="Thumbnail"
                              className="h-full"
                            />
                          )
                        )}
                      </div>
                      <button onClick={() => handleVideoDelete(index)}>
                        <Image
                          src="/assets/trash-bin.png"
                          width={16}
                          height={16}
                          className="w-4 h-4 absolute right-[5px] top-[5px]"
                          alt="Delete Icon"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio timeline */}
          <div className={`flex w-full items-end gap-3`}>
            <div className="flex flex-col items-center gap-1">
              <Image src="/assets/audio.svg" width={32} height={32} className="max-w-[33px]" alt="Video Icon" />
              {/* <p className="text-[8px] font-normal text-[#5F6165] leading-normal text-center">
                Audio
              </p> */}
            </div>
            <div className=" border-b border-[rgba(217,217,217,0.70)] w-full">
              <div className="w-full h-10  flex flex-row">
                <div
                  ref={audioTimelineRef}
                  onScroll={() =>
                    handleScrollSync(
                      audioTimelineRef.current,
                      videoTimelineRef.current
                    )
                  }
                  className="flex  flex-row space-x-1 w-full overflow-x-auto whitespace-nowrap no-scrollbar"
                >
                  {timelineItems.map((audio, index) => (
                    <div
                      key={audio.id}
                      className="border ml-1 rounded-lg border-gray-300 bg-gradient-to-tr from-cyan-400 to-purple-600"
                      // style={{ minWidth: getWidthByDuration(audio.duration) }}
                      // style={{ width: Math.ceil(durationSec) }}
                      style={{ width: `${audio.duration * 10- 4}px` }} // Scale the container width dynamically
                      draggable
                      onDragStart={() => handleDragStartItems(index)}
                      onDragOver={(e) => handleDragOverItems(e, index)}
                      onDrop={handleDropItems}
                      onDoubleClick={(e) => handleSplit(index, e)}
                    >
                      <div
                        id={`waveform-${index}`}
                        className="w-full h-full rounded-lg"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI timeline*/}
          <div className="flex h-full w-full items-end gap-3 ">
            <div className="flex flex-col items-center gap-1">
              <Image src="/assets/ai.svg" width={32} height={32} className="max-w-[33px]" alt="Video Icon" />
              {/* <p className="text-[8px] font-normal text-[#5F6165] leading-normal text-center">
                AI
              </p> */}
            </div>
            <div className="border-b h-10 border-[rgba(217,217,217,0.70)] w-full flex items-center justify-center">
              <div className="h-full flex flex-row space-x-1 w-full overflow-x-auto whitespace-nowrap no-scrollbar items-center">
                {aiFiles.map((audio, index) => (
                  <div
                    key={audio.id}
                    className="flex items-center h-10 justify-center relative border rounded-lg bg-gradient-to-tr from-red-300 to-red-500"
                    style={{ minWidth: getWidthByDuration(audio.duration) }}
                  >
                    <div id={`aiwaveform-${index}`} className="w-full"></div>
                    <button onClick={() => handleAiAudioDelete(index)}>
                      <Image
                        src="/assets/trash-bin.png"
                        width={16}
                        height={16}
                        className="z-40 w-4 h-4 absolute right-[5px] top-[5px]"
                        alt="Delete Icon"
                      />
                    </button>
                  </div>
                ))}

                {/* Add Button */}
                <div className="h-full items-center justify-center">
                  <label className="cursor-pointer h-full items-center justify-center">
                    <input
                      type="file"
                      accept="audio/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => handleAiFileUpload(e)}
                    />
                    <div className="flex justify-center items-center">
                      <Image src="/assets/add.svg" width={24} height={24} alt="Add Ai Audio" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Music timeline */}
          <div className="flex w-full items-end gap-3">
            <div className="flex flex-col items-center gap-1">
              <Image src="/assets/music.svg" width={32} height={32} alt="Video Icon" />
              {/* <p className="text-[8px] font-normal text-[#5F6165] leading-normal text-center">
                Music
              </p> */}
            </div>

            <div className="border-b h-10 border-[rgba(217,217,217,0.70)] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrignalTimeline;
