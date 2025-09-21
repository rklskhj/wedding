"use client";

import Image from "next/image";
import { MotionFadeUp } from "@/components/ui/MotionFadeUp";

/**
 * 달력 이미지를 독립 섹션으로 표시합니다.
 * - bg-secondary 배경
 * - 이미지가 뷰포트 진입 시 아래에서 위로 나타나는(fade-up) 모션
 * - 위로 스크롤하여 뷰포트를 벗어날 때만 숨김 처리
 */
export default function CalendarSection() {
  // 공용 컴포넌트 사용으로 로직 제거

  return (
    <section className="bg-secondary">
      <MotionFadeUp
        className="relative w-full py-8"
        amount={0.5}
        viewportMargin="0px 0px 12% 0px"
      >
        <Image
          src="/images/calendar.png"
          alt="wedding"
          width={1200}
          height={2000}
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
      </MotionFadeUp>
    </section>
  );
}
