"use client";

import { useState } from "react";
import { GalleryImage } from "../../types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface GallerySectionProps {
  images: GalleryImage[];
  title?: string;
}

export default function GallerySection({ images, title }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // 샘플 이미지 (실제 프로젝트에서는 props로 전달받은 이미지 사용)
  const sampleImages: GalleryImage[] = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      alt: "웨딩 이미지 1",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      alt: "웨딩 이미지 2",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f",
      alt: "웨딩 이미지 3",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866",
      alt: "웨딩 이미지 4",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
      alt: "웨딩 이미지 5",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      alt: "웨딩 이미지 6",
    },
  ];

  const displayImages = images.length > 0 ? images : sampleImages;

  // 모달 열기
  const openModal = (index: number) => {
    setSelectedImage(index);
    // 모달이 열릴 때 스크롤 방지
    document.body.style.overflow = "hidden";
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedImage(null);
    // 모달이 닫힐 때 스크롤 복원
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-16 px-4">
      {title && (
        <h2 className="text-2xl font-medium mb-6 text-center">{title}</h2>
      )}

      <div className="grid grid-cols-2 gap-1">
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className="aspect-square overflow-hidden cursor-pointer group"
            onClick={() => openModal(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:opacity-80 transition-opacity duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeModal}
          >
            <div
              className="relative max-w-3xl max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                className="absolute top-2 right-2 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-2"
                onClick={closeModal}
                aria-label="닫기"
              >
                <FaTimes />
              </button>

              {/* 이미지 */}
              <div className="relative w-full h-[80vh]">
                <Image
                  src={displayImages[selectedImage].url}
                  alt={displayImages[selectedImage].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
