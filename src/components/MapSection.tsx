"use client";

import { useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MapInfo } from "../types";

// Naver Maps API 타입 정의
declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Event: {
          addListener: (
            target: any,
            event: string,
            callback: () => void
          ) => void;
        };
        Position: {
          TOP_RIGHT: string;
        };
      };
    };
  }
}

interface MapSectionProps {
  mapInfo: MapInfo;
}

export default function MapSection({ mapInfo }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { title, address, latitude, longitude } = mapInfo;

  // 네이버 지도 초기화
  useEffect(() => {
    // 네이버 맵 스크립트 로드
    const loadNaverMap = () => {
      if (window.naver) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    // 지도 초기화 함수
    const initializeMap = () => {
      if (!mapRef.current || !window.naver) return;

      const location = new window.naver.maps.LatLng(latitude, longitude);
      const mapOptions = {
        center: location,
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);

      // 마커 추가
      const marker = new window.naver.maps.Marker({
        position: location,
        map: map,
        title: title,
      });

      // 정보창 추가
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;width:200px;text-align:center;">
            <h3 style="margin-bottom:5px;font-weight:bold;">${title}</h3>
            <p>${address}</p>
          </div>
        `,
      });

      // 마커 클릭 시 정보창 표시
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });

      // 초기에 정보창 표시
      infoWindow.open(map, marker);
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

  // 티맵 열기
  const openTmap = () => {
    window.open(
      `https://apis.openapi.sk.com/tmap/app/routes?appKey=${
        process.env.NEXT_PUBLIC_TMAP_APP_KEY
      }&name=${encodeURIComponent(title)}&lon=${longitude}&lat=${latitude}`,
      "_blank"
    );
  };

  return (
    <div>
      {/* 지도 */}
      <div
        ref={mapRef}
        className="w-full h-80 mb-6 rounded-lg overflow-hidden"
      ></div>

      {/* 지도 앱 버튼 */}
      <div className="grid grid-cols-3 gap-3 mt-8">
        <button
          onClick={openNaverMap}
          className="flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition"
        >
          <FaMapMarkerAlt className="text-green-500 text-xl mb-2" />
          <span className="text-sm text-gray-300">네이버 지도</span>
        </button>

        <button
          onClick={openKakaoMap}
          className="flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition"
        >
          <FaMapMarkerAlt className="text-yellow-500 text-xl mb-2" />
          <span className="text-sm text-gray-300">카카오 지도</span>
        </button>

        <button
          onClick={openTmap}
          className="flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition"
        >
          <FaMapMarkerAlt className="text-red-500 text-xl mb-2" />
          <span className="text-sm text-gray-300">티맵</span>
        </button>
      </div>
    </div>
  );
}
