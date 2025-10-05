"use client";

import type { TransportInfo } from "@/types";

interface TransportSectionProps {
  transportInfo: TransportInfo;
}

export default function TransportSection({
  transportInfo,
}: TransportSectionProps) {
  return (
    <section className="pt-8 px-4 bg-white">
      {/* Subway */}
      <div className="mb-4 pb-4 border-b border-primary">
        <h3 className="font-medium text-secondary mb-2">🚃 지하철</h3>
        <div className="text-sm text-secondary">
          <div className="flex items-center gap-3">
            {transportInfo.subway.badges.map((badge) => (
              <div key={badge.label} className="flex items-center">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                  style={{ backgroundColor: badge.color }}
                  aria-hidden="true"
                />
                <span className="text-secondary">{badge.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 whitespace-pre-line">
            {transportInfo.subway.title}
          </p>
        </div>
      </div>

      {/* Bus */}
      <div className="mb-4 pb-4 border-b border-primary">
        <h3 className="font-medium text-secondary mb-2">🚌 버스</h3>
        <div className="text-sm text-secondary">
          {transportInfo.bus.title && (
            <p className="mb-2 whitespace-pre-line">
              {transportInfo.bus.title}
            </p>
          )}
          <ul className="space-y-1">
            {transportInfo.bus.categories.map((cat) => (
              <li key={cat.label} className="flex items-start">
                <div className="flex items-center mr-3 mt-1">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  <span className="text-secondary min-w-[64px]">
                    {cat.label}
                  </span>
                </div>
                <span className="text-secondary">{cat.routes.join(", ")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Car */}
      <div className="mb-4 pb-4 border-b border-primary">
        <h3 className="font-medium text-secondary mb-2">🚗 자가용</h3>
        <p className="text-sm whitespace-pre-line text-secondary">
          {transportInfo.car.join("\n")}
        </p>
      </div>
    </section>
  );
}
