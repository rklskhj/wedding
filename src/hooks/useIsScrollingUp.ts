"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

/**
 * useIsScrollingUp
 * 전역 스크롤 Y 값을 구독하여 사용자가 위로 스크롤 중인지 여부를 추적합니다.
 * onViewportLeave 등에서 "위로 벗어날 때만 hidden" 같은 조건을 간단히 구현할 수 있습니다.
 *
 * @returns React.MutableRefObject<boolean> - 현재 위로 스크롤 중이면 true
 * @example
 * const isScrollingUpRef = useIsScrollingUp();
 * onViewportLeave={(entry) => {
 *   if (!entry?.isIntersecting && isScrollingUpRef.current) controls.start("hidden");
 * }}
 */
export function useIsScrollingUp(): React.MutableRefObject<boolean> {
  const { scrollY } = useScroll();
  const isScrollingUpRef = useRef<boolean>(false);

  useEffect(() => {
    let lastY = scrollY.get();
    const unsubscribe = scrollY.on("change", (y) => {
      isScrollingUpRef.current = y < lastY;
      lastY = y;
    });
    return () => unsubscribe();
  }, [scrollY]);

  return isScrollingUpRef;
}


