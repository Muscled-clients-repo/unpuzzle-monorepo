import { useEffect, useState, useRef } from "react";
import ReactVideoEditingTimeline, { ReactVideoEditingTimelineProps } from "video-editing-timeline-react";

const TimelineComponent = ReactVideoEditingTimeline as any;

class ScaleUpdate{
  scale: number;
  totalLength: number;
  base: number;
  minZoom: number;

  constructor(scale:number, totalLength:number){
    this.base=10
    this.scale = scale
    this.totalLength = totalLength
    this.minZoom = 0.1
  }

  scaleValue(){
    return  this.scale
  }

  widthvalue(){
    const value = (this.totalLength * this.base) / this.scale;

    return value.toFixed(1)
  }
  
}


export default function TimelineBar({scale=0.1, totalLength=40, cb }:{scale:number, totalLength:number, cb:any}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const calculate = new ScaleUpdate(scale, totalLength)

  const config = {
    canvasWidth: calculate.widthvalue(),
    canvasHeight: 25,
    minimumScale: 10,
    minimumScaleTime: calculate.scaleValue(),
    el: null as unknown as HTMLCanvasElement,
    lineColor: "#1D1D1D",
    longLineColor: "#1D1D1D",
  };


  return (
    <div
      className=" overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 mt-2 ml-12 scrollbar-hide"
      ref={containerRef}
    >
      <TimelineComponent config={config} />
    </div>
  );
}
