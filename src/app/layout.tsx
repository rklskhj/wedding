import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "김혁진❤️신진솔 결혼식에 초대합니다. 🤵🏻‍♂️👰🏻‍♀️",
  description:
    "우리 결혼해요! 2025.11.09 SUN 02:00PM | 강서 더뉴컨벤션 1층 르노브홀",
  openGraph: {
    title: "김혁진❤️신진솔 결혼식에 초대합니다. 🤵🏻‍♂️👰🏻‍♀️",
    description:
      "우리 결혼해요! 2025.11.09 SUN 02:00PM | 강서 더뉴컨벤션 1층 르노브홀",
    images: [
      {
        url: "https://res.cloudinary.com/dckkqaxqm/image/upload/fl_preserve_transparency/v1759648113/we_so6um5.jpg?_s=public-apps",
        width: 1200,
        height: 630,
        alt: "김혁진❤️신진솔 결혼식 초대",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "김혁진❤️신진솔 결혼식에 초대합니다. 🤵🏻‍♂️👰🏻‍♀️",
    description:
      "우리 결혼해요! 2025.11.09 SUN 02:00PM | 강서 더뉴컨벤션 1층 르노브홀",
    images: [
      "https://res.cloudinary.com/dckkqaxqm/image/upload/fl_preserve_transparency/v1759648113/we_so6um5.jpg?_s=public-apps",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={notoSansKR.className}>
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
