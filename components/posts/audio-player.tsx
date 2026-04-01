"use client";

import { Play, Pause, RotateCcw, RotateCw, Menu, Undo, Redo } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export function AudioPlayer({ src, title }: { src: string; title?: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Generate a deterministic realistic-looking waveform SVG path
    const waveformPath = useMemo(() => {
        let topPoints = [];
        let bottomPoints = [];
        for (let i = 0; i <= 200; i++) {
            const x = i;
            // complex waves to look like human voice/audio envelope
            const envelope = Math.sin(i * 0.05) * 0.6 + 0.4;
            const noise = Math.sin(i * 1.3) * Math.cos(i * 0.8) * Math.sin(i * 2.1);
            const amplitude = Math.abs(noise * envelope) * 40 + 2; 
            topPoints.push(`${x},${50 - amplitude}`);
            bottomPoints.unshift(`${x},${50 + amplitude}`);
        }
        return `M 0,50 L ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
             setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);

        // Try to fetch duration early if readyState allows
        if (audio.readyState >= 1) {
            setDuration(audio.duration);
        }

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const handleSkip = (seconds: number) => {
        if (audioRef.current) {
            const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === Infinity) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full my-8 flex flex-col gap-2 font-sans">
            {title && (
                <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 hidden lg:block">
                    {title}
                </div>
            )}
            
            <div className="w-full bg-white border border-gray-200 rounded-sm p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-3 md:gap-4 flex-nowrap">
                <audio ref={audioRef} src={src} preload="metadata" />

                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    className="w-9 h-9 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] flex items-center justify-center bg-[#1a1a1a] text-white rounded-full hover:bg-black transition-transform active:scale-95 shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-[22px] sm:h-[22px]" fill="currentColor" /> : <Play className="w-4 h-4 sm:w-[22px] sm:h-[22px] ml-0.5" fill="currentColor" />}
                </button>

                {/* Waveform Section */}
                <div className="flex-1 bg-[#eeeeee] min-w-[70px] sm:min-w-[200px] rounded-sm h-9 sm:h-12 relative overflow-hidden group">
                    <svg className="absolute inset-0 w-full h-full text-[#d4d4d4]" preserveAspectRatio="none" viewBox="0 0 200 100">
                        <path d={waveformPath} fill="currentColor" />
                    </svg>
                    
                    {/* Played progress overlay */}
                    <div 
                        className="absolute top-0 left-0 h-full bg-black/10 transition-all duration-75 pointer-events-none"
                        style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                    />

                    {/* Time Labels */}
                    <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 px-1 py-0.5 sm:px-1.5 bg-[#fef08a] text-black text-[8px] sm:text-[11px] font-mono font-bold rounded-sm z-20 pointer-events-none shadow-sm">
                        {formatTime(progress)}
                    </div>
                    <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 sm:px-1.5 bg-white text-black text-[8px] sm:text-[11px] font-mono font-bold rounded-sm z-20 shadow-sm pointer-events-none">
                        {formatTime(duration)}
                    </div>

                    {/* Range slider for seeking */}
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                    />
                </div>

                {/* Skip Controls & Menu */}
                <div className="flex items-center justify-between w-auto gap-0.5 sm:gap-2 md:gap-4 shrink-0 px-0 sm:px-1">
                    <div className="flex items-center gap-0 sm:gap-1 text-[#1a1a1a]">
                        <button 
                            onClick={() => handleSkip(-15)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex flex-col items-center justify-center hover:bg-gray-100 rounded-md transition"
                            aria-label="Skip back 15s"
                        >
                            <Undo strokeWidth={2} className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] mb-[1px]" />
                            <span className="text-[7.5px] sm:text-[9px] font-black leading-none tracking-tighter">15</span>
                        </button>
                        <button 
                            onClick={() => handleSkip(15)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex flex-col items-center justify-center hover:bg-gray-100 rounded-md transition"
                            aria-label="Skip forward 15s"
                        >
                            <Redo strokeWidth={2} className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] mb-[1px]" />
                            <span className="text-[7.5px] sm:text-[9px] font-black leading-none tracking-tighter">15</span>
                        </button>
                    </div>

                    <button 
                        className="w-8 h-8 sm:w-10 sm:h-10 border border-[#1a1a1a] rounded text-[#1a1a1a] flex items-center justify-center hover:bg-gray-100 transition shrink-0 ml-0.5 sm:ml-2"
                        aria-label="Menu"
                    >
                        <Menu strokeWidth={1.5} className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

