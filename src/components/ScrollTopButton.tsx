"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
export const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const rAFRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (rAFRef.current !== null) return;
      rAFRef.current = window.requestAnimationFrame(() => {
        toggleVisibility();
        rAFRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-zinc-800 rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100  translate-y-0"
          : "opacity-0  translate-y-0 pointer-events-none"
      }`}
    >
      <FaArrowUp />
    </button>
  );
};
