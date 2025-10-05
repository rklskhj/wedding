"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
export const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const baseBottomPx = 24; // tailwind bottom-6
  const safeGapPx = 16; // footer 위 여유 간격
  const [bottomOffset, setBottomOffset] = useState<number>(baseBottomPx);

  const rAFRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (rAFRef.current !== null) return;
      rAFRef.current = window.requestAnimationFrame(() => {
        toggleVisibility();
        updateBottomOffset();
        rAFRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // 초기 위치 계산
    updateBottomOffset();
    toggleVisibility();
    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onScroll as EventListener);
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
      }
    };
  }, []);

  const toggleVisibility = () => {
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const updateBottomOffset = () => {
    const footer = document.querySelector("footer");
    if (!footer) {
      setBottomOffset(baseBottomPx);
      return;
    }
    const rect = (footer as HTMLElement).getBoundingClientRect();
    const overlap = Math.max(0, window.innerHeight - rect.top); // 뷰포트 하단과 푸터 상단의 겹침
    const requiredBottom = Math.max(baseBottomPx, overlap + safeGapPx);
    setBottomOffset(requiredBottom);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-zinc-800/60 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100  translate-y-0"
          : "opacity-0  translate-y-0 pointer-events-none"
      }`}
      style={{ bottom: bottomOffset }}
    >
      <FaArrowUp />
    </button>
  );
};
