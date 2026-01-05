'use client';
import React, { useEffect, useState } from 'react';

const LatestAudio: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch('/api/media/latest');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAudioUrl(data.url);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch audio:", e);
      }
    };

    fetchAudio();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!audioUrl) {
    return <div className="text-gray-500">Loading audio...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="w-full p-4">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Podcast of the Week</div>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default LatestAudio;