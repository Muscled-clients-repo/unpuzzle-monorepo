"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/redux/rootReducer";


const ScreenRecording = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [status, setStatus] = useState("idle");
  const [videoPlaybackUrl, setVideoPlaybackUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(
    null
  );
  const recordedChunks = useRef<Blob[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedChunks, setUploadedChunks] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const m1Url = process.env.NEXT_PUBLIC_M1_SERVER_URL;

  // Helper to create preview URL
  const createPreviewUrl = () => {
    if (recordedChunks.current.length > 0) {
      const combinedBlob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });
      const localUrl = URL.createObjectURL(combinedBlob);
      setVideoPlaybackUrl(localUrl);
    }
  };

  let uploadId: string | null = null;
  let isRecording = false;
  //  let uploadIduseRef<string | null>(null);

  // Get upload id
  const getUploadId = async () => {
    try {
      const response = await fetch(`${m1Url}/api/video/upload`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        uploadId = data.data.fileId;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Upload video chunk to M1 server
  const uploadVideoChunk = async () => {
    if (!m1Url) {
      console.error("M1 server URL not configured");
      return;
    }
    if(!isRecording){
      // Concatenate all remaining chunks into one final chunk
      const combinedBlob = new Blob(recordedChunks.current, {
        type: "video/webm"
      });
      recordedChunks.current = [combinedBlob];
    }

    const chunk = recordedChunks.current[0];
    if(!chunk){
      if(isRecording){
        setTimeout(uploadVideoChunk, 1000);
      }
      return;
    }


    try {
      console.log("uploadId is: ", uploadId);
      if (!uploadId) {
        await getUploadId();
        return uploadVideoChunk()
      }
      const formData = new FormData();

      formData.append("file", chunk, `chunk_${uploadId}.webm`);
      formData.append("fileId", uploadId);
      

      formData.append("status", isRecording ? "uploading" : "completed");

      const response = await fetch(`${m1Url}/api/video/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`Chunk ${uploadId} uploaded successfully:`, result);
      recordedChunks.current.shift()

      // Update progress
      setUploadedChunks((prev) => prev + 1);
      const progress = ((uploadedChunks + 1) / totalChunks) * 100;
      setUploadProgress(progress);

      if (!isRecording) {
        setStatus("uploaded");
        uploadId=null
        return;
      }
      setTimeout(uploadVideoChunk, 1000);
    } catch (error) {
      console.error(`Error uploading chunk ${uploadId}:`, error);
      setStatus("error");
    }
  };

  const startRecording = async () => {
    setStatus("recording");
    isRecording = true;
    recordedChunks.current = [];
    setVideoPlaybackUrl(null);
    setUploadProgress(0);
    setUploadedChunks(0);
    setTotalChunks(0);
    uploadVideoChunk()

    try {
      // Get screen stream (with possible tab audio)
      const screenStream = await (
        navigator.mediaDevices as any
      ).getDisplayMedia({ video: true, audio: true });
      // Get microphone stream
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // Combine video + all audio tracks
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...micStream.getAudioTracks(),
      ]);
      setRecordingStream(combinedStream);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm; codecs=vp8,opus",
      });
      setMediaRecorder(recorder);

      let chunkIndex = 0;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
          setTotalChunks((prev) => prev + 1);

          // Upload chunk immediately while recording continues
          // await uploadVideoChunk(event.data, chunkIndex, false);
          chunkIndex++;
        }
      };

      recorder.onstop = async () => {
        setStatus("finalizing");
        isRecording = false;
        // Stop all tracks
        combinedStream.getTracks().forEach((track) => track.stop());
        setRecordingStream(null);

        // Upload the final chunk with completed status
        // if (recordedChunks.current.length > 0) {
        //   const lastChunk =
        //     recordedChunks.current[recordedChunks.current.length - 1];

        //   // await uploadVideoChunk(lastChunk, chunkIndex, true);
        // }

        // Create preview URL
        createPreviewUrl();
      };

      // Listen for the user clicking 'Stop sharing' in the browser
      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      });

      // Start recording with 1-second timeslice for frequent chunks
      recorder.start(1000); // 1 second chunks
    } catch (error) {
      console.error("Error starting recording:", error);
      setStatus("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        {status === "recording" ? (
          <button
            onClick={stopRecording}
            className="flex flex-col items-center justify-center w-[80px] h-[70px] gap-[10px] px-[8px] py-[7px] rounded-md text-sm font-medium hover:bg-[#F3F5F8] cursor-pointer text-[#1D1D1D] bg-red-100"
          >
            <Image
              height="22"
              width="22"
              src="/assets/RecPath.svg"
              alt="Stop recording icon"
            />
            <p className="text-sm">Stop</p>
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={status === "finalizing"}
            className="flex flex-col items-center justify-center w-[80px] h-[70px] gap-[10px] px-[8px] py-[7px] rounded-md text-sm font-medium hover:bg-[#F3F5F8] cursor-pointer text-[#1D1D1D] disabled:opacity-50"
          >
            <Image
              height="22"
              width="22"
              src="/assets/RecPath.svg"
              alt="Recording icon"
            />
            <p className="text-sm">Recording</p>
          </button>
        )}
      </div>

      {/* Real-time Upload Progress */}
      {status === "recording" && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Recording and uploading... ({uploadedChunks}/{totalChunks} chunks)
          </p>
        </div>
      )}

      {/* Finalizing Upload */}
      {status === "finalizing" && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Finalizing upload...</p>
        </div>
      )}

      {/* Status Messages 
      {status === "uploaded" && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          <p className="text-sm">Video uploaded successfully!</p>
        </div>
      )}
      */}

      {status === "error" && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          <p className="text-sm">Upload failed. Please try again.</p>
        </div>
      )}

      {/* Video Preview 
      {videoPlaybackUrl && (
        <div className="mt-4">
          <video 
            controls 
            className="w-full max-w-md rounded"
            src={videoPlaybackUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      */}
    </div>
  );
};

export default ScreenRecording;
