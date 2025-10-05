"use client";

import { useEffect, useRef, useState } from "react";
import { MapInfo } from "../types";
import Image from "next/image";

// 네이버 맵 최소 타입 선언
interface NaverMapsLatLng {
  new (lat: number, lng: number): NaverMapsLatLngInstance;
}

type NaverMapsLatLngInstance = object;

interface NaverMapsPoint {
  new (x: number, y: number): NaverMapsPointInstance;
}

type NaverMapsPointInstance = object;

interface NaverMapsSize {
  new (width: number, height: number): NaverMapsSizeInstance;
}

type NaverMapsSizeInstance = object;

interface NaverMapsMapOptions {
  center: NaverMapsLatLngInstance;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
  zoomControlOptions?: {
    position: string;
  };
}

type NaverMapsMap = {
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  setOptions: (options: Partial<NaverMapsMapOptions>) => void;
};

interface NaverMapsMarkerOptions {
  position: NaverMapsLatLngInstance;
  map: NaverMapsMap;
  title?: string;
  icon?:
    | string
    | {
        url?: string;
        content?: string;
        size?: NaverMapsSizeInstance;
        anchor?: NaverMapsPointInstance;
      };
}

type NaverMapsMarker = object;

interface NaverMapsInfoWindowOptions {
  content: string;
}

interface NaverMapsInfoWindow {
  open: (map: NaverMapsMap, marker: NaverMapsMarker) => void;
  close: () => void;
  getMap: () => NaverMapsMap | null | undefined;
}

interface NaverMapsEvent {
  addListener: (target: unknown, event: string, callback: () => void) => void;
}

interface NaverMapsPosition {
  TOP_RIGHT: string;
}

interface NaverMapsNamespace {
  Map: new (element: HTMLElement, options: NaverMapsMapOptions) => NaverMapsMap;
  Marker: new (options: NaverMapsMarkerOptions) => NaverMapsMarker;
  InfoWindow: new (options: NaverMapsInfoWindowOptions) => NaverMapsInfoWindow;
  LatLng: NaverMapsLatLng;
  Event: NaverMapsEvent;
  Position: NaverMapsPosition;
  Point: NaverMapsPoint;
  Size: NaverMapsSize;
}

// Naver Maps API 타입 정의
declare global {
  interface Window {
    naver: {
      maps: NaverMapsNamespace;
    };
  }
}

interface MapSectionProps {
  mapInfo: MapInfo;
  onCopyAddress: (text: string) => void;
}

