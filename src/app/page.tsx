"use client";

import { useState } from "react";
import { MapInfo } from "../types";

// 분리된 섹션 컴포넌트들 가져오기
import HeaderSection from "../components/sections/HeaderSection";
import GallerySection from "../components/sections/GallerySection";
import MapSection from "../components/sections/MapSection";
import TransportSection from "../components/sections/TransportSection";
import AccountSection from "../components/sections/AccountSection";
import ShareSection from "../components/sections/ShareSection";
import FooterSection from "../components/sections/FooterSection";
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
    title: "더뉴컨벤션웨딩",
    address: "서울특별시 강서구 공항대로36길 57",
    latitude: 37.5563293, // 실제 위치로 변경 필요
    longitude: 126.8369315, // 실제 위치로 변경 필요
  };

  // 계좌번호 정보
  const accounts = {
    groom: [
      {
        bank: "농협",
        number: "302 0679 9584 41",
        holder: "안정환",
      },
      {
        bank: "카카오뱅크",
        number: "3333 05 0585629",
        holder: "안재진",
      },
    ],
    bride: [
      {
        bank: "농협",
        number: "723100 52 034771",
        holder: "권세광",
      },
      {
        bank: "카카오뱅크",
        number: "3333 03 7286312",
        holder: "권정은",
      },
    ],
  };

  // 교통 정보
  const transportInfo = {
    bus: "🚌 버스\n문래역 정류장 하차\n간선: 641, 지선: 6211, 6625, 마을버스: 영등포12",
    subway:
      "🚊 지하철\n2호선 문래역 하차\n5번출구에서 전방 직진 300M\n4번출구(뒷쪽) 셔틀버스 5분 단위 운행",
    coach:
      "🚎 고속버스\n서울고속버스터미널에서 오는 법\n: 서울고속버스터미널 하차>9호선 탑승(동작역방면)>당산역하차>2호선 환승(영등포구청역 방면)>문래역 하차>4번 출구(뒷쪽) 셔틀버스 승차(5분 단위 운행)",
  };

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // 계좌번호 복사 함수
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert("계좌번호가 복사되었습니다."),
        () => alert("복사에 실패했습니다. 다시 시도해주세요.")
      );
      return;
    }
    // fallback
    const temp = document.createElement("textarea");
    temp.value = text;
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

  // 청첩장 URL 복사 함수
  const copyInvitationUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // 카카오톡 공유하기
  const shareKakao = () => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // 카카오 SDK 초기화 필요 (실제 앱키로 변경 필요)
        window.Kakao.init("YOUR_KAKAO_APP_KEY");
      }

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${weddingInfo.groomName} ♥ ${weddingInfo.brideName} 결혼식에 초대합니다`,
          description: `${weddingInfo.date} ${weddingInfo.day} ${weddingInfo.time} | ${weddingInfo.location}`,
          imageUrl: "https://your-domain.com/images/main-bg.jpg",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert("카카오톡 SDK가 로드되지 않았습니다.");
    }
  };

  if (isLoading) {
    return (
      <SplashOverlay
        slides={[
          {
            bgImageSrc: "/images/gallery1.png",
            // fgImageSrc: "/images/we_bg.png",
            durationMs: 1000,
          },
          {
            bgImageSrc: "/images/gallery2.png",
            // fgImageSrc: "/images/we_bg.png",
            durationMs: 1000,
          },
        ]}
        onFinish={() => setIsLoading(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-[448px] mx-auto bg-basic">
        {/* 헤더 섹션 */}
        <HeaderSection weddingInfo={weddingInfo} />

        {/* 갤러리 섹션 */}
        <GallerySection images={[]} title="" />

        {/* 장소 섹션 */}
        <MapSection mapInfo={mapInfo} onCopyAddress={copyAddressToClipboard} />

        {/* 교통 정보 섹션 */}
        <TransportSection transportInfo={transportInfo} />

        {/* 계좌번호 섹션 */}
        <AccountSection accounts={accounts} onCopy={copyToClipboard} />

        {/* 공유하기 섹션 */}
        <ShareSection
          onShareKakao={shareKakao}
          onCopyUrl={copyInvitationUrl}
          copySuccess={copySuccess}
        />
        {/* 스크롤 탑 버튼 */}
        <ScrollTopButton />
        {/* 푸터 */}
        <FooterSection />
      </div>
    </div>
  );
}
