"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WeddingInfo } from "../../types";
import AudioPlayer from "../AudioPlayer";
import Image from "next/image";
interface HeaderSectionProps {
  weddingInfo: WeddingInfo;
}

export default function HeaderSection({ weddingInfo }: HeaderSectionProps) {
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stickyContainerRef,
    offset: ["start start", "end start"],
  });
  // 스크롤 진행도(0→1)에 따라 전경 이미지만 위로 이동
  const imageY = useTransform(scrollYProgress, [0, 1], ["0vh", "-40vh"]);
  // 스크롤 진행도에 따라 하단 오버레이 높이를 점진적으로 확대/축소
  // 그라데이션: 더 얇게(높이 축소), 더 진하게(색상은 아래 div 클래스에서 조정)
  const gradientHeight = useTransform(
    scrollYProgress,
    [0, 0.12, 0.4, 1],
    ["18vh", "22vh", "30vh", "56vh"]
  );
  // 블랙 바: 초반에 빠르게 커지도록 멀티 포인트 매핑(가속 느낌)
  const blackBarHeight = useTransform(
    scrollYProgress,
    // 초반(0~0.2) 급성장 → 0.4까지 완만, 이후 서서히 증가
    [0, 0.12, 0.4, 1],
    ["14vh", "20vh", "30vh", "56vh"]
  );
  return (
    <section className="relative min-h-[200vh] bg-basic bg-cover bg-center">
      {/* 배경 음악 플레이어 */}
      <AudioPlayer audioSrc="/audio/summer.mp3" />

      {/* 이미지: 특정 구간(h-[140vh]) 동안만 sticky 유지 후 release */}
      <div className="relative" ref={stickyContainerRef}>
        <div className="sticky top-0 h-screen w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative h-full w-full"
            style={{
              backgroundImage: "url('/images/we_bg.png')",
              backgroundSize: "contain",
              backgroundPosition: "0 14px",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* 전경 이미지: 배경은 고정, 이미지 레이어만 y 이동. 상하 여백으로 높이 축소 */}
            <motion.div
              className="absolute inset-x-0 top-0 bottom-0"
              style={{ y: imageY }}
            >
              <Image
                src="/images/we.png"
                alt="wedding"
                fill
                priority
                sizes="100vw"
                className="object-contain z-20 pointer-events-none"
              />
            </motion.div>
            {/* 하단 그라데이션/블록: 스크롤 진행도에 비례해 높이 증가 */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-24 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
              style={{ height: gradientHeight }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 z-30 bg-black"
              style={{ height: blackBarHeight }}
            />
          </motion.div>
        </div>
        {/* 신랑 신부 텍스트: 이미지와 함께 y 이동, 두 줄 구성 + 라인하이트 조정 */}
        <motion.div
          className="pointer-events-none absolute left-16 bottom-56 z-40 text-center w-fit"
          style={{ y: imageY }}
        >
          <div className="text-white font-presentation leading-[1.05]">
            <span className="block font-thin text-2xl">신랑</span>
            <span className="block font-bold text-3xl">
              {weddingInfo.groomName}
            </span>
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute right-12 bottom-56 z-40 text-center w-fit"
          style={{ y: imageY }}
        >
          <div className="text-primary-500 font-presentation leading-[1.05]">
            <span className="block font-thin text-2xl">신부</span>
            <span className="block font-bold text-3xl">
              {weddingInfo.brideName}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 이미지 구간 */}
      <div className="relative bg-black h-full flex flex-col justify-start items-center gap-16 pb-20">
        <div className="flex flex-col items-center gap-10">
          <Image
            src="/images/label1.png"
            alt="wedding"
            width={150}
            height={150}
          />
          <div className="leading-[1.8] text-white text-center text-xl font-medium font-presentation">
            <span>2025년 11월 9일 일요일 오후 2시 50분</span>
            <br />
            <span>강서 더뉴컨벤션 1층 르노브홀</span>
          </div>
        </div>
        <Image
          src="/images/text_image1.png"
          alt="wedding"
          width={300}
          height={300}
        />
      </div>
      <div className="relative w-full">
        <Image
          src="/images/l_img1.png"
          alt="wedding"
          width={1200}
          height={2000}
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* 이미지 */}
      <div className="relative w-full">
        <Image
          src="/images/shose.png"
          alt="wedding"
          width={1200}
          height={2000}
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}
