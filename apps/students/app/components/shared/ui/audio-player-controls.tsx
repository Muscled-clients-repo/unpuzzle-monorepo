import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

import WaveSurfer from "wavesurfer.js"; // Import the Wavesurfer library directly
// import AIPlayIcon from '../assets/ai-play.svg';
// import AIPauseIcon from '../assets/ai-pause.svg';
// import AIVolume from '../assets/ai-vloume.svg';
// import MuteVolume from '../assets/mute.svg';
// import PlayIcon from '../assets/PlayIcon.svg';
// import VolumeIcon  from '../assets/VolumeIcon.svg';
// import Audio from '../assets/test4.mp3'

const formatTime = (seconds: number): string =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export default function CustomAudioPlayer() {
  // Define types for refs
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference for wave container
  const waveSurferRef = useRef<WaveSurfer | null>(null); // Reference for WaveSurfer instance

  // Define state types
  const [duration, setDuration] = useState<number>(0); // Total duration of audio
  const [currentTime, setCurrentTime] = useState<number>(0); // Current playback time
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Play/Pause state
  const [isMuted, setIsMuted] = useState<boolean>(false); // Mute/Unmute state
  const [isLoading, setIsLoading] = useState<number>(0); // Mute/Unmute state

  useEffect(() => {
    const initializeWaveSurfer = async () => {
      if (containerRef.current) {
        // Create the WaveSurfer instance
        waveSurferRef.current = WaveSurfer.create({
          container: containerRef.current, // Attach WaveSurfer to the container
          waveColor: "#55565b", // Waveform color
          progressColor: "#55565B", // Progress bar color
          barWidth: 2, // Bar width for the waveform
          height: 48, // Waveform height
          backend: "WebAudio",
        });

        waveSurferRef.current.load("/static/test.mp3"); // Load Blob URL into WaveSurfer

        // Loading progress event
        waveSurferRef.current.on("loading", (num: number) => {
          setIsLoading(num); // Update loading progress
        });

        // WaveSurfer ready event
        waveSurferRef.current.on("ready", () => {
          setDuration(waveSurferRef.current?.getDuration() ?? 0);
        });

        // Update current playback time
        waveSurferRef.current.on("audioprocess", () => {
          setCurrentTime(waveSurferRef.current?.getCurrentTime() ?? 0);
        });

        // Reset play state when audio finishes
        waveSurferRef.current.on("finish", () => {
          setIsPlaying(false);
        });
      }
    };

    initializeWaveSurfer();

    return () => {
      // Cleanup WaveSurfer instance
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, []);

  const onPlayPause = useCallback(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying); // Toggle play/pause state
    }
  }, [isPlaying]);

  const onToggleMute = useCallback(() => {
    if (waveSurferRef.current) {
      const nextMuteState = !isMuted;
      waveSurferRef.current.setMuted(nextMuteState);
      setIsMuted(nextMuteState);
    }
  }, [isMuted]);

  return (
    <div className="flex items-center h-[48px] w-1/2 gap-1 justify-between px-2 py-2 rounded-full bg-[#F2F3F5]">
      <button
        onClick={onPlayPause}
        className="bg-[#00AFF0] rounded-full w-[32px] h-[32px] flex flex-row justify-center items-center"
      >
        {/* <img src={isPlaying ? AIPauseIcon : AIPlayIcon} alt="Play/Pause" /> */}
        <Image
          src={isPlaying ? "/assets/ai-pause.svg" : "/assets/ai-play.svg"}
          alt="Play/Pause"
          width={20}
          height={20}
        />
      </button>
      <div className="w-[400px] h-[42px] z-50">
        <div ref={containerRef}></div>
      </div>
      <p className="text-[14px] font-normal text-[#55565B]">
        {isLoading}
        {currentTime
          ? `${Math.floor(currentTime / 60)}:${(
              "0" + Math.floor(currentTime % 60)
            ).slice(-2)}`
          : "0:00"}{" "}
        / {formatTime(duration)}
      </p>
      <button onClick={onToggleMute}>
        {/* <img src={isMuted ? MuteVolume : VolumeIcon} alt="Mute/Unmute" /> */}
        <Image
          src={isMuted ? "/assets/mute.svg" : "/assets/VolumeIcon.svg"}
          alt="Mute/Unmute"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
