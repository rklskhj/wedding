"use client";

import Image from "next/image";
import { MotionFadeUp } from "@/components/ui/MotionFadeUp";

/**
 * ThankyouSection
 * 단일 감사 이미지 섹션. 뷰포트 진입 시 페이드 업 모션 적용.
 */
export default function ThankyouSection() {
  return (
    <section>
      <MotionFadeUp
        className="w-full"
        amount={0.6}
        viewportMargin="0px 0px 0% 0px"
      >
        <Image
          src="/images/thanks.webp"
          alt="감사 인사"
          width={1200}
          height={1200}
          sizes="100vw"
          className="w-full h-auto object-contain"
          priority
        />
      </MotionFadeUp>
    </section>
  );
}
