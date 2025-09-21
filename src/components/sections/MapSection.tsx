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
    <section className="bg-white">
      <div className="flex justify-center items-center px-4 bg-white w-full h-full pb-8 pt-12">
        <div className="flex justify-center items-center w-24 h-8 bg-primary text-2xl font-medium font-presentation text-white text-center ">
          오시는 길
        </div>
      </div>

      <MapComponent mapInfo={mapInfo} onCopyAddress={onCopyAddress} />
    </section>
  );
}
