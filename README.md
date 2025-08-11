# 모바일 청첩장 프로젝트

Next.js와 TypeScript를 사용한 모바일 청첩장 웹 애플리케이션입니다.

## 기능

- 반응형 모바일 웹 디자인
- 배경 음악 재생 및 컨트롤
- 이미지 갤러리 (그리드 형태로 표시, 클릭 시 확대 및 슬라이드 기능)
- 비디오 플레이어
- 네이버 지도 통합
- 방명록 기능 (작성, 수정, 삭제)
- Firebase 데이터베이스 연동

## 시작하기

### 필요 조건

- Node.js 18.0.0 이상
- npm 또는 yarn
- Firebase 계정

### 설치

1. 저장소를 클론합니다:

```bash
git clone https://github.com/yourusername/mobile-wedding-invitation.git
cd mobile-wedding-invitation
```

2. 의존성을 설치합니다:

```bash
npm install
# 또는
yarn install
```

3. `.env.local` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# 네이버 지도 API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your-naver-map-client-id

# 티맵 API
NEXT_PUBLIC_TMAP_APP_KEY=your-tmap-app-key
```

4. 개발 서버를 실행합니다:

```bash
npm run dev
# 또는
yarn dev
```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 배포

이 프로젝트는 Vercel, Netlify 또는 다른 정적 호스팅 서비스에 쉽게 배포할 수 있습니다.

### Vercel 배포

```bash
npm install -g vercel
vercel
```

## 프로젝트 구조

```
mobile-wedding-invitation/
├── public/
│   ├── images/
│   │   ├── gallery/
│   │   └── main-bg.jpg
│   └── audio/
│       └── wedding-bgm.mp3
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── Guestbook.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── MapSection.tsx
│   │   └── VideoPlayer.tsx
│   ├── hooks/
│   ├── lib/
│   │   └── firebase.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   └── styles/
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 향후 계획

- 백오피스 또는 빌더 시스템 추가
- 사용자 커스터마이징 기능
- 다양한 테마 옵션

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
