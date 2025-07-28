'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useRecording } from '../../../../context/RecordingContext';

interface RecordingPanelProps {
  onRecordingComplete: (videoBlob: Blob, duration: number) => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
}

const RecordingPanel: React.FC<RecordingPanelProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}) => {
  const { getToken } = useAuth();
  const { isRecording, setIsRecording, setRecordingStartTime } = useRecording();
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused' | 'processing'>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamPosition, setWebcamPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [recordingOptions, setRecordingOptions] = useState({
    screenAudio: true,
    micAudio: true,
    webcam: false,
    quality: '1080p',
    frameRate: 30,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef<boolean>(false);
  const recordingStartTimeRef = useRef<number>(0);
  const m1Url = process.env.NEXT_PUBLIC_M1_SERVER_URL;

  const startTimer = () => {
    const startTime = Date.now();
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // More accurate duration in seconds
      setRecordingTime(Math.floor(elapsed));
    }, 100); // Update more frequently for better accuracy
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  let uploadId: string | null = null;
  let chunkIndex = 0

  // get upload url
  const getUploadId = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${m1Url}/api/video/upload`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        uploadId = data.data.fileId;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Stream upload
  const uploadVideoChunk = async () => {
    console.log("isRecording (ref):", isRecordingRef.current);
    console.log("isRecording (state):", isRecording);
    
    if (!m1Url) {
      console.error("M1 server URL not configured");
      return;
    }
    
    if(!isRecordingRef.current){
      // Concatenate all remaining chunks into one final chunk
      const totalLength=recordedChunksRef.current.length - 1
      if(chunkIndex<totalLength){
        const remainingChunk = recordedChunksRef.current.slice(chunkIndex, totalLength)
        const combinedBlob = new Blob(remainingChunk, {
          type: "video/webm"
        });
        recordedChunksRef.current = [combinedBlob];
      }
    }

    const chunk = recordedChunksRef.current[chunkIndex];
    if(!chunk){
      if(isRecordingRef.current){
        setTimeout(uploadVideoChunk, 1000);
      }
      return;
    }


    try {
      console.log("uploadId is: ", uploadId);
      if (!uploadId) {
        await getUploadId();
        return uploadVideoChunk()
      }
      const formData = new FormData();

      formData.append("file", chunk, `chunk_${uploadId}.webm`);
      formData.append("fileId", uploadId);
      

      formData.append("status", isRecordingRef.current ? "uploading" : "completed");

      const token = await getToken();
      const response = await fetch(`${m1Url}/api/video/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`Chunk ${uploadId} uploaded successfully:`, result);
      // recordedChunksRef.current.shift()


      if (!isRecordingRef.current) {

        uploadId=null
        return;
      }
      setTimeout(uploadVideoChunk, 1000);
    } catch (error) {
      console.error(`Error uploading chunk ${uploadId}:`, error);
    }
  };


  const startRecording = async () => {
    try {
      // Request screen + audio
      const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: {
          width: { ideal: recordingOptions.quality === '4K' ? 3840 : recordingOptions.quality === '1080p' ? 1920 : 1280 },
          height: { ideal: recordingOptions.quality === '4K' ? 2160 : recordingOptions.quality === '1080p' ? 1080 : 720 },
          frameRate: { ideal: recordingOptions.frameRate }
        },
        audio: recordingOptions.screenAudio
      });

      // Request microphone if enabled
      let micStream: MediaStream | null = null;
      if (recordingOptions.micAudio) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          console.warn('Microphone access denied');
        }
      }

      // Request webcam if enabled
      let webcamStream: MediaStream | null = null;
      if (recordingOptions.webcam) {
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              width: { ideal: 320 },
              height: { ideal: 240 }
            }
          });
          webcamStreamRef.current = webcamStream;
          setShowWebcam(true);
        } catch (err) {
          console.warn('Webcam access denied');
        }
      }

      // Combine streams
      const tracks = [
        ...screenStream.getVideoTracks(),
      ];

      if (recordingOptions.screenAudio) {
        tracks.push(...screenStream.getAudioTracks());
      }

      if (micStream && recordingOptions.micAudio) {
        tracks.push(...micStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp8,opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        setStatus('processing');
        setIsRecording(false);
        isRecordingRef.current = false; // Update ref immediately
        setRecordingStartTime(null);
        
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });

        // Upload to server and add to timeline
        // await uploadRecording(videoBlob);
        
        // Calculate precise duration using start time
        const endTime = Date.now();
        const preciseDuration = (endTime - recordingStartTimeRef.current) / 1000;
        console.log('Recording duration - Timer:', recordingTime, 'Precise:', preciseDuration);
        
        onRecordingComplete(videoBlob, preciseDuration);
        setStatus('idle');
        setRecordingTime(0);
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Handle screen share ending
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (mediaRecorder.state !== 'inactive') {
          stopRecording();
        }
      });

      // Start recording
      mediaRecorder.start(1000); // 1 second chunks
      setStatus('recording');
      setIsRecording(true);
      isRecordingRef.current = true; // Update ref immediately
      recordingStartTimeRef.current = Date.now(); // Store start time
      setRecordingStartTime(new Date());
      startTimer();
      onRecordingStart();
      
      // Start upload immediately since ref is updated
      uploadVideoChunk();

    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      onRecordingStop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
      startTimer();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Screen Recording</h3>
        
        {status === 'recording' && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-red-600">
              REC {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {status === 'idle' && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <span>Start Recording</span>
          </button>
        )}

        {status === 'recording' && (
          <>
            <button
              onClick={pauseRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-white rounded"></div>
                <div className="w-1 h-4 bg-white rounded"></div>
              </div>
              <span>Pause</span>
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <div className="w-4 h-4 bg-white rounded"></div>
              <span>Stop</span>
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={resumeRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent"></div>
              <span>Resume</span>
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <div className="w-4 h-4 bg-white rounded"></div>
              <span>Stop</span>
            </button>
          </>
        )}

        {status === 'processing' && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Recording Options */}
      {status === 'idle' && (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recording Options</h4>
            
            {/* Audio Options */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordingOptions.screenAudio}
                  onChange={(e) => setRecordingOptions(prev => ({ ...prev, screenAudio: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <span>System Audio</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordingOptions.micAudio}
                  onChange={(e) => setRecordingOptions(prev => ({ ...prev, micAudio: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                  <span>Microphone</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordingOptions.webcam}
                  onChange={(e) => setRecordingOptions(prev => ({ ...prev, webcam: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                  <span>Webcam (Picture-in-Picture)</span>
                </span>
              </label>
            </div>
            
            {/* Quality Settings */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Quality</label>
                <select
                  value={recordingOptions.quality}
                  onChange={(e) => setRecordingOptions(prev => ({ ...prev, quality: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="720p">HD (720p)</option>
                  <option value="1080p">Full HD (1080p)</option>
                  <option value="4K">4K</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Frame Rate</label>
                <select
                  value={recordingOptions.frameRate}
                  onChange={(e) => setRecordingOptions(prev => ({ ...prev, frameRate: parseInt(e.target.value) }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">15 fps</option>
                  <option value="30">30 fps</option>
                  <option value="60">60 fps</option>
                </select>
              </div>
            </div>
            
            {/* Webcam Position (only show if webcam is enabled) */}
            {recordingOptions.webcam && (
              <div className="mt-3">
                <label className="text-xs text-gray-600 block mb-1">Webcam Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const).map((position) => (
                    <button
                      key={position}
                      onClick={() => setWebcamPosition(position)}
                      className={`px-3 py-1 text-xs rounded ${
                        webcamPosition === position
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              🛡️ Recording Protection
            </h4>
            <p className="text-xs text-blue-700">
              Once recording starts, this tab will be protected from accidental refresh or navigation to prevent data loss.
            </p>
          </div>
        </div>
      )}

      {/* Active Recording Safety Info */}
      {(status === 'recording' || status === 'paused') && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <span>Recording Protection Active</span>
          </h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• Browser refresh and navigation are blocked</p>
            <p>• You can minimize or switch tabs safely</p>
            <p>• Use Ctrl+Shift+R to check recording status</p>
            <p>• Stop recording before closing this tab</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingPanel;