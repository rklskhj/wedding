// 방명록 타입 정의
export interface GuestbookEntry {
  id: string;
  name: string;
  contact: string;
  content: string;
  password: string;
  createdAt: number;
}

// 이미지 갤러리 타입 정의
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

// 지도 정보 타입 정의
export interface MapInfo {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

// 웨딩 정보 타입 정의
export interface WeddingInfo {
  groomName: string;
  brideName: string;
  date: string;
  day: string;
  time: string;
  location: string;
  address: string;
  groomParents: {
    father: string;
    mother: string;
  };
  brideParents: {
    father: string;
    mother: string;
  };
}

// 교통 정보 타입 정의
export interface TransportBadge {
  label: string; // 표시 라벨 (예: "5호선", "간선")
  color: string; // HEX 색상 (예: "#996CAC")
}

export interface TransportBusCategory {
  label: string; // "간선", "지선", "공항버스"
  color: string; // 카테고리 색상
  routes: string[]; // 노선 번호 목록
}

export interface TransportInfo {
  subway: {
    title: string; // 안내 문구
    badges: TransportBadge[];
  };
  bus: {
    title: string; // 안내 문구
    categories: TransportBusCategory[];
  };
  car: string[]; // 자가용 안내 문구 라인 배열
}

// 계좌 정보 타입 정의
export interface AccountInfo {
  icon: string;
  bank: string;
  number: string;
  holder: string;
  kakaoPayUrl?: string;
}

// 카카오 공유 옵션 타입 정의
export interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}
