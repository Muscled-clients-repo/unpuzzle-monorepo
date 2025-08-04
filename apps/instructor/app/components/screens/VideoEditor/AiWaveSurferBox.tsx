import * as React from "react";
const { useCallback, useRef } = React;
import { useWavesurfer } from "@wavesurfer/react";
import { AudioUrlProp } from "../../../types/videoeditor.types";
import Image from "next/image";

export default function AiWaveSurferBox({ audioUrl }: AudioUrlProp) {
  const containerRef = useRef<HTMLDivElement | any>(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 30,
    barGap: 1,
    waveColor: "rgba(128 , 128, 128)",
    progressColor: "rgb(255, 255, 255)",
    cursorWidth: 0,
    url: audioUrl,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div className="p-[10px] w-full bg-[rgba(0,175,240,0.80)]  rounded-[16px] flex items-center gap-3 justify-between">
        <button onClick={onPlayPause}>
          <Image
            src={isPlaying ? "/assets/ai-pause.svg" : "/assets/ai-play.svg"}
            alt="Play/Pause"
            className=""
            width={20}
            heigh={20}
          />
        </button>
        <div className="w-full">
          <div ref={containerRef} />
        </div>
        <p className=" text-white font-semibold">
          {" "}
          <span className="h-2 w-2 rounded-full bg-white"></span>{" "}
          {currentTime
            ? `${Math.floor(currentTime / 60)}:${(
                "0" + Math.floor(currentTime % 60)
              ).slice(-2)}`
            : "0:00"}
        </p>
      </div>
    </>
  );
}
