import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Analytics는 브라우저 환경에서만 활성화
// import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Firebase 설정
// 실제 값은 환경 변수로 관리하는 것이 좋습니다
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화 (중복 초기화 방지)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 선택: 브라우저에서만 Analytics 사용 (필요 시 주석 해제)
// let analytics: Analytics | null = null;
// if (typeof window !== 'undefined') {
//   isSupported()
//     .then((supported) => {
//       if (supported) {
//         analytics = getAnalytics(app);
//       }
//     })
//     .catch(() => {
//       // noop
//     });
// }

export { app, db, storage }; 