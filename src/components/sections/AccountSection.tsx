"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { AccountInfo } from "../../types";
import Image from "next/image";

interface AccountSectionProps {
  accounts: {
    groom: AccountInfo[];
    bride: AccountInfo[];
  };
  onCopy: (text: string) => void;
}

export default function AccountSection({
  accounts,
  onCopy,
}: AccountSectionProps) {
  const [selected, setSelected] = useState<"groom" | "bride">("groom");
  const selectedAccounts: AccountInfo[] =
    selected === "groom" ? accounts.groom : accounts.bride;
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  // 토글 변경 시 첫 슬라이드로 이동
  useEffect(() => {
    if (swiper) swiper.slideTo(0, 300);
  }, [selected, swiper]);

  return (
    <section className="py-8 px-4 bg-white border-t border-gray-200">
      <div className="flex flex-col gap-8 justify-center items-center mb-8">
        <div className=" w-[128px] h-8 bg-primary text-2xl font-medium font-presentation text-white text-center">
          마음 전하실 곳
        </div>
        <div className="text-sm text-secondary whitespace-pre-line text-center">
          참석이 어려우신 분들을 위해
          <br />
          계좌번호를 기재하였습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </div>
      </div>

      {/* 신랑/신부 라디오-스와이프 토글 */}
      <div className="flex justify-center mb-6" aria-label="계좌 선택">
        <div className="relative grid grid-cols-2 h-10 w-[220px] bg-[#f1f1f1] rounded-full overflow-hidden select-none">
          {/* 슬라이더 */}
          <span
            className={`absolute top-1 bottom-1 left-1 w-[48%] rounded-full bg-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
              selected === "groom" ? "translate-x-0" : "translate-x-full"
            }`}
          />

          {/* 라디오: 신랑 */}
          <input
            type="radio"
            id="acc_type_swipe-1"
            name="acc_type_swipe"
            className="sr-only"
            checked={selected === "groom"}
            onChange={() => setSelected("groom")}
          />
          <label
            htmlFor="acc_type_swipe-1"
            className={`relative z-10 flex items-center justify-center text-sm cursor-pointer ${
              selected === "groom" ? "text-[#2a3954]" : "text-zinc-600"
            }`}
          >
            🤵🏻‍♂️신랑측
          </label>

          {/* 라디오: 신부 */}
          <input
            type="radio"
            id="acc_type_swipe-2"
            name="acc_type_swipe"
            className="sr-only"
            checked={selected === "bride"}
            onChange={() => setSelected("bride")}
          />
          <label
            htmlFor="acc_type_swipe-2"
            className={`relative z-10 flex items-center justify-center text-sm cursor-pointer ${
              selected === "bride" ? "text-[#2a3954]" : "text-zinc-600"
            }`}
          >
            👰🏻‍♀️신부측
          </label>
        </div>
      </div>

      {/* 캐러셀: Swiper 사용 (PC 드래그/휠, 모바일 스와이프 자연스러움) */}
      <Swiper
        id="account-carousel"
        modules={[Mousewheel]}
        onSwiper={setSwiper}
        slidesPerView="auto"
        spaceBetween={16}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
          sensitivity: 0.8,
        }}
        centeredSlides={false}
        threshold={5}
        longSwipesRatio={0.25}
        speed={350}
        grabCursor
        slideToClickedSlide
        className="px-4"
      >
        {selectedAccounts.map((account, index) => (
          <SwiperSlide key={`${account.holder}-${index}`} className="!w-72">
            <div className="account-card flex flex-col justify-between gap-6 w-72 border border-gray-200 p-4 rounded-lg shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-2">
                <div className="text-secondary">
                  <p className="text-base font-medium">{account.holder}</p>
                </div>
                {/* 은행 + 계좌 + 복사 아이콘 한줄 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-secondary">
                    <Image
                      src={account.icon}
                      alt={account.bank}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                      unoptimized
                    />
                    <span className="text-lg">{account.bank}</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <span className="text-lg tracking-wider">
                      {account.number}
                    </span>
                    <button
                      type="button"
                      aria-label="계좌번호 복사"
                      onClick={() => onCopy(account.number)}
                      className="p-1 rounded hover:bg-zinc-100 active:opacity-80"
                      title="복사"
                    >
                      <img
                        src="/images/icons/copy.svg"
                        alt="복사"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 카카오페이 송금 or 복사 폴백 */}
              {account.kakaoPayUrl ? (
                <a
                  href={account.kakaoPayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 gap-2 rounded-lg text-sm text-secondary bg-[#f6cc00] hover:brightness-95 transition flex items-center justify-center"
                >
                  <img
                    src="/images/icons/kakao.svg"
                    alt="카카오페이"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  카카오페이로 송금
                </a>
              ) : (
                <button
                  className="w-full py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition text-white"
                  onClick={() => onCopy(account.number)}
                >
                  계좌번호 복사
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
