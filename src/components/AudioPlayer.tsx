"use client";

import { useState, useEffect, useRef } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface AudioPlayerProps {
  audioSrc: string;
}

export default function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 클라이언트 측에서만 마운트되도록 함
  useEffect(() => {
    setIsMounted(true);

    // 오디오 요소 생성
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audioRef.current = audio;

    // 컴포넌트 언마운트 시 오디오 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  const togglePlay = () => {
    console.log("togglePlay");
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("재생 실패:", error);
      });
    }

    setIsPlaying(!isPlaying);
  };

  // 클라이언트 측에서만 렌더링
  if (!isMounted) return null;

  return (
    <button
      onClick={togglePlay}
      className="absolute top-6 right-6 z-50 bg-zinc-800 rounded-full p-3 shadow-lg"
      aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
    >
      {isPlaying ? (
        <FaVolumeUp className="text-white text-xl" />
      ) : (
        <FaVolumeMute className="text-gray-400 text-xl" />
      )}
    </button>
  );
}
