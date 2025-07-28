import BaseButton from "@/app/components/shared/base-button";
import Image from "next/image";
import { useState, useEffect, MutableRefObject } from "react";
import { usePuzzlePath } from "@/app/hooks/usePuzzlePath";
const PuzzlePath= ({video,currentTimeSec}:{video:any,currentTimeSec:MutableRefObject<number>}) => {
  const { getPath } = usePuzzlePath();
  const [step, setStep] = useState<'intro' | 'progress' | 'result' | 'hidden'>('intro');
  const [progress, setProgress] = useState(0);
  const recommendedVideo = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  // Animate progress bar
  useEffect(() => {
    if (step === 'progress' && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
    if (step === 'progress' && progress >= 100) {
      const timeout = setTimeout(() => setStep('result'), 500);
      return () => clearTimeout(timeout);
    }
  }, [step, progress]);

  // Call getPath when moving to progress step
  const handleGetCustomPath = async () => {
    setStep('progress');
    setProgress(0);
    await getPath({ video, duration: currentTimeSec.current });
    // Optionally, you can handle the result here if you want to display it in 'result' step
  };

  // UI for Step 1: Intro Card
  if (step === 'intro') {
    return (
      <div className="w-full  mx-auto bg-white rounded-xl flex flex-col gap-3">
        
        <div className="flex items-center gap-2 text-sm text-[#1D1D1D] mb-2">
          <span className="text-lg">🤖</span> Need help with this topic?
        </div>
        <BaseButton variant="solid" onClick={handleGetCustomPath}>
          Get Custom Path
        </BaseButton>
        <BaseButton onClick={() => setStep('hidden')}>
          No Thanks
        </BaseButton>
      </div>
    );
  }

  // UI for Step 2: Progress
  if (step === 'progress') {
    return (
      <div className="w-full mx-auto bg-white   flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Image src="/assets/robot.svg" alt="Updating Your Learning Path" width={80} height={80} />
          <div className="font-semibold text-lg mt-2 mb-1">Updating Your Learning Path</div>
        </div>
        <div className="w-full bg-[#F0F0F0] rounded-full h-2 mt-2">
          <div
            className="bg-[#1CABF2] h-1 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // UI for Step 3: Result (Recommended Video)
  if (step === 'result') {
    return (
      <div className="w-full  flex flex-col gap-4">
        <div className="font-semibold text-lg text-start">Recommended Video</div>
        <div className="w-full aspect-video rounded overflow-hidden border">
          <iframe
            src={recommendedVideo}
            title="Recommended Video"
            width="100%"
            height="100%"
            allow="autoplay; fullscreen"
            className="rounded"
          ></iframe>
        </div>
      </div>
    );
  }

  // Hide everything if step is 'hidden'
  if (step === 'hidden') {
    return null;
  }

  return null;
};

export default PuzzlePath; 