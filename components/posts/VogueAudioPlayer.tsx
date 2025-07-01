'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Pause, Play, Volume2, VolumeX, Rewind, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VogueAudioPlayerProps {
  audioUrl: string;
  title?: string;
  authorName?: string;
  className?: string;
}

export function VogueAudioPlayer({ audioUrl, title, authorName, className }: VogueAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  // Handle volume change
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
  };

  // Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn(
      "bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800",
      "p-6 md:p-8 shadow-lg max-w-2xl mx-auto my-8",
      "font-miller transition-all duration-300",
      className
    )}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header with title and author */}
      <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="font-stilson text-xl md:text-2xl mb-2 tracking-tight">{title}</h3>
            )}
            {authorName && (
              <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <User size={16} className="mr-2" />
                <span className="font-acaslon italic">{authorName}</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
            <Volume2 size={20} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Player controls */}
      <div className="flex flex-col space-y-5">
        {/* Progress bar */}
        <div 
          ref={progressBarRef}
          className="h-1.5 bg-neutral-200 dark:bg-neutral-800 relative cursor-pointer group"
          onClick={handleProgressChange}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-150"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <div 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-600 transition-opacity",
              "opacity-0 group-hover:opacity-100",
              isHoveringProgress ? "opacity-100" : ""
            )}
            style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Controls and time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => skipTime(-10)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-600 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors shadow-md"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <button 
              onClick={() => skipTime(10)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-600 transition-colors"
              aria-label="Forward 10 seconds"
            >
              <FastForward size={20} />
            </button>
          </div>
          
          <div className="text-sm font-medium tracking-wide">
            {formatTime(currentTime)} <span className="text-neutral-400">/</span> {formatTime(duration)}
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={toggleMute}
            className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-600 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-red-600 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}