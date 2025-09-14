"use client";

import MapComponent from "../MapSection";
import { MapInfo } from "../../types";
import Image from "next/image";

interface MapSectionProps {
  mapInfo: MapInfo;
  onCopyAddress: (text: string) => void;
}

export default function MapSection({
  mapInfo,
  onCopyAddress,
}: MapSectionProps) {
  return (
    <section className="bg-white">
      {/* 달력 */}
      <div className="relative w-full py-8 bg-secondary">
        <Image
          src="/images/calendar.png"
          alt="wedding"
          width={1200}
          height={2000}
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="flex justify-center items-center px-4 bg-white w-full h-full pb-8 pt-12">
        <div className="flex justify-center items-center w-24 h-8 bg-primary text-2xl font-medium font-presentation text-white text-center ">
          오시는 길
        </div>
      </div>

      <MapComponent mapInfo={mapInfo} onCopyAddress={onCopyAddress} />
    </section>
  );
}
