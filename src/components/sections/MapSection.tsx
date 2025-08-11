"use client";

import MapComponent from "../MapSection";
import { MapInfo } from "../../types";

interface MapSectionProps {
  mapInfo: MapInfo;
  onCopyAddress: (text: string) => void;
}

export default function MapSection({
  mapInfo,
  onCopyAddress,
}: MapSectionProps) {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-medium text-center mb-8">오시는 길</h2>
      <MapComponent mapInfo={mapInfo} />

      <div className="mt-8 bg-zinc-900 p-4 rounded-lg">
        <p className="font-medium text-center mb-4">{mapInfo.title}</p>
        <p className="text-center mb-6">{mapInfo.address}</p>

        <button
          className="w-full py-3 bg-zinc-800 rounded-lg mb-4 hover:bg-zinc-700 transition"
          onClick={() => onCopyAddress(mapInfo.address)}
        >
          주소 복사하기
        </button>
      </div>
    </section>
  );
}
