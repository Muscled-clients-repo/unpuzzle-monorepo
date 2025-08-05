import * as React from "react";
const { useState, useCallback, useRef } = React;
import { useWavesurfer } from "@wavesurfer/react";
import testAudio1 from "../../assets/tayyabMaleVoice.mp3";
import AIPlayIcon from "../../assets/ai-play.svg";
import AIPauseIcon from "../../assets/ai-pause.svg";
import AIVolume from "../../assets/ai-vloume.svg";
import MuteVolume from "../../assets/mute.svg";

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
    url: testAudio1,
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
      <div className=" flex items-center gap-1 justify-between px-4 py-2 rounded-full bg-gradient-to-r from-[#9E8AFF] to-[#00AFF0]">
        <button onClick={onPlayPause}>
          <img
            src={isPlaying ? AIPauseIcon : AIPlayIcon}
            alt="Play/Pause"
            className=""
            width={20}
            height={20}
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
            src={isMuted ? MuteVolume : AIVolume}
            alt="Mute/Unmute"
            width={20}
            height={20}
          />
        </button>
      </div>
    </>
  );
}
