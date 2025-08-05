"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize2, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PuzzleReflectFile } from "@/app/redux/services/puzzleAgents.services";

interface LoomPlayerProps {
  loomLink: string;
  title?: string;
}

export const LoomPlayer: React.FC<LoomPlayerProps> = ({ loomLink, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract Loom video ID from URL
  const extractLoomId = (url: string) => {
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };
  
  const loomId = extractLoomId(loomLink);
  
  if (!loomId) {
    return (
      <div className="w-full p-8 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
        <p className="text-red-600 dark:text-red-400">Invalid Loom URL</p>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-lg overflow-hidden shadow-lg bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <div className="relative aspect-video">
        <iframe
          src={`https://www.loom.com/embed/${loomId}?hideEmbedTopBar=true`}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          title={title || "Loom Video"}
        />
      </div>
    </div>
  );
};

interface ImageGalleryProps {
  images: PuzzleReflectFile[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openImage(index)}
          >
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.original_file_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm truncate">{image.original_file_name}</p>
              <p className="text-white/70 text-xs">{(parseInt(image.file_size) / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeModal}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                disabled={selectedImageIndex === 0}
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={selectedImageIndex === images.length - 1}
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}
          
          <div className="max-w-[90vw] max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].original_file_name}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
              <p className="text-sm">{images[selectedImageIndex].original_file_name}</p>
              {images.length > 1 && (
                <p className="text-xs mt-1">{selectedImageIndex + 1} / {images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface AudioPlayerProps {
  audioFiles: PuzzleReflectFile[];
}

export const ModernAudioPlayer: React.FC<AudioPlayerProps> = ({ audioFiles }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  
  const currentTrack = audioFiles[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [currentTrackIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % audioFiles.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
    setIsPlaying(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = volumeBarRef.current;
    if (!volumeBar) return;

    const clickX = e.nativeEvent.offsetX;
    const width = volumeBar.offsetWidth;
    const newVolume = clickX / width;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-white text-lg font-semibold truncate">
          {currentTrack.original_file_name}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {(parseInt(currentTrack.file_size) / 1024).toFixed(1)} KB
        </p>
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleNext}
      />
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          ref={progressBarRef}
          className="relative h-2 bg-gray-700 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {audioFiles.length > 1 && (
          <button
            onClick={handlePrevious}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        
        <button
          onClick={togglePlayPause}
          className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        {audioFiles.length > 1 && (
          <button
            onClick={handleNext}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
      
      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div 
          ref={volumeBarRef}
          className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer"
          onClick={handleVolumeClick}
        >
          <div 
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
        </div>
        <a
          href={currentTrack.url}
          download={currentTrack.original_file_name}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
      
      {audioFiles.length > 1 && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Track {currentTrackIndex + 1} of {audioFiles.length}
        </div>
      )}
    </div>
  );
};