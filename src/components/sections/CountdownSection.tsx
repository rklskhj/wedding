"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  /** ISO-like 날짜 문자열 예: 2025-11-09T14:00:00+09:00 또는 2025-11-09 */
  targetDate: string;
  /** 부제 문구에 표시할 커플명 (예: "진호, 나은") */
  coupleName?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const totalMs = Math.max(0, diff);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs };
}

/**
 * 결혼식까지 남은 일시를 카운트다운으로 보여주는 섹션
 * 전달받은 HTML 구조를 Tailwind 스타일로 재현하고 접근성 속성 추가
 */
export default function CountdownSection({
  targetDate,
  coupleName,
}: CountdownProps) {
  const target = useMemo(() => new Date(targetDate), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(target)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const daysText = timeLeft.totalMs === 0 ? 0 : timeLeft.days;
  const hoursText = timeLeft.totalMs === 0 ? 0 : timeLeft.hours;
  const minutesText = timeLeft.totalMs === 0 ? 0 : timeLeft.minutes;
  const secondsText = timeLeft.totalMs === 0 ? 0 : timeLeft.seconds;

  const remainingDaysForSubtitle = Math.max(
    0,
    Math.ceil(timeLeft.totalMs / (1000 * 60 * 60 * 24))
  );

  return (
    <section
      aria-label="결혼식 카운트다운"
      className="w-full px-4 py-6 border-b border-gray-200"
    >
      <div className="dday-wrap text-center select-none">
        <div
          className="countdown inline-flex items-end justify-center gap-3 text-[#000] leading-tight font-sans"
          aria-live="polite"
        >
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="desc text-xs text-primary">Days</div>
            <span
              className="card inline-block min-w-[2.5rem] px-2 py-1 rounded bg-[--box-bg-color] text-secondary text-xl font-bold"
              style={{ width: "auto" }}
            >
              {daysText}
            </span>
          </div>

          <div className="pb-2 text-lg text-secondary">:</div>

          {/* Hour */}
          <div className="flex flex-col items-center">
            <div className="desc text-xs text-primary">Hour</div>
            <span className="card inline-block min-w-[2.5rem] px-2 py-1 rounded bg-[--box-bg-color] text-secondary text-xl font-bold">
              {hoursText.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="pb-2 text-lg text-secondary">:</div>

          {/* Min */}
          <div className="flex flex-col items-center">
            <div className="desc text-xs text-primary">Min</div>
            <span className="card inline-block min-w-[2.5rem] px-2 py-1 rounded bg-[--box-bg-color] text-secondary text-xl font-bold">
              {minutesText.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="pb-2 text-lg text-secondary">:</div>

          {/* Sec */}
          <div className="flex flex-col items-center">
            <div className="desc text-xs text-primary">Sec</div>
            <span className="card inline-block min-w-[2.5rem] px-2 py-1 rounded bg-[--box-bg-color] text-secondary text-xl font-bold">
              {secondsText.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="subTitle mt-3 text-[0.95rem] text-secondary">
          <p>
            {coupleName ?? "신랑 신부"}의 결혼식이{" "}
            <span style={{ color: "#F3748F" }}>{remainingDaysForSubtitle}</span>
            일 남았습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
