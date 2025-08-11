"use client";

import { useState } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="py-12 px-4">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      )}

      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        {/* 썸네일 커버 (비디오가 시작되지 않았을 때만 표시) */}
        {!hasStarted && (
          <div
            className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer z-10"
            onClick={handlePlay}
          >
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-pink-500 border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        )}

        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={hasStarted}
          onPlay={handlePlay}
          onPause={handlePause}
          config={{
            youtube: {
              playerVars: { showinfo: 1 },
            },
          }}
        />
      </div>
    </div>
  );
}
