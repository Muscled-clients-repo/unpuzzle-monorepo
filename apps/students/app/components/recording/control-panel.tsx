"use client";
import dynamic from "next/dynamic";

const ScreenRecordingClient = dynamic(() => import("./client-panel"), {
  ssr: false,
});

export default ScreenRecordingClient;
