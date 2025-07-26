'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import WaveSurfer from 'wavesurfer.js';

interface AIVoiceClip {
  id: string;
  script: string;
  voiceId: string;
  url: string;
  duration: number;
  startTime: number;
}

interface AIVoiceTrackProps {
  clips: AIVoiceClip[];
  totalDuration: number;
  scale: number;
  onClipsChange: (clips: AIVoiceClip[]) => void;
}

const AIVoiceTrack: React.FC<AIVoiceTrackProps> = ({
  clips,
  totalDuration,
  scale,
  onClipsChange,
}) => {
  const waveformsRef = useRef<(WaveSurfer | null)[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScript, setNewScript] = useState('');

  const getClipWidth = (clip: AIVoiceClip) => {
    return Math.max(clip.duration * 100 * scale, 50);
  };

  const getClipPosition = (clip: AIVoiceClip) => {
    return clip.startTime * 100 * scale;
  };

  // Initialize waveforms for each clip
  useEffect(() => {
    clips.forEach((clip, index) => {
      if (!waveformsRef.current[index] && clip.url) {
        const container = document.getElementById(`ai-waveform-${index}`);
        if (container) {
          const wavesurfer = WaveSurfer.create({
            container: `#ai-waveform-${index}`,
            waveColor: '#F87171',
            progressColor: '#EF4444',
            height: 32,
            normalize: true,
            backend: 'WebAudio',
          });

          wavesurfer.load(clip.url);
          waveformsRef.current[index] = wavesurfer;
        }
      }
    });

    // Cleanup
    return () => {
      waveformsRef.current.forEach((waveform, idx) => {
        if (waveform && idx >= clips.length) {
          waveform.destroy();
          waveformsRef.current[idx] = null;
        }
      });
    };
  }, [clips]);

  const handleAddScript = () => {
    if (!newScript.trim()) return;

    // Generate AI voice (mock implementation)
    const newClip: AIVoiceClip = {
      id: `ai-voice-${Date.now()}`,
      script: newScript,
      voiceId: 'default',
      url: '/assets/tayyabMaleVoice.mp3', // Mock URL
      duration: newScript.length * 0.1, // Rough estimate
      startTime: totalDuration,
    };

    onClipsChange([...clips, newClip]);
    setNewScript('');
    setShowAddForm(false);
  };

  const handleClipDelete = (index: number) => {
    if (waveformsRef.current[index]) {
      waveformsRef.current[index]?.destroy();
      waveformsRef.current[index] = null;
    }
    
    const newClips = clips.filter((_, i) => i !== index);
    onClipsChange(newClips);
  };

  const handleClipMove = (index: number, newStartTime: number) => {
    const newClips = [...clips];
    newClips[index] = {
      ...newClips[index],
      startTime: Math.max(0, newStartTime),
    };
    onClipsChange(newClips);
  };

  return (
    <div className="relative">
      {/* Track Header */}
      <div className="flex items-center mb-2">
        <div className="flex items-center space-x-2 w-24">
          <Image src="/assets/ai.svg" width={20} height={20} alt="AI Voice" />
          <span className="text-white text-sm">AI Voice</span>
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
            className="text-green-400 hover:text-green-300 transition-colors"
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
            className="absolute top-1 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded cursor-move group"
            style={{
              left: `${getClipPosition(clip)}px`,
              width: `${getClipWidth(clip)}px`,
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString());
            }}
          >
            {/* Waveform container */}
            <div
              id={`ai-waveform-${index}`}
              className="w-full h-full rounded"
            />
            
            {/* Script preview on hover */}
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-xs">
              {clip.script}
            </div>
            
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClipDelete(index);
              }}
              className="absolute top-1 right-1 text-white hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}

        {/* Add script form */}
        {showAddForm && (
          <div className="absolute inset-0 bg-gray-800 rounded p-2 z-20">
            <div className="flex flex-col space-y-2">
              <textarea
                value={newScript}
                onChange={(e) => setNewScript(e.target.value)}
                placeholder="Enter script for AI voice..."
                className="w-full p-2 text-sm bg-gray-700 text-white rounded resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddScript}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Generate Voice
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewScript('');
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drop zone indicator when empty */}
        {clips.length === 0 && !showAddForm && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Click + to add AI voice clips
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVoiceTrack;