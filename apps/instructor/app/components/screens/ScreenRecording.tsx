"use client";
import dynamic from "next/dynamic";

const ScreenRecordingClient = dynamic(() => import("./ScreenRecordingClient"), {
  ssr: false,
});

export default ScreenRecordingClient;
