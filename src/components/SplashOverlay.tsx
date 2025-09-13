"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface SplashOverlayProps {
  /** 배경 이미지 경로 (public 기준) */
  bgImageSrc?: string;
  /** 전경(텍스트/로고) 이미지 경로 (public 기준) */
  fgImageSrc?: string;
  /** 슬라이드 모드: 여러 장을 순차 재생 */
  slides?: Array<{
    bgImageSrc?: string;
    fgImageSrc?: string;
    durationMs?: number;
  }>;
  /** 자동 종료까지 대기 시간(ms) */
  durationMs?: number;
  /** 크로스페이드 시간(ms) */
  crossfadeMs?: number;
  /** 스플래시 종료 콜백 */
  onFinish?: () => void;
}

/**
 * 전면 스플래시 오버레이. 첫 로딩 시 풀스크린으로 노출 후 자동 종료되며,
 * 사용자가 화면을 탭하면 즉시 종료됩니다.
 * 예시 사용: <SplashOverlay onFinish={() => setIsLoading(false)} />
 */
export default function SplashOverlay({
  bgImageSrc = "/images/we.png",
  fgImageSrc,
  slides,
  durationMs = 1800,
  crossfadeMs = 700,
  onFinish,
}: SplashOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReverse, setIsReverse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevImages, setPrevImages] = useState<{
    bg?: string;
    fg?: string;
  } | null>(null);
  const [isBgReady, setIsBgReady] = useState(false);
  const prevWasReverseRef = useRef<boolean>(false);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const loadedCacheRef = useRef<Record<string, boolean>>({});

  const startBgAnim = () => {
    if (isBgReady) return;
    requestAnimationFrame(() => {
      // 강제 리플로우로 트랜지션 시작 보장
      if (currentImgRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        currentImgRef.current.offsetWidth;
      }
      requestAnimationFrame(() => setIsBgReady(true));
    });
  };

  const hasSlides = Array.isArray(slides) && slides.length > 0;
  const current = useMemo(() => {
    if (!hasSlides) return { bgImageSrc, fgImageSrc, durationMs };
    const item = slides![currentIndex] ?? {};
    return {
      bgImageSrc: item.bgImageSrc ?? bgImageSrc,
      fgImageSrc: item.fgImageSrc ?? fgImageSrc,
      durationMs: item.durationMs ?? durationMs,
    };
  }, [hasSlides, slides, currentIndex, bgImageSrc, fgImageSrc, durationMs]);

  // 슬라이드 진행 타이머: 이미지가 준비되어 애니메이션이 시작된 시점(isBgReady)부터 카운트
  useEffect(() => {
    if (!isBgReady) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (hasSlides) {
        const isLast = currentIndex >= (slides?.length ?? 1) - 1;
        if (isLast) {
          onFinish?.();
        } else {
          // 현재 프레임의 최종 방향(이전 방향)을 저장해, 이전 이미지가 순간적으로 좌표가 초기화되지 않도록 고정
          prevWasReverseRef.current = isReverse;
          setPrevImages({ bg: current.bgImageSrc, fg: current.fgImageSrc });
          setIsReverse((idx) => !idx);
          setCurrentIndex((idx) => idx + 1);
          setIsBgReady(false);
        }
      } else {
        onFinish?.();
      }
    }, current.durationMs ?? durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isBgReady,
    hasSlides,
    currentIndex,
    slides,
    current.durationMs,
    durationMs,
    onFinish,
    isReverse,
    current.bgImageSrc,
    current.fgImageSrc,
  ]);

  // 현재 이미지가 이미 로드된 상태라면(캐시 등) 강제로 트랜지션 시작
  useEffect(() => {
    if (currentImgRef.current && currentImgRef.current.complete) {
      startBgAnim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.bgImageSrc]);

  // 다음 배경 프리로드(모바일 로딩 편차 완화)
  useEffect(() => {
    if (!hasSlides) return;
    const nextIndex = currentIndex + 1;
    if (!slides || nextIndex >= slides.length) return;
    const nextSrc = slides[nextIndex]?.bgImageSrc;
    if (!nextSrc || loadedCacheRef.current[nextSrc]) return;
    const img = new Image();
    img.src = nextSrc;
    img.onload = () => {
      loadedCacheRef.current[nextSrc] = true;
    };
    img.onerror = () => {
      // 네트워크 에러 시 캐시하지 않음
    };
    // 브라우저가 지원하면 decode로 디코딩을 미리 완료
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyImg = img as any;
    if (typeof anyImg.decode === "function") {
      anyImg
        .decode()
        .then(() => {
          loadedCacheRef.current[nextSrc] = true;
        })
        .catch(() => {
          // decode 실패 시 onload로 대체
        });
    }
  }, [hasSlides, slides, currentIndex]);

  return (
    <div
      className="fixed inset-0 z-[9999] w-full h-full bg-black overflow-hidden"
      role="dialog"
      aria-label="오프닝 스플래시"
      onClick={() => onFinish?.()}
    >
      {/* 배경 이미지 (천천히 확대) */}
      <div className="absolute inset-0">
        {/* 이전 프레임 (페이드아웃) */}
        {prevImages?.bg && (
          <img
            key={`bg-prev-${currentIndex}`}
            src={prevImages.bg}
            alt="splash background prev"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
            style={{
              opacity: isBgReady ? 0 : 1,
              // 이전 프레임의 최종 위치를 유지해 점프 방지
              transform: prevWasReverseRef.current
                ? "translateX(-5%) scale(1.2)"
                : "translateX(5%) scale(1.2)",
              willChange: "transform, opacity",
              transition: `opacity ${crossfadeMs}ms ease-out`,
            }}
          />
        )}
        {/* 현재 프레임 (페이드인 + 좌/우 팬) */}
        <img
          key={`bg-${currentIndex}`}
          src={current.bgImageSrc}
          alt="splash background"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover`}
          draggable={false}
          ref={currentImgRef}
          onLoad={startBgAnim}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          style={{
            opacity: prevImages?.bg ? (isBgReady ? 1 : 0) : 1,
            // 트랜지션 기반으로 시작 위치에서 끝 위치까지 자연 이동
            transform: isReverse
              ? isBgReady
                ? "translateX(-5%) scale(1.2)"
                : "translateX(5%) scale(1.2)"
              : isBgReady
              ? "translateX(5%) scale(1.2)"
              : "translateX(-5%) scale(1.2)",
            willChange: "transform, opacity",
            transition: `transform ${
              current.durationMs ?? durationMs
            }ms ease-out, opacity ${crossfadeMs}ms ease-out`,
          }}
        />
        {/* 어둡게 오버레이 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 전경 텍스트/로고 이미지 (페이드 인) */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-8">
        {current.fgImageSrc && (
          <>
            {/* 이전 프레임 (페이드아웃) */}
            {prevImages?.fg && (
              <img
                key={`fg-prev-${currentIndex}`}
                src={prevImages.fg}
                alt="splash foreground prev"
                className="absolute pointer-events-none max-w-[88%] h-auto opacity-0 transition-opacity duration-500"
                draggable={false}
              />
            )}
            {/* 현재 프레임 (페이드인) */}
            <img
              key={`fg-${currentIndex}`}
              src={current.fgImageSrc}
              alt="splash foreground"
              className="pointer-events-none max-w-[88%] h-auto opacity-100 transition-opacity duration-500"
              draggable={false}
            />
          </>
        )}
      </div>

      {/* 하단 안내 텍스트 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center">
        <p className="text-xs text-white/70 tracking-wider">
          화면을 탭하면 바로 입장합니다
        </p>
      </div>
    </div>
  );
}
