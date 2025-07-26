import * as React from "react";
const { useState, useCallback, useRef } = React;
import { useWavesurfer } from "@wavesurfer/react";

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export default function WaveSurfaceAudio() {
  const containerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    barGap: 1,
    waveColor: "rgba(128    , 128, 128)",
    progressColor: "rgb(255, 255, 255)",
    cursorWidth: 0,
    url: "/assets/tayyabMaleVoice.mp3",
  });

  React.useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
      });
    }
  }, [wavesurfer]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const onToggleMute = useCallback(() => {
    console.log("Toggle Mute Clicked");
    if (wavesurfer) {
      const nextMuteState = !isMuted;
      wavesurfer.setVolume(nextMuteState ? 0 : 1); // Set volume to 0 when muted, 1 when unmuted
      setIsMuted(nextMuteState);
    } else {
      console.log("Wavesurfer not initialized");
    }
  }, [wavesurfer, isMuted]);

  return (
    <>
      <div className=" flex items-center gap-1 justify-between px-4 py-2 rounded-full bg-[#F9993A]">
        <button onClick={onPlayPause}>
          <img
            src={isPlaying ? "/assets/ai-pause.svg" : "/assets/ai-play.svg"}
            alt="Play/Pause"
            className=""
          />
        </button>
        <div className="w-[110px] ">
          <div ref={containerRef} />
        </div>
        <p className=" text-white text-[8px] font-normal">
          {" "}
          {currentTime
            ? `${Math.floor(currentTime / 60)}:${(
                "0" + Math.floor(currentTime % 60)
              ).slice(-2)}`
            : "0:00"}{" "}
          / {formatTime(duration)}
        </p>
        <button onClick={onToggleMute}>
          <img
            src={isMuted ? "/assets/mute.svg" : "/assets/ai-vloume.svg"}
            alt="Mute/Unmute"
            width={20}
            height={20}
          />
        </button>
      </div>
    </>
  );
}
