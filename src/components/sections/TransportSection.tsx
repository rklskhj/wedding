"use client";

interface TransportSectionProps {
  transportInfo: {
    subway: string;
    bus: string;
    coach: string;
  };
}

export default function TransportSection({
  transportInfo,
}: TransportSectionProps) {
  return (
    <section className="py-8 px-4">
      <div className="mb-8">
        <h3 className="font-medium mb-2">지하철</h3>
        <p className="text-sm whitespace-pre-line text-gray-300">
          {transportInfo.subway}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">버스</h3>
        <p className="text-sm whitespace-pre-line text-gray-300">
          {transportInfo.bus}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">고속버스</h3>
        <p className="text-sm whitespace-pre-line text-gray-300">
          {transportInfo.coach}
        </p>
      </div>
    </section>
  );
}
