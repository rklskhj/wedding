"use client";

import { FiCopy } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import Button from "../ui/Button";

interface ShareSectionProps {
  onShareKakao: () => void;
  onCopyUrl: () => void;
  copySuccess: boolean;
}

export default function ShareSection({
  onShareKakao,
  onCopyUrl,
  copySuccess,
}: ShareSectionProps) {
  return (
    <section className="py-8 px-4 border-t border-zinc-800">
      <div className="flex justify-center w-full">
        <Button
          onClick={onShareKakao}
          variant="secondary"
          fullWidth
          className="flex items-center justify-center space-x-2 bg-[#FEE500] text-black"
        >
          <RiKakaoTalkFill size={20} />
          <span>카카오톡 공유하기</span>
        </Button>
      </div>

      <Button
        onClick={onCopyUrl}
        variant="primary"
        fullWidth
        className="flex items-center justify-center space-x-2 mt-4"
      >
        <FiCopy size={18} />
        <span>청첩장 주소 복사하기</span>
      </Button>

      {copySuccess && (
        <p className="text-center text-green-500 mt-2">URL이 복사되었습니다!</p>
      )}
    </section>
  );
}
