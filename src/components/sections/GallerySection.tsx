"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { GalleryImage } from "../../types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

interface GallerySectionProps {
  images: GalleryImage[];
  title?: string;
}

export default function GallerySection({ images, title }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [modalImageError, setModalImageError] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
  const MAX_GRID_ITEMS = 12;

  // 기본 이미지: public/images/gallery1~12.webp 사용
  const localImages: GalleryImage[] = Array.from({ length: 12 }, (_, i) => {
    const index = i + 1;
    return {
      id: String(index),
      url: `/images/gallery${index}.webp`,
      alt: `갤러리 이미지 ${index}`,
    };
  });

  const displayImages = images.length > 0 ? images : localImages;
  const gridImages = displayImages.slice(0, MAX_GRID_ITEMS);

  // 모달 열기
  const openModal = (index: number) => {
    setSelectedImage(index);
    setModalImageError(false);
    // 모달이 열릴 때 스크롤 방지 (html, body 모두 차단)
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedImage(null);
    // 모달이 닫힐 때 스크롤 복원 (html, body 모두 복원)
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  // 컴포넌트 언마운트 시 스크롤 잠금이 남지 않도록 복원
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  // 무한 순환 이동
  const goPrev = () => {
    if (selectedImage === null) return;
    setModalImageError(false);
    const prevIndex =
      (selectedImage - 1 + gridImages.length) % gridImages.length;
    setSelectedImage(prevIndex);
  };

  const goNext = () => {
    if (selectedImage === null) return;
    setModalImageError(false);
    const nextIndex = (selectedImage + 1) % gridImages.length;
    setSelectedImage(nextIndex);
  };

  // 터치 스와이프 핸들러 (모바일)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchMoveX(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchMoveX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchMoveX === null) return;
    const deltaX = touchMoveX - touchStartX;
    const threshold = 50; // px
    if (deltaX > threshold) {
      goPrev();
    } else if (deltaX < -threshold) {
      goNext();
    }
    setTouchStartX(null);
    setTouchMoveX(null);
  };

  return (
    <section className="">
      {title && (
        <h2 className="text-2xl font-medium mb-6 text-center">{title}</h2>
      )}

      <div className="grid grid-cols-3 gap-0 overflow-hidden">
        {gridImages.map((image, index) => (
          <div
            key={image.id}
            className="aspect-square overflow-hidden cursor-pointer group relative"
            onClick={() => openModal(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-300"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {selectedImage !== null && gridImages[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center"
            onClick={closeModal}
          >
            {/* 닫기 버튼: 화면 우측 상단 고정 */}
            <button
              className="absolute top-3 right-3 md:top-5 md:right-5 text-white/90 hover:text-white transition-colors p-2"
              onClick={closeModal}
              aria-label="닫기"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
            <div
              className="relative w-[90vw] max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 이미지 */}
              <div
                className="relative w-full h-[80vh] overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={gridImages[selectedImage].id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {!modalImageError ? (
                      <Image
                        src={gridImages[selectedImage].url}
                        alt={gridImages[selectedImage].alt}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority
                        unoptimized
                        onError={() => setModalImageError(true)}
                      />
                    ) : (
                      <img
                        src={gridImages[selectedImage].url}
                        alt={gridImages[selectedImage].alt}
                        className="max-h-[80vh] max-w-[92vw] w-auto h-auto object-contain"
                        loading="eager"
                        decoding="async"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 하단 좌우 버튼 */}
              <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-between px-4 select-none">
                <button
                  className="pointer-events-auto p-2 rounded-full  text-white transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="이전 이미지"
                >
                  <IoChevronBackOutline className="w-7 h-7" />
                </button>
                <button
                  className="pointer-events-auto p-2 rounded-full  text-white transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="다음 이미지"
                >
                  <IoChevronForwardOutline className="w-7 h-7" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
