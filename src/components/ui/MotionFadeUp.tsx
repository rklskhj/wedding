"use client";

import { PropsWithChildren } from "react";
import { motion, Variants, useAnimationControls } from "framer-motion";
import { useIsScrollingUp } from "@/hooks/useIsScrollingUp";

export interface MotionFadeUpProps {
  className?: string;
  /** 뷰포트 진입 판정 강도 (0~1). 기본 0.82 */
  amount?: number;
  /** 뷰포트 margin 설정. 기본 "0px 0px -12% 0px" */
  viewportMargin?: string;
}

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

/**
 * MotionFadeUp
 * - in-view 시 아래에서 위로 나타나는 공용 모션 컨테이너
 * - 위로 스크롤하여 뷰포트를 벗어날 때만 hidden 처리
 */
export function MotionFadeUp({
  children,
  className,
  amount = 0.82,
  viewportMargin = "0px 0px -12% 0px",
}: PropsWithChildren<MotionFadeUpProps>) {
  const controls = useAnimationControls();
  const isScrollingUpRef = useIsScrollingUp();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={controls}
      onViewportEnter={() => controls.start("show")}
      onViewportLeave={(entry) => {
        if (!entry?.isIntersecting && isScrollingUpRef.current) {
          controls.start("hidden");
        } else {
          controls.start("show");
        }
      }}
      viewport={{ once: false, amount, margin: viewportMargin }}
    >
      {children}
    </motion.div>
  );
}
