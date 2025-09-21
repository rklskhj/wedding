"use client";

import { useState } from "react";
import { MapInfo } from "../types";

// 분리된 섹션 컴포넌트들 가져오기
import HeaderSection from "../components/sections/HeaderSection";
import GallerySection from "../components/sections/GallerySection";
import MapSection from "../components/sections/MapSection";
import CalendarSection from "../components/sections/CalendarSection";
import TransportSection from "../components/sections/TransportSection";
import AccountSection from "../components/sections/AccountSection";
import ShareSection from "../components/sections/ShareSection";
import FooterSection from "../components/sections/FooterSection";
import CountdownSection from "../components/sections/CountdownSection";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import SplashOverlay from "@/components/SplashOverlay";

export default function Home() {
  // 웨딩 정보
  const weddingInfo = {
    groomName: "김혁진",
    brideName: "신진솔",
    date: "2025.11.09",
    day: "SUN",
    time: "02:00PM",
    location: "프로젝트 프로젝트 스튜디오",
    address: "서울특별시 마포구 월드컵북로 15길23",
    groomParents: {
      father: "김혁진",
      mother: "",
    },
    brideParents: {
      father: "신진솔",
      mother: "",
    },
  };

  const mapInfo: MapInfo = {
    title: "더뉴컨벤션웨딩, 1층 르노브홀 \n Tel. 1661-3303",
    address: "서울특별시 강서구 공항대로36길 57",
    latitude: 37.5563293, // 실제 위치로 변경 필요
    longitude: 126.8369315, // 실제 위치로 변경 필요
  };

  // 계좌번호 정보
  const accounts = {
    groom: [
      {
        icon: "/images/icons/sh.svg",
        bank: "신한은행",
        number: "110-314-737600",
        holder: "김혁진",
        kakaoPayUrl: "https://qr.kakaopay.com/Ej8dKHJkp",
      },
      {
        icon: "/images/icons/hana.svg",
        bank: "하나은행",
        number: "118-18-18294-7",
        holder: "김영복",
      },
      {
        icon: "/images/icons/hana.svg",
        bank: "하나은행",
        number: "179-910-190-31307",
        holder: "이미경",
      },
    ],
    bride: [
      {
        icon: "/images/icons/kb.svg",
        bank: "국민은행",
        number: "442802-01-330054",
        holder: "신진솔",
        kakaoPayUrl: "https://qr.kakaopay.com/FOteCSsKH",
      },
      {
        icon: "/images/icons/nh.svg",
        bank: "농협은행",
        number: "100093-56-061278",
        holder: "이상금",
      },
    ],
  };

  // 교통 정보
  const transportInfo = {
    subway: {
      title: "5호선 발산역 4번 출구 도보 약 3분 거리",
      badges: [
        {
          label: "5호선",
          color: "#996CAC",
        },
      ],
    },
    bus: {
      title: "발산역 정류장 하차",
      categories: [
        {
          label: "간선",
          color: "#1E90FF", // 블루 계열
          routes: ["601", "605", "661"],
        },
        {
          label: "지선",
          color: "#32CD32", // 그린 계열
          routes: ["6627", "6642"],
        },
        {
          label: "공항버스",
          color: "#FFA500", // 오렌지 계열
          routes: ["6003", "6008"],
        },
      ],
    },
    car: [
      "강서구청 인근, 발산역 사거리 위치",
      "웨딩홀 전용 주차장 및 이대서울병원주차장 완비 \n (하객 무료 주차 가능)",
    ],
  };

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  // 계좌번호 복사 함수
  const copyToClipboard = (text: string) => {
    // 하이픈, 공백 등 모든 비숫자 문자 제거
    const sanitized = text.replace(/[^0-9]/g, "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sanitized).then(
        () => alert("계좌번호가 복사되었습니다."),
        () => alert("복사에 실패했습니다. 다시 시도해주세요.")
      );
      return;
    }
    // fallback
    const temp = document.createElement("textarea");
    temp.value = sanitized;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      alert("계좌번호가 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다. 다시 시도해주세요.");
    } finally {
      document.body.removeChild(temp);
    }
  };

  // 주소 복사 함수 (MapSection 전용)
  const copyAddressToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert("주소가 복사되었습니다."),
        () => alert("복사에 실패했습니다. 다시 시도해주세요.")
      );
      return;
    }
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      alert("주소가 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다. 다시 시도해주세요.");
    } finally {
      document.body.removeChild(temp);
    }
  };

  // 청첩장 URL 복사 함수 (alert 알림)
  const copyInvitationUrl = () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => alert("URL이 복사되었습니다!"),
        () => alert("복사에 실패했습니다. 다시 시도해주세요.")
      );
      return;
    }
    const temp = document.createElement("textarea");
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      alert("URL이 복사되었습니다!");
    } catch {
      alert("복사에 실패했습니다. 다시 시도해주세요.");
    } finally {
      document.body.removeChild(temp);
    }
  };

  // 카카오톡 공유하기
  const shareKakao = () => {
    if (!window.Kakao) {
      alert("카카오톡 SDK가 로드되지 않았습니다.");
      return;
    }
    if (!window.Kakao.isInitialized()) {
      const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!appKey) {
        alert("Kakao 앱 키가 설정되지 않았습니다.");
        return;
      }
      window.Kakao.init(appKey);
    }

    const currentUrl = window.location.href;
    const imageUrl = `${window.location.origin}/images/we.webp`;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${weddingInfo.groomName} ♥ ${weddingInfo.brideName} 결혼식에 초대합니다`,
        description: `${weddingInfo.date} ${weddingInfo.day} ${weddingInfo.time} | ${weddingInfo.location}`,
        imageUrl,
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <SplashOverlay
        slides={[
          {
            bgImageSrc: "/images/gallery1.webp",
            durationMs: 1800,
          },
          {
            bgImageSrc: "/images/gallery2.webp",
            durationMs: 1800,
          },
        ]}
        crossfadeMs={800}
        onFinish={() => setIsLoading(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-white flex flex-col items-center">
      <div className="w-full max-w-[390px] mx-auto bg-white">
        {/* 헤더 섹션 */}
        <HeaderSection weddingInfo={weddingInfo} />

        {/* 갤러리 섹션 */}
        <GallerySection images={[]} title="" />

        {/* 달력 섹션 */}
        <CalendarSection />
        {/* 카운트다운 섹션 */}
        <CountdownSection
          targetDate="2025-11-09T14:00:00+09:00"
          coupleName="혁진, 진솔"
        />
        {/* 장소 섹션 */}
        <MapSection mapInfo={mapInfo} onCopyAddress={copyAddressToClipboard} />

        {/* 교통 정보 섹션 */}
        <TransportSection transportInfo={transportInfo} />

        {/* 계좌번호 섹션 */}
        <AccountSection accounts={accounts} onCopy={copyToClipboard} />

        {/* 공유하기 섹션 */}
        <ShareSection onShareKakao={shareKakao} onCopyUrl={copyInvitationUrl} />
        {/* 스크롤 탑 버튼 */}
        <ScrollTopButton />
        {/* 푸터 */}
        <FooterSection />
      </div>
    </div>
  );
}
