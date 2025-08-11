"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
export const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
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