export default function MapSection({
  mapInfo,
  onCopyAddress,
}: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const { title, address, latitude, longitude } = mapInfo;

  // 네이버 지도 초기화
  useEffect(() => {
    // API 키 검증
    const apiKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!apiKey) {
      const errorMsg = "NAVER Maps API 키가 설정되지 않았습니다.";
      console.error(
        `${errorMsg} .env.local 파일에 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID를 추가해주세요.`
      );
      setMapError(errorMsg);
      return;
    }

    // 네이버 맵 스크립트 로드
    const loadNaverMap = () => {
      if (window.naver) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      // 최신 가이드: oapi 도메인 + ncpKeyId 파라미터 사용
      // 참고: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}`;
      script.async = true;
      script.onload = () => initializeMap();
      script.onerror = () => {
        const errorMsg = "지도를 불러올 수 없습니다.";
        console.error(
          "NAVER Maps 스크립트 로드 실패. API 키 또는 네트워크 상태를 확인해주세요."
        );
        setMapError(errorMsg);
      };

      // 인증 실패 디버깅 훅 (문서 제공 전역 함수)
      (
        window as unknown as { navermap_authFailure?: () => void }
      ).navermap_authFailure = () => {
        const errorMsg = "지도 인증에 실패했습니다.";
        console.error(
          "NAVER Maps 인증 실패: API 키 또는 등록된 도메인을 확인해주세요."
        );
        setMapError(errorMsg);
      };
      document.head.appendChild(script);
    };

    // 지도 초기화 함수
    const initializeMap = () => {
      if (!mapRef.current || !window.naver) return;

      const location = new window.naver.maps.LatLng(latitude, longitude);
      const mapOptions: NaverMapsMapOptions = {
        center: location,
        zoom: 18,
        minZoom: 16, // 약 100m 수준으로 제한 (줌 아웃 한계)
        maxZoom: 18, // 약 30m 수준으로 제한 (줌 인 한계)
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      // 옵션 기반으로만 제한 적용 (컨트롤 비활성화가 자연스럽게 동작)
      map.setOptions({ minZoom: 16, maxZoom: 18 });

      // 커스텀 마커(SVG)
      const markerSvg = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5'>
          <path fill='#10b981' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z'/>
          <circle cx='12' cy='9' r='2.8' fill='white'/>
        </svg>`
      );

      new window.naver.maps.Marker({
        position: location,
        map: map,
        title: title,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${markerSvg}`,
          size: new window.naver.maps.Size(36, 36),
          anchor: new window.naver.maps.Point(18, 36),
        },
      });

      // 말풍선 제거: 마커만 표시
    };

    loadNaverMap();
  }, [title, address, latitude, longitude]);

  // 네이버 지도 열기
  const openNaverMap = () => {
    window.open(
      `https://map.naver.com/v5/search/${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  // 카카오 지도 열기
  const openKakaoMap = () => {
    window.open(
      `https://map.kakao.com/?q=${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  // 티맵 열기 (모바일: 앱 스킴/인텐트 시도 → 실패 시 웹 URL 폴백, 데스크톱: 웹 URL)
  const openTmap = () => {
    const appKey = process.env.NEXT_PUBLIC_TMAP_APP_KEY;
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    const schemeUrl = `tmap://route?goalx=${longitude}&goaly=${latitude}&goalname=${encodeURIComponent(
      title
    )}`;
    const webUrl = appKey
      ? `https://apis.openapi.sk.com/tmap/app/routes?appKey=${appKey}&name=${encodeURIComponent(
          title
        )}&lon=${longitude}&lat=${latitude}`
      : "";

    if (isAndroid) {
      // Android: intent URI 사용 → 미설치 시 스토어/웹 폴백 동작, 추가로 800ms 후 웹 URL 폴백
      const intentUrl = `intent://route?goalx=${longitude}&goaly=${latitude}&goalname=${encodeURIComponent(
        title
      )}#Intent;scheme=tmap;package=com.skt.tmap;end`;
      if (webUrl) {
        setTimeout(() => {
          // 앱 전환이 실패한 환경(에뮬레이터/데스크톱 UA 등)에서 웹으로 폴백
          try {
            window.location.href = webUrl;
          } catch {
            // noop
          }
        }, 800);
      }
      try {
        window.location.href = intentUrl;
      } catch {
        if (webUrl) {
          window.location.href = webUrl;
        }
      }
      return;
    }

    if (isIOS) {
      // iOS: 스킴 시도 후 800ms 내 전환 없으면 웹 URL로 폴백
      if (webUrl) {
        setTimeout(() => {
          try {
            window.location.href = webUrl;
          } catch {
            // noop
          }
        }, 800);
      }
      try {
        window.location.href = schemeUrl;
      } catch {
        if (webUrl) {
          window.location.href = webUrl;
        }
      }
      return;
    }

    // 데스크톱: 웹 URL로 열기 (새 탭)
    if (!appKey) {
      alert(
        "Tmap AppKey가 설정되지 않았습니다. .env에 NEXT_PUBLIC_TMAP_APP_KEY를 추가한 뒤 다시 시도하세요."
      );
      return;
    }
    window.open(webUrl, "_blank");
  };

  return (
    <div className="bg-white">
      {/* 지도 */}
      <div ref={mapRef} className="w-full h-80 overflow-hidden relative">
        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-600">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm font-medium mb-2">{mapError}</p>
              <p className="text-xs text-gray-500">
                아래 지도 앱 버튼을 이용해주세요
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-8 pb-4 px-4">
        <p className="font-medium text-lg text-primary text-center mb-2 whitespace-pre-line">
          {mapInfo.title}
        </p>
        <p className="text-center text-secondary mb-6">{mapInfo.address}</p>

        <button
          className="w-full py-3 bg-white font-medium border border-primary-500 text-primary-500 transition"
          onClick={() => onCopyAddress(mapInfo.address)}
        >
          주소 복사하기
        </button>
      </div>

      {/* 지도 앱 버튼 */}
      <div className="grid grid-cols-3 gap-2 mt-4 px-4 pb-8">
        <button
          onClick={openNaverMap}
          className="flex items-center justify-center gap-1 bg-white p-2 text-primary border border-primary transition"
        >
          <Image
            src="/images/icons/ico_nav03.webp"
            alt="네이버 지도"
            width={16}
            height={16}
          />
          <span className="text-xs font-medium">네이버 지도</span>
        </button>

        <button
          onClick={openKakaoMap}
          className="flex items-center justify-center gap-1 bg-white p-2 text-primary border border-primary transition"
        >
          <Image
            src="/images/icons/ico_nav01.svg"
            alt="카카오 지도"
            width={16}
            height={16}
          />
          <span className="text-xs font-medium">카카오 지도</span>
        </button>

        <button
          onClick={openTmap}
          className="flex items-center justify-center gap-1 bg-white p-2 text-primary border border-primary transition"
        >
          <Image
            src="/images/icons/ico_nav02.svg"
            alt="티맵"
            width={16}
            height={16}
          />
          <span className="text-xs font-medium">티맵</span>
        </button>
      </div>
    </div>
  );
}
