import React, { useRef, useState, useEffect, MutableRefObject } from "react";

import Image from "next/image";
import WaveSurfer from "wavesurfer.js";
import { Mic, Upload, X } from "lucide-react";
import SharedButton from "../../shared/SharedButton";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import CustomAudioPlayer from "../../shared/ui/CustomAudioPlayer";
import { usePuzzleReflect } from "@/app/hooks/usePuzzleReflect";
const DUMMY_API_ENDPOINT = "/api/reflect"; // Dummy endpoint

const PuzzleReflect = ({videoId,currentTimeSec}:{videoId:string,currentTimeSec:MutableRefObject<number>}) => {
  // use hook
  const {
    createAudioReflect,
    createVideoReflect,
    createLoomLinkReflect,
    createFileReflect
  } = usePuzzleReflect();
  // states
  const [selectedOption, setSelectedOption] = useState<
    "audio" | "screenshot" | "loom" | null
  >(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // WaveSurfer refs and state
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);
  const recordPluginRef = useRef<any>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  // Loom state
  const [loomUrl, setLoomUrl] = useState(""); 
  const [showLoomInput, setShowLoomInput] = useState(false);

  // Show input states
  const [showAudioInput, setShowAudioInput] = useState(false);
  const [showScreenshotInput, setShowScreenshotInput] = useState(false);

  // Congrats screen state
  const [showCongrats, setShowCongrats] = useState<
    null | "audio" | "screenshot" | "loom"
  >(null);

  // --- WaveSurfer Setup ---
  useEffect(() => {
    if (!showAudioInput) return;
    if (!waveformRef.current) return;
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#000000",
      progressColor: "#000000",
      cursorColor: "#FFFFFF",
      height: 60,
      barWidth: 2,
      barGap: 0.3,
      barRadius: 2,
      hideScrollbar: true,
    });
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: true,
      })
    );
    recordPluginRef.current.on("record-end", (blob: Blob) => {
      const recordedUrl = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(recordedUrl);
      wavesurferRef.current.load(recordedUrl);
      setIsRecording(false);
      setRecordingTime(0);
    });
    recordPluginRef.current.on("record-progress", (time: number) => {
      setRecordingTime(time);
    });
    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
      recordPluginRef.current = null;
    };
    // Only run when audio input UI is shown
  }, [showAudioInput]);

  // --- Audio recording handlers ---
  const startRecording = () => {
    console.log("startRecording run");
    console.log("recordPluginRef.current: ", recordPluginRef.current);
    if (recordPluginRef.current) {
      recordPluginRef.current.startRecording();
      setAudioUrl(null);
      setAudioBlob(null);
      setIsRecording(true);
    }
  };
  const stopRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopRecording();
    }
    setIsRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    await createAudioReflect(audioBlob, videoId, currentTimeSec.current);
    setShowCongrats("audio");
    setAudioUrl(null);
    setAudioBlob(null);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
    };
    // eslint-disable-next-line
  }, []);

  const cleanupStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Screenshot state
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  // Screenshot handlers
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      const newFiles = Array.from(file);

      setScreenshotFiles((prev) => {
        // Filter out files that already exist (by name and size)
        const uniqueFiles = newFiles.filter(
          (newFile) =>
            !prev.some(
              (existingFile) =>
                existingFile.name === newFile.name &&
                existingFile.size === newFile.size
            )
        );

        return [...prev, ...uniqueFiles];
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setScreenshotFiles((prev) => [
        ...prev,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const uploadScreenshot = async () => {
    if (!screenshotFiles.length) return;
    await createFileReflect(screenshotFiles, videoId);
    setScreenshotFiles([]);
    setShowCongrats("screenshot");
  };

  // Loom handlers
  const uploadLoom = async () => {
    if (!loomUrl) return;
    await createLoomLinkReflect(loomUrl, videoId);
    setShowCongrats("loom");
    setLoomUrl("");
  };

  return (
    <>
      {showCongrats === "audio" && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Image
            src="/assets/congratulation.svg"
            width={500}
            height={500}
            alt=" congratulation popup"
            className=" w-full"
          />

          <span className="text-xs text-center flex flex-col">
            <span className="text-sm font-semibold">Congrats</span>I know, it’s
            tough to submit these reflections, but you know it’s best for the
            long run.{" "}
          </span>
          <SharedButton
            onClick={() => {
              setShowCongrats(null);
              setSelectedOption(null);
              setShowAudioInput(false);
              setAudioUrl(null);
              setAudioBlob(null);
              setIsRecording(false);
              cleanupStream();
            }}
          >
            Back to Main
          </SharedButton>
        </div>
      )}
      {showCongrats === "screenshot" && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Image
            src="/assets/congratulation.svg"
            width={500}
            height={500}
            alt=" congratulation popup"
            className=" w-full"
          />

          <span className="text-xs text-center flex flex-col">
            <span className="text-sm font-semibold">Congrats</span>I know, it’s
            tough to submit these reflections, but you know it’s best for the
            long run.{" "}
          </span>
          <SharedButton
            onClick={() => {
              setShowCongrats(null);
              setSelectedOption(null);
              setShowAudioInput(false);
              setAudioUrl(null);
              setAudioBlob(null);
              setIsRecording(false);
              cleanupStream();
            }}
          >
            Back to Main
          </SharedButton>
        </div>
      )}
      {showCongrats === "loom" && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Image
            src="/assets/congratulation.svg"
            width={500}
            height={500}
            alt=" congratulation popup"
            className=" w-full"
          />

          <span className="text-xs text-center flex flex-col">
            <span className="text-sm font-semibold">Congrats</span>I know, it’s
            tough to submit these reflections, but you know it’s best for the
            long run.{" "}
          </span>
          <SharedButton
            onClick={() => {
              setShowCongrats(null);
              setSelectedOption(null);
              setShowAudioInput(false);
              setAudioUrl(null);
              setAudioBlob(null);
              setIsRecording(false);
              cleanupStream();
            }}
          >
            Back to Main
          </SharedButton>
        </div>
      )}

      {!showCongrats && !selectedOption && (
        <div className="flex flex-col gap-3">
          <SharedButton onClick={() => setSelectedOption("audio")}>
            Record Audio
          </SharedButton>
          <SharedButton onClick={() => setSelectedOption("screenshot")}>
            Upload Screenshot
          </SharedButton>
          <SharedButton onClick={() => setSelectedOption("loom")}>
            Send Loom Video URL
          </SharedButton>
        </div>
      )}

      {/* Audio Option */}
      {!showCongrats && selectedOption === "audio" && !showAudioInput && (
        <div className="flex flex-col gap-4 mt-4">
          <span className=" text-xs flex items-center">
            <Mic className=" h-4 w-4" />
            Ready to record Your Understanding?
          </span>{" "}
          <div className="flex flex-col gap-2 mt-4">
            <SharedButton onClick={() => setShowAudioInput(true)}>
              Record Memo
            </SharedButton>
            <SharedButton
              onClick={() => {
                setSelectedOption(null);
                setShowAudioInput(false);
              }}
            >
              No Thanks
            </SharedButton>
          </div>
        </div>
      )}
      {!showCongrats && selectedOption === "audio" && showAudioInput && (
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <div className="flex flex-col gap-2 mt-4 items-center">
              <div ref={waveformRef} className="w-full max-w-lg mb-2" />
              {!isRecording ? (
                !audioUrl && (
                  <SharedButton
                    onClick={startRecording}
                    title="Start Recording"
                  >
                    Start Recording
                  </SharedButton>
                )
              ) : (
                <SharedButton onClick={stopRecording} title="Stop Recording">
                  Stop Recording
                </SharedButton>
              )}
              {/* {isRecording && (
                <span className="ml-4 text-xs text-gray-500">
                  Recording... {recordingTime.toFixed(1)}s
                </span>
              )} */}
            </div>
            {audioUrl && (
              <div className="mt-4 flex flex-col gap-2">
                <audio controls src={audioUrl} className="w-full" />
                <SharedButton onClick={() => setAudioUrl(null)}>
                  Cancel
                </SharedButton>
                <SharedButton onClick={uploadAudio}>Upload Audio</SharedButton>
              </div>
            )}
          </div>
          <SharedButton
            onClick={() => {
              setAudioUrl(null);
              setAudioBlob(null);
              setIsRecording(false);
              setSelectedOption(null);
              setShowAudioInput(false);
              setRecordingTime(0);
            }}
          >
            Back
          </SharedButton>
        </div>
      )}

      {/* Screenshot Option */}
      {!showCongrats &&
        selectedOption === "screenshot" &&
        !showScreenshotInput && (
          <div className="flex flex-col mt-4">
            <span className=" text-xs">Ready to upload your screenshot?</span>
            <div className="flex flex-col gap-2 mt-4">
              <SharedButton onClick={() => setShowScreenshotInput(true)}>
                Upload Screenshot
              </SharedButton>
              <SharedButton
                onClick={() => {
                  setSelectedOption(null);
                  setShowScreenshotInput(false);
                }}
              >
                No Thanks
              </SharedButton>
            </div>
          </div>
        )}
      {!showCongrats &&
        selectedOption === "screenshot" &&
        showScreenshotInput && (
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <div
                className={`mt-2 border-2 border-dashed rounded p-4 flex flex-col items-center justify-center cursor-pointer transition h-[111px] 
          ${
            screenshotFiles.length
              ? "border-green-400"
              : "border-gray-300 hover:border-blue-400"
          }`}
                onClick={() =>
                  document.getElementById("screenshot-input")?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
              >
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleScreenshotChange}
                />
                <span className="text-gray-500 text-sm">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Upload />
                    <span className="border rounded border-[#E4E4E4] flex flex-col justify-center items-center cursor-pointer text-black px-2 py-1 text-xs">
                      Upload Your Screenshot
                    </span>
                    <span>Drag & Drop</span>
                  </div>
                  {/* Click or drag & drop image(s) here */}
                </span>
              </div>
              {/* Preview list */}
              {screenshotFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {screenshotFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center w-full px-3 py-2 border border-[#E4E4E4] rounded mb-2"
                    >
                      <span className="text-xs truncate max-w-[70%]">
                        {file.name.length > 10
                          ? file.name.slice(0, 10) + "..."
                          : file.name}
                      </span>

                      <button
                        onClick={() =>
                          setScreenshotFiles((prev) =>
                            prev.filter(
                              (innerFile) => innerFile.name !== file.name
                            )
                          )
                        }
                      >
                        <X className=" text-[#606060] cursor-pointer" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {screenshotFiles.length > 0 && (
                <SharedButton
                  className="btn-dark p-2 rounded mt-2"
                  onClick={uploadScreenshot}
                >
                  Upload Screenshot{screenshotFiles.length > 1 ? "s" : ""}
                </SharedButton>
              )}
            </div>
            <SharedButton
              onClick={() => {
                setScreenshotFiles([]);
                setSelectedOption(null);
                setShowScreenshotInput(false);
              }}
            >
              Back
            </SharedButton>
          </div>
        )}

      {/* Loom Option */}
      {!showCongrats && selectedOption === "loom" && (
        <div className="flex flex-col gap-4 mt-4">
          {!showLoomInput ? (
            <>
              <div className="flex flex-col gap-2 mt-4">
                <SharedButton onClick={() => setShowLoomInput(true)}>
                  Send Loom Recording
                </SharedButton>
                <SharedButton
                  onClick={() => {
                    setSelectedOption(null);
                    setShowLoomInput(false);
                  }}
                >
                  No Thanks
                </SharedButton>
              </div>
            </>
          ) : (
            <>
              <input
                type="url"
                className="border rounded p-2 mt-2 w-full"
                placeholder="Insert Loom Recording"
                value={loomUrl}
                onChange={(e) => setLoomUrl(e.target.value)}
              />
              <SharedButton onClick={uploadLoom} disabled={!loomUrl}>
                Done
              </SharedButton>
              <SharedButton
                onClick={() => {
                  setShowLoomInput(false);
                  setLoomUrl("");
                }}
              >
                Back
              </SharedButton>
            </>
          )}
        </div>
      )}
      {/* <CustomAudioPlayer /> */}
    </>
  );
};

export default PuzzleReflect;
