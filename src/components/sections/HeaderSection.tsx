"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  Variants,
  useAnimationControls,
} from "framer-motion";
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
  // 전역 스크롤 속도로 페이드 가속 제어
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const absVelocity = useTransform(scrollVelocity, (v: number) => Math.abs(v));
  // 스크롤 진행도(0→1)에 따라 전경 이미지만 위로 이동 – 비율 프레임 기준 퍼센트 이동
  const imageY = useTransform(scrollYProgress, [0, 1], ["3%", "-32%"]);
  // 스크롤 진행도에 따라 하단 오버레이 높이를 점진적으로 확대/축소
  // 그라데이션: 더 얇게(높이 축소), 더 진하게(색상은 아래 div 클래스에서 조정)
  const gradientHeight = useTransform(
    scrollYProgress,
    [0, 0.12, 0.4, 1],
    ["14%", "24%", "36%", "62%"]
  );
  // 블랙 바: 초반에 빠르게 커지도록 멀티 포인트 매핑(가속 느낌)
  const blackBarHeight = useTransform(
    scrollYProgress,
    // 초반(0~0.2) 급성장 → 0.4까지 완만, 이후 서서히 증가
    [0, 0.12, 0.4, 1],
    ["28.2%", "36.2%", "46.2%", "56%"]
  );
  // 텍스트: 스크롤 조금 내리면 숨기고, 맨 위로 올리면 다시 보이게
  const textOpacityBase = useTransform(
    scrollYProgress,
    [0, 0.015, 0.03, 1],
    [1, 1, 0, 0]
  );
  // 속도가 빠를수록 더 빨리(더 낮은 진행도에서) 사라지도록 가속 계수 적용
  const textOpacity = useTransform([textOpacityBase, absVelocity], (values) => {
    const o = (values[0] as number) ?? 0;
    const v = (values[1] as number) ?? 0;
    const factor = 1 + Math.min(v / 1000, 4); // 1~3배 빨라짐
    const faded = 1 - (1 - o) * factor; // 속도에 비례해 더 일찍 0으로 수렴
    return Math.max(0, Math.min(1, faded));
  });
  const textOpacitySpring = useSpring(textOpacity, {
    stiffness: 220,
    damping: 20,
    mass: 0.3,
  });
  // 이미지 구간: in-view 시 나타나고, 더 내려가면 유지, 위로 벗어날 때만 숨김(요소별 개별 제어)
  const firstBlockControls = useAnimationControls();
  const secondBlockControls = useAnimationControls();
  const isScrollingUpRef = useRef<boolean>(false);
  useEffect(() => {
    let lastY = scrollY.get();
    const unsubscribe = scrollY.on("change", (y) => {
      isScrollingUpRef.current = y < lastY;
      lastY = y;
    });
    return () => unsubscribe();
  }, [scrollY]);
  const fadeUp: Variants = {
    hidden: {
      opacity: 0,
      y: 32,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
    },
  };
  // 컨테이너 variants는 제거하고 요소별로 개별 트리거 사용
  // 텍스트는 섹션 내 절대 배치로 고정(투명도 애니메이션 제거)
  return (
    <section className="relative min-h-[200svh] bg-cover bg-center">
      {/* 이미지: 특정 구간(h-[140vh]) 동안만 sticky 유지 후 release */}
      <div className="relative bg-basic" ref={stickyContainerRef}>
        <div className="sticky top-0 h-[100svh] w-full">
          {/* 비율 프레임: 390x844 기준 */}
          {/* 배경 음악 플레이어 */}
          <AudioPlayer audioSrc="/audio/summer.mp3" />
          <div className="relative mx-auto w-full max-w-[430px] aspect-[390/844]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {/* 배경(선택) */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/images/we_bg.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* 전경 이미지: 프레임 기준 퍼센트 이동 */}
              <motion.div className="absolute inset-0" style={{ y: imageY }}>
                <Image
                  src="/images/we.png"
                  alt="wedding"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain pointer-events-none object-[center_18%]"
                />
              </motion.div>

              {/* 하단 그라데이션/블록: 프레임 퍼센트 높이 */}
              <motion.div
                className="pointer-events-none absolute left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
                style={{ bottom: "28%", height: gradientHeight }}
              />
              <motion.div
                className="absolute left-0 right-0 bottom-0 z-30 bg-black"
                style={{ height: blackBarHeight }}
              />

              {/* 신랑 신부 텍스트: 퍼센트 좌표 + clamp 폰트 */}
              <motion.div
                className="absolute z-40 text-center pointer-events-none"
                style={{
                  left: "16%",
                  bottom: "48%",
                  opacity: textOpacitySpring,
                }}
              >
                <div className="text-white font-presentation leading-[1.05]">
                  <span className="block font-thin text-[clamp(18px,5.0vw,24px)]">
                    신랑
                  </span>
                  <span className="block font-bold text-[clamp(24px,6.6vw,32px)]">
                    {weddingInfo.groomName}
                  </span>
                </div>
              </motion.div>
              <motion.div
                className="absolute z-40 text-center pointer-events-none"
                style={{
                  right: "10%",
                  bottom: "45%",
                  opacity: textOpacitySpring,
                }}
              >
                <div className="text-primary-500 font-presentation leading-[1.05]">
                  <span className="block font-thin text-[clamp(18px,5.0vw,24px)]">
                    신부
                  </span>
                  <span className="block font-bold text-[clamp(24px,6.6vw,32px)]">
                    {weddingInfo.brideName}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 이미지 구간 */}
      <div className="relative bg-black h-full flex flex-col justify-start items-center gap-16 pb-20">
        <motion.div
          className="flex flex-col items-center gap-10"
          variants={fadeUp}
          initial="hidden"
          animate={firstBlockControls}
          onViewportEnter={() => {
            firstBlockControls.start("show");
          }}
          onViewportLeave={(entry) => {
            // 위로 벗어날 때만 숨김
            if (!entry?.isIntersecting && isScrollingUpRef.current) {
              firstBlockControls.start("hidden");
            } else {
              firstBlockControls.start("show");
            }
          }}
          viewport={{ once: false, amount: 0.82, margin: "0px 0px -12% 0px" }}
        >
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
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={secondBlockControls}
          onViewportEnter={() => {
            secondBlockControls.start("show");
          }}
          onViewportLeave={(entry) => {
            if (!entry?.isIntersecting && isScrollingUpRef.current) {
              secondBlockControls.start("hidden");
            } else {
              secondBlockControls.start("show");
            }
          }}
          viewport={{ once: false, amount: 0.92, margin: "0px 0px -20% 0px" }}
        >
          <Image
            src="/images/text_image1.png"
            alt="wedding"
            width={300}
            height={300}
          />
        </motion.div>
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
