import React, { useState, MutableRefObject } from "react";
import Image from "next/image";
import SharedButton from "../../shared/SharedButton";
import { usePuzzleHint } from "@/app/hooks/usePuzzleHint";
import { toast } from "react-toastify";
import LoadingSpinner from "../Loading";
// constant values
const puzzleHint = [
  {
    question:
      "And now independent of the size of the parent frame we want this object to always stick to the right and bottom edge",
    topic: "Aligning Objects to the Bottom Right Corner in Figma",
    prompt:
      "Follow these steps to ensure the object always aligns to the right and bottom edge, regardless of the parent frame size:",
    completion: [
      {
        step_number: 1,
        instruction: "Select the object you want to align on the Figma canvas.",
      },
      {
        step_number: 2,
        instruction:
          "Go to the 'Design' tab on the right side of the interface.",
      },
      {
        step_number: 3,
        instruction:
          "Under 'Constraints', select 'Right' for horizontal constraint and 'Bottom' for vertical constraint.",
      },
      {
        step_number: 4,
        instruction:
          "Ensure that 'Auto Layout' is turned on to make the object responsive to the size changes of the parent frame.",
      },
      {
        step_number: 5,
        instruction:
          "Test the object's alignment by adjusting the size of the parent frame.",
      },
    ],
  },
];

const PuzzleHint= ({videoId, currentTimeSec}:{videoId:string, currentTimeSec:MutableRefObject<number>}) => {

  // 0 = default, 1 = show hint, 2 = still confused
  const [caseState, setCaseState] = useState<0 | 1 | 2 | number>(0);
  const [hint, setHint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { getHint } = usePuzzleHint(null);

  // Validation function for handleShowHint
  const isValidHintRequest = () => {
    if (!videoId || typeof videoId !== 'string' || videoId.trim() === '') {
      toast.error('Video ID is missing.');
      return false;
    }
    if (typeof currentTimeSec.current !== 'number' || currentTimeSec.current <= 0) {
      toast.error('Current time must be greater than 0.');
      return false;
    }
    return true;
  };

  // Simulate API call for hint
  const handleShowHint =async () => {
    if (!isValidHintRequest()) return;
    try {
      setLoading(true);
      console.log("videoId, currentTimeSec: ",videoId, currentTimeSec.current)
      await getHint({ id: videoId, duration: currentTimeSec.current }).then((data)=>{
        if(!data) throw new Error("No data found");
        setHint(data);
        setCaseState(1);
      }).catch((error)=>{
        toast.error("hint Generation Failed!");
        console.log(error)
      })
    } catch (error) {
      console.log("erro is: ",error)    
    }
    finally{        
      setLoading(false);
    }
  };

  // Simulate API call for still confused
  const handleStillConfused = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCaseState(2);
    }, 1200);
  };

  // Hide everything if No Thanks was clicked
  if (caseState === -1) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      {caseState === 0 && (
        <>
          <div className="flex flex-row w-full gap-2 mb-4 items-center">
            <Image
              src="/assets/robot.svg"
              alt="Brainstorming"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <p className="text-sm text-gray-500 card-hint-title">
              Need a hint to keep going?
            </p>
          </div>
          <div className="flex flex-col w-full gap-2 mt-4 card-hint-buttons">
            <SharedButton onClick={() => setCaseState(-1)}>
              No Thanks
            </SharedButton>
            <SharedButton variant="solid" onClick={handleShowHint}>
              Show Hint
            </SharedButton>
          </div>
        </>
      )}

      {caseState === 1 && hint && (
        <>
          <div className="mb-2 font-semibold">{hint.topic}</div>
          <div className="mb-2 text-sm text-gray-700">{hint.prompt}</div>
          <ul className="mb-4 list-decimal list-inside space-y-1">
            {hint.completion.map((step: any) => (
              <li key={step.step_number} className="text-sm text-gray-800">
                {step.instruction}
              </li>
            ))}
          </ul>
          <div className="flex flex-col w-full gap-2 mt-4 card-hint-buttons">
            <SharedButton onClick={() => setCaseState(-1)}>
              No Thanks
            </SharedButton>
            <SharedButton variant="solid" onClick={handleStillConfused}>
              Still Confused?
            </SharedButton>
          </div>
        </>
      )}

      {caseState === 2 &&
        (loading ? (
          <div className="flex flex-col items-center">
            <div className="loader mb-2" />
            <span className="text-sm text-gray-500">Loading more help...</span>
          </div>
        ) : (
          <>
            {/* <div className="mb-2 font-semibold">Need more help?</div> */}
            {/* <div className="mb-4 text-sm text-gray-700">
              You can go back to the video at the relevant timestamp for a
              recap.
            </div> */}
            <div className="flex flex-col w-full gap-2 mt-4 card-hint-buttons">
              <SharedButton
                variant="solid"
                onClick={() => {
                  // Here you can implement logic to jump to a video timestamp
                  alert("Jumping to video at 01:23");
                }}
              >
                Back to Video at 01:23
              </SharedButton>
            </div>
          </>
        ))}
    </>
  );
};

export default PuzzleHint;
