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

// 계좌 정보 타입 정의
export interface AccountInfo {
  bank: string;
  number: string;
  holder: string;
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
