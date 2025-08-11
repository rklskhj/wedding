"use client";

import { AccountInfo } from "../../types";

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
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-medium text-center mb-8">마음 전하실 곳</h2>

      <div className="mb-10">
        <h3 className="text-center font-medium mb-4">🤵🏻‍♂️ 신랑측 계좌번호</h3>
        {accounts.groom.map((account, index) => (
          <div key={index} className="bg-zinc-900 p-4 rounded-lg mb-4">
            <p className="text-sm mb-1">
              {account.bank} {account.number}
            </p>
            <p className="text-sm mb-2">{account.holder}</p>
            <button
              className="w-full py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition"
              onClick={() => onCopy(account.number)}
            >
              복사하기
            </button>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h3 className="text-center font-medium mb-4">👰🏻‍♀️ 신부측 계좌번호</h3>
        {accounts.bride.map((account, index) => (
          <div key={index} className="bg-zinc-900 p-4 rounded-lg mb-4">
            <p className="text-sm mb-1">
              {account.bank} {account.number}
            </p>
            <p className="text-sm mb-2">{account.holder}</p>
            <button
              className="w-full py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition"
              onClick={() => onCopy(account.number)}
            >
              복사하기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
