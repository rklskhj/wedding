import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "김혁진 & 신진솔 결혼식에 초대합니다",
  description: "2025.11.09 SUN 02:00PM | 프로젝트 프로젝트 스튜디오",
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
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={notoSansKR.className}>
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          integrity="sha384-kYPsUbBPlktVQK6mUOcZUT20oitlPwAb5KhGI21BRdHIgQKFQtYwAzC+XwKYs0D"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
