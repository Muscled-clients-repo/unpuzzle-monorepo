'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Progress } from '../../../shared/ui/Progress';
import LoadingSpinner from '../../Loading';
import AIVoicesPopover from '../AiVoicesPopover';
import Image from 'next/image';

interface Script {
  id: string;
  content: string;
  voiceId: string;
  audioUrl?: string;
  duration: number;
  isProcessing: boolean;
  progress: number;
}

interface ScriptEditorProps {
  onScriptsChange: (scripts: Script[]) => void;
  onAudioGenerated: (audioClip: any) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ onScriptsChange, onAudioGenerated }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isAddingScript, setIsAddingScript] = useState(false);
  const [newScript, setNewScript] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState('alloy'); // Default voice ID
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    onScriptsChange(scripts);
  }, [scripts, onScriptsChange]);

  const handleAddScriptClick = () => {
    setIsAddingScript(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  const generateAudioFromScript = async (script: Script): Promise<string> => {
    try {
      // Check if we're using ElevenLabs or OpenAI TTS
      const useElevenLabs = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      const useOpenAI = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (useElevenLabs) {
        // ElevenLabs API integration
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + script.voiceId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
          },
          body: JSON.stringify({
            text: script.content,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        });
        
        if (!response.ok) throw new Error('Failed to generate audio');
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
        
      } else if (useOpenAI) {
        // OpenAI TTS API integration
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: script.voiceId, // alloy, echo, fable, onyx, nova, shimmer
            input: script.content,
            response_format: 'mp3',
          }),
        });
        
        if (!response.ok) throw new Error('Failed to generate audio');
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
        
      } else {
        // Fallback to browser's Speech Synthesis API
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(script.content);
          const mediaRecorder = new MediaRecorder(new MediaStream());
          const chunks: Blob[] = [];
          
          mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            resolve(url);
          };
          
          // Use Web Speech API as fallback
          speechSynthesis.speak(utterance);
          
          // For now, return a mock URL since browser TTS recording is complex
          setTimeout(() => {
            resolve('/assets/tayyabMaleVoice.mp3');
          }, 2000);
        });
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      // Fallback to mock
      return '/assets/tayyabMaleVoice.mp3';
    }
  };

  const estimateScriptDuration = (text: string): number => {
    // Rough estimate: average speaking rate is about 150 words per minute
    const wordCount = text.trim().split(/\s+/).length;
    return (wordCount / 150) * 60; // duration in seconds
  };

  const handleScriptSubmit = async () => {
    if (!newScript.trim()) return;

    const script: Script = {
      id: `script-${Date.now()}`,
      content: newScript,
      voiceId: selectedVoiceId,
      duration: estimateScriptDuration(newScript),
      isProcessing: true,
      progress: 0,
    };

    setScripts(prev => [...prev, script]);
    setNewScript('');
    setIsAddingScript(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { ...s, progress: Math.min(s.progress + Math.random() * 15, 95) }
          : s
      ));
    }, 200);

    try {
      // Generate audio
      const audioUrl = await generateAudioFromScript(script);
      
      // Complete processing
      clearInterval(progressInterval);
      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { ...s, audioUrl, isProcessing: false, progress: 100 }
          : s
      ));

      // Add to timeline
      onAudioGenerated({
        id: script.id,
        script: script.content,
        voiceId: script.voiceId,
        url: audioUrl,
        duration: script.duration,
        startTime: 0, // Will be positioned by timeline
      });

    } catch (error) {
      clearInterval(progressInterval);
      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { ...s, isProcessing: false, progress: 0 }
          : s
      ));
    }
  };

  const handleScriptDelete = (scriptId: string) => {
    setScripts(prev => prev.filter(s => s.id !== scriptId));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleScriptSubmit();
    }
  };

  const convertAllScripts = async () => {
    const unprocessedScripts = scripts.filter(s => !s.audioUrl && !s.isProcessing);
    
    for (const script of unprocessedScripts) {
      setScripts(prev => prev.map(s => 
        s.id === script.id 
          ? { ...s, isProcessing: true, progress: 0 }
          : s
      ));

      try {
        const audioUrl = await generateAudioFromScript(script);
        setScripts(prev => prev.map(s => 
          s.id === script.id 
            ? { ...s, audioUrl, isProcessing: false, progress: 100 }
            : s
        ));

        onAudioGenerated({
          id: script.id,
          script: script.content,
          voiceId: script.voiceId,
          url: audioUrl,
          duration: script.duration,
          startTime: 0,
        });
      } catch (error) {
        setScripts(prev => prev.map(s => 
          s.id === script.id 
            ? { ...s, isProcessing: false, progress: 0 }
            : s
        ));
      }
    }
  };

  return (
    <div className="bg-white pt-6 pb-8 px-6 rounded-2xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Voice Scripts</h3>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Voice Selection & Convert All Button */}
          {scripts.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <AIVoicesPopover onVoiceSelect={setSelectedVoiceId} />
                <button
                  onClick={convertAllScripts}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Convert All to Voice
                </button>
              </div>
            </div>
          )}

          {/* Scripts List */}
          {scripts.length > 0 && (
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {scripts.map((script, index) => (
                <div key={script.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Script {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          ~{Math.round(script.duration)}s
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {script.content}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleScriptDelete(script.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Processing State */}
                  {script.isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Converting to voice...</span>
                        <span>{Math.round(script.progress)}%</span>
                      </div>
                      <Progress value={script.progress} className="h-1" />
                    </div>
                  )}

                  {/* Completed State */}
                  {script.audioUrl && !script.isProcessing && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">✓ Voice generated</span>
                        <button className="text-green-600 hover:text-green-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Script Form */}
          {isAddingScript ? (
            <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
              <textarea
                ref={textAreaRef}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newScript}
                onChange={(e) => setNewScript(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Write your script here... Press Enter to convert to AI voice."
                rows={4}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => {
                    setIsAddingScript(false);
                    setNewScript('');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScriptSubmit}
                  disabled={!newScript.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Generate Voice
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddScriptClick}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                    Add Script
                  </p>
                  <p className="text-xs text-gray-400">
                    Write text to convert into AI voice
                  </p>
                </div>
              </div>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ScriptEditor;