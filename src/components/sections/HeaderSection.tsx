"use client";

import { motion } from "framer-motion";
import { WeddingInfo } from "../../types";
import AudioPlayer from "../AudioPlayer";

interface HeaderSectionProps {
  weddingInfo: WeddingInfo;
}

export default function HeaderSection({ weddingInfo }: HeaderSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center bg-cover bg-center">
      {/* 배경 음악 플레이어 */}
      <AudioPlayer audioSrc="/audio/summer.mp3" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center px-4"
      >
        <p className="text-xl mb-6">
          {weddingInfo.date} {weddingInfo.day} {weddingInfo.time}
        </p>
        <h2 className="text-lg mb-4">{weddingInfo.location}</h2>
        <h2 className="text-lg mb-8">{weddingInfo.address}</h2>

        <div className="mt-12">
          <h1 className="text-2xl font-medium mb-2">Groom</h1>
          <p className="text-xl mb-6">{weddingInfo.groomName}</p>

          <h1 className="text-2xl font-medium mb-2">Bride</h1>
          <p className="text-xl mb-8">{weddingInfo.brideName}</p>
        </div>
      </motion.div>

      {/* 스크롤 다운 표시 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
