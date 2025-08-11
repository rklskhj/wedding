"use client";

import { GalleryImage } from "../types";

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
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

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-medium mb-6 text-center">{title}</h2>
      )}

      <div className="grid grid-cols-2 gap-1">
        {displayImages.map((image) => (
          <div
            key={image.id}
            className="aspect-square overflow-hidden cursor-pointer relative group"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
