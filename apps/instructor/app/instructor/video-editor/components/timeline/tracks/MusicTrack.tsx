'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface MusicClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  volume: number;
}

interface MusicTrackProps {
  clips: MusicClip[];
  totalDuration: number;
  scale: number;
  onClipsChange: (clips: MusicClip[]) => void;
}

const MusicTrack: React.FC<MusicTrackProps> = ({
  clips,
  totalDuration,
  scale,
  onClipsChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const getClipWidth = (clip: MusicClip) => {
    return Math.max(clip.duration * 100 * scale, 50);
  };

  const getClipPosition = (clip: MusicClip) => {
    return clip.startTime * 100 * scale;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      
      audio.onloadedmetadata = () => {
        const newClip: MusicClip = {
          id: `music-${Date.now()}-${Math.random()}`,
          name: file.name,
          url,
          duration: audio.duration,
          startTime: totalDuration,
          volume: 0.5, // Default to 50% volume for background music
        };
        
        onClipsChange([...clips, newClip]);
      };
    });
    
    setShowAddForm(false);
    e.target.value = '';
  };

  const handleClipDelete = (index: number) => {
    const clip = clips[index];
    URL.revokeObjectURL(clip.url); // Clean up object URL
    
    const newClips = clips.filter((_, i) => i !== index);
    onClipsChange(newClips);
  };

  const handleVolumeChange = (index: number, volume: number) => {
    const newClips = [...clips];
    newClips[index] = { ...newClips[index], volume };
    onClipsChange(newClips);
  };

  return (
    <div className="relative">
      {/* Track Header */}
      <div className="flex items-center mb-2">
        <div className="flex items-center space-x-2 w-24">
          <Image src="/assets/music.svg" width={20} height={20} alt="Music" />
          <span className="text-white text-sm">Music</span>
        </div>
        
        {/* Track Controls */}
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3z"/>
            </svg>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Track Lane */}
      <div className="relative h-12 bg-gray-700 rounded">
        {clips.map((clip, index) => (
          <div
            key={clip.id}
            className="absolute top-1 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded cursor-move group"
            style={{
              left: `${getClipPosition(clip)}px`,
              width: `${getClipWidth(clip)}px`,
            }}
            draggable
          >
            {/* Clip content */}
            <div className="p-1 h-full flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="text-white text-xs font-medium truncate max-w-20">
                  {clip.name}
                </span>
              </div>

              {/* Volume control (appears on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={clip.volume}
                  onChange={(e) => handleVolumeChange(index, parseFloat(e.target.value))}
                  className="w-12 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipDelete(index);
                  }}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Volume indicator */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-b"
                 style={{ width: `${clip.volume * 100}%` }}></div>
          </div>
        ))}

        {/* Add music form */}
        {showAddForm && (
          <div className="absolute inset-0 bg-gray-800 rounded p-2 z-20">
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Choose Music Files
              </label>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Drop zone indicator when empty */}
        {clips.length === 0 && !showAddForm && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Click + to add background music
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicTrack;