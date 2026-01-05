'use client';
import NextImage from "next/image";
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw, RotateCw } from 'lucide-react';

const LatestAudio: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>('Loading...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 🔹 Helper: format date with suffix
  const formatDate = () => {
    const today = new Date();
    const day = today.getDate();
    const year = today.getFullYear();
    const month = today.toLocaleString('en-US', { month: 'long' });

    // Add suffix
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';

    return `${month} ${day}${suffix} ${year}`;
  };

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch('/api/media/latest');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAudioUrl(data.url);

        if (data.url) {
          try {
            const url = new URL(data.url);
            const filenameWithQuery = url.pathname.split('/').pop() || '';
            const filename = filenameWithQuery.split('?')[0];
            const decodedFilename = decodeURIComponent(filename);

            const cleanTitle = decodedFilename.replace(/\.[^/.]+$/, '').replace(/\+|_/g, ' ').trim();
            setAudioTitle(cleanTitle);
          } catch (e) {
            console.error("Failed to parse URL:", e);
            setAudioTitle('Latest Audio');
          }
        }
      } catch (e: any) {
        setError(e.message);
      }
    };
    fetchAudio();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const skip15Back = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
  };

  const skip15Forward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    // If there's an error (like missing env vars), return null so the section doesn't show
    return null;
  }

  if (!audioUrl) {
    return <div className="max-w-3xl mx-auto p-6 text-gray-500">Loading audio...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-2">
      {/* Center text section */}
      <div className="text-center mb-12 sm:mb-16 mt-8">
        {/*dynamic date */}
        <p className="text-2xl sm:text-2xl  font-newyorker ">
          {formatDate()}
        </p>
        <h2 className="text-4xl sm:text-6xl md:text-5xl font-extrabold mb-2 font-coolvetica">
          Listen to The Insight
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Was it that cool?
        </p>
      </div>

      {/* Whole row */}
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Controls */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          <button
            onClick={skip15Back}
            className="relative p-1 sm:p-2 hover:scale-110 transition flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 sm:w-6 sm:h-6 text-black font-bold stroke-2" />
            <span className="absolute text-[8px] sm:text-[10px] font-bold text-black pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">15</span>
          </button>
          <button
            onClick={togglePlay}
            className="p-2 sm:p-3 hover:scale-110 transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 fill-gray-600" />
            ) : (
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 fill-gray-600 ml-1" />
            )}
          </button>
          <button
            onClick={skip15Forward}
            className="relative p-1 sm:p-2 hover:scale-110 transition flex items-center justify-center"
          >
            <RotateCw className="w-4 h-4 sm:w-6 sm:h-6 text-black font-bold stroke-2" />
            <span className="absolute text-[8px] sm:text-[10px] font-bold text-black pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">15</span>
          </button>
        </div>

        {/* Middle: Stacked Card Button */}
        <div className="flex-1 max-w-sm sm:max-w-xl relative">
          {/* Background card layers */}
          <div className="absolute inset-0 bg-gray-300 border-2 border-gray-400 transform translate-x-1 translate-y-2 rounded-sm"></div>
          <div className="absolute inset-0 bg-gray-200 border-2 border-gray-400 transform translate-x-0.5 translate-y-1 rounded-sm"></div>

          {/* Main card */}
          <button
            type="button"
            className="relative w-full bg-white border-2 border-gray-400 shadow-xl flex items-center hover:border-black transition overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl duration-200"
            style={{
              backgroundImage: `linear-gradient(to right, #9ca3af 0%, #9ca3af ${duration ? (currentTime / duration) * 100 : 0
                }%, transparent ${duration ? (currentTime / duration) * 100 : 0}%, transparent 100%)`,
              backgroundPosition: 'bottom',
              backgroundSize: '100% 4px',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Icon-like image on the left */}
            <div className="flex-shrink-0 p-1">
              <NextImage
                src="/popup.jpg"
                alt="Podcast cover"
                className="rounded-lg object-cover"
                width={52}
                height={64}
              />
            </div>

            {/* Title + metadata */}
            <div className="flex-1 p-2 sm:p-3 text-center pointer-events-none">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-black mb-1 font-stilson">
                {audioTitle}
              </h1>
              <div className="text-[10px] sm:text-xs font-light text-gray-600 uppercase tracking-wider">
                Podcast of the Week
              </div>

              {/* Time display when playing */}
              {isPlaying && (
                <div className="w-full mt-1">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 font-serif">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-16 sm:w-24 h-[3px] bg-gray-400 appearance-none cursor-pointer thin-slider"
            style={{
              background: `linear-gradient(to right, #9ca3af 0%, #9ca3af ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`,
            }}
          />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

      <style jsx>{`
        .thin-slider::-webkit-slider-thumb {
          appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 3px rgba(34, 197, 94, 0.5);
          transition: all 0.2s ease;
        }
        .thin-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .thin-slider::-moz-range-thumb {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 3px rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LatestAudio;
