import React from 'react';
import dynamic from 'next/dynamic';

const CustomAudioPlayer = dynamic(() => import('./audio-player-controls'), {
  loading: () => (
    <div className="flex items-center justify-center h-[48px] w-1/2 bg-gray-100 rounded-full">
      <div className="text-gray-500">Loading audio player...</div>
    </div>
  ),
  ssr: false
});

// Define the prop types for AudioContainer
interface AudioContainerProps {
  onSkip: () => void;  // onSkip is a function with no arguments and no return value
}

const AudioContainer: React.FC<AudioContainerProps> = ({ onSkip }) => {
  return (
    <div
      className="w-full h-full top-0 absolute z-50 flex flex-col gap-8 items-center justify-center"
      style={{ backgroundColor: 'rgba(29, 29, 29, 0.95)' }}
    >
      <p className="text-2xl font-medium text-[#FFFFFF]">Get the inside scoop on this concept (02:30)</p>
      <p className="text-[16px] font-normal text-[#FFFFFF] text-center max-w-[55%] mx-auto -mt-4">
        Looking for a deeper understanding? At 02:30, we dive into the finer details to help you connect the dots. Listen to your expert detail guide and enhance your learning journey.
      </p>
      <CustomAudioPlayer />
      <button className="text-white" onClick={onSkip}>Skip</button>
    </div>
  );
};

export default AudioContainer;
