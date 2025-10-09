"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { GuestbookEntry } from "../types";
import { FaPencilAlt } from "react-icons/fa";

// 브라우저 Web Crypto를 사용해 비밀번호를 SHA-256으로 해시합니다.
async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  // 연락처는 비활성화
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  // 연락처 검증 비활성화
  const [showVerify, setShowVerify] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "edit">("delete");
  const [showWrite, setShowWrite] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

  // 오버레이 열림 시 전체 스크롤 잠금 및 닫힐 때 복원 (useRef로 안정화)
  const scrollYRef = useRef(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldLock = showVerify || showWrite || showAllEntries;
    if (shouldLock) {
      scrollYRef.current = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      const y = scrollYRef.current;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [showVerify, showWrite, showAllEntries]);

  // 방명록 불러오기
  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(
        collection(db, "guestbook"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const entriesList: GuestbookEntry[] = [];

      querySnapshot.forEach((doc) => {
        entriesList.push({ id: doc.id, ...doc.data() } as GuestbookEntry);
      });

      setEntries(entriesList);
    };

    fetchEntries();
  }, []);

  // 방명록 추가/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !content || (!isEditing && !password)) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      if (isEditing && currentId) {
        // 수정: 비밀번호가 비어있으면 기존 해시 유지, 입력되면 새 해시 저장
        const existing = entries.find((e) => e.id === currentId);
        const newPasswordHash = password
          ? await hashString(password)
          : undefined;
        const passwordToSave = newPasswordHash ?? existing?.password ?? "";

        await updateDoc(doc(db, "guestbook", currentId), {
          name,
          content,
          password: passwordToSave,
          updatedAt: Date.now(),
        });
      } else {
        // 새 항목 추가
        const passwordHash = await hashString(password);
        await addDoc(collection(db, "guestbook"), {
          name,
          content,
          password: passwordHash,
          createdAt: Date.now(),
        });
      }

      // 폼 초기화
      setName("");

      setContent("");
      setPassword("");
      setIsEditing(false);
      setCurrentId("");
      setShowWrite(false);

      // 목록 새로고침
      const q = query(
        collection(db, "guestbook"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const entriesList: GuestbookEntry[] = [];

      querySnapshot.forEach((doc) => {
        entriesList.push({ id: doc.id, ...doc.data() } as GuestbookEntry);
      });

      setEntries(entriesList);
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 수정 모드 시작
  const startEdit = (entry: GuestbookEntry) => {
    setActionType("edit");
    setCurrentId(entry.id);
    setShowVerify(true);
  };

  // 삭제 확인
  const confirmDelete = (id: string) => {
    setActionType("delete");
    setCurrentId(id);
    setShowVerify(true);
  };

  // 비밀번호 확인
  const verifyUser = async () => {
    const entry = entries.find((e) => e.id === currentId);

    if (!entry) return;

    const verifyHash = await hashString(verifyPassword);
    if (entry.password === verifyHash) {
      if (actionType === "delete") {
        try {
          await deleteDoc(doc(db, "guestbook", currentId));
          setEntries(entries.filter((e) => e.id !== currentId));
          setShowVerify(false);
          setVerifyPassword("");
        } catch (error) {
          console.error("Error deleting document: ", error);
          alert("삭제 중 오류가 발생했습니다.");
        }
      } else if (actionType === "edit") {
        setName(entry.name);
        setContent(entry.content);
        setPassword("");
        setIsEditing(true);
        setShowVerify(false);
        setVerifyPassword("");
        // 스크롤 복원 후 수정 모달을 열기 위해 짧은 딜레이 추가
        setTimeout(() => {
          setShowWrite(true);
        }, 50);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="py-12 px-4">
      <p className="text-xs text-center text-primary-500 tracking-[0.2em]">
        GEUSTBOOK
      </p>
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary-500">
        방명록
      </h2>

      {/* 가로 스와이프 카드 리스트 - 최대 4개만 표시 */}
      <Swiper
        modules={[FreeMode]}
        freeMode
        slidesPerView="auto"
        spaceBetween={10}
        className="books-swiper"
      >
        {entries.slice(0, 4).map((entry) => (
          <SwiperSlide
            key={entry.id}
            style={{ width: "165px", height: "240px" }}
          >
            <div
              className="b bg-white overflow-hidden flex flex-col"
              style={{
                width: "165px",
                height: "240px",
                borderRadius: "5px",
                boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
                color: "#333",
                fontSize: "12px",
                lineHeight: "1.7",
                WebkitTextStroke: "0.2px",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <p className="top w-full flex justify-center bg-primary-100">
                <img
                  src="/images/icons/rose.png"
                  alt="decor"
                  className="h-10 object-contain py-1"
                />
              </p>
              <div className="flex-1 flex flex-col justify-between bg-primary-100 gap-3">
                <p className="px-3 pt-2 text-[12px] text-[#333] leading-[1.5] line-clamp-[7] overflow-hidden flex-1">
                  {entry.content}
                </p>
                <div className="bottom px-3 pb-2 text-end">
                  <span className="from text-[12px] text-secondary">
                    from. {entry.name}
                  </span>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => startEdit(entry)}
                        className="hover:underline text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => confirmDelete(entry.id)}
                        className="hover:underline text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* 작성하기 타일 */}
        <SwiperSlide style={{ width: "165px", height: "240px" }}>
          <button
            type="button"
            aria-label="방명록 작성하기"
            onClick={() => {
              setIsEditing(false);
              setCurrentId("");
              setName("");
              setPassword("");
              setContent("");
              setShowWrite(true);
            }}
            className="b bg-white active:scale-[0.98] transition-all flex items-center justify-center"
            style={{
              display: "flex",
              width: "165px",
              height: "240px",
              borderRadius: "5px",
              boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.05)",
              textAlign: "center",
              color: "#333",
              fontSize: "12px",
              border: "1px dashed rgba(178, 112, 133, 0.3)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <span className="text-center leading-snug">
              <FaPencilAlt className="text-xs mb-1 mx-auto text-primary-500" />
              <span className="block font-semibold text-xs text-primary-500">
                방명록 작성하기
              </span>
            </span>
          </button>
        </SwiperSlide>
      </Swiper>

      {entries.length === 0 && (
        <p className="text-center text-xs text-gray-500 py-8">
          아직 방명록이 없습니다. 첫 번째 메시지를 남겨보세요!
        </p>
      )}

      {/* 전체보기 & 방명록 작성 버튼 */}
      {entries.length > 0 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentId("");
              setName("");
              setPassword("");
              setContent("");
              setShowWrite(true);
            }}
            className="text-xs text-primary-500 hover:text-primary-700 font-medium"
          >
            작성하기
          </button>
          <button
            onClick={() => setShowAllEntries(true)}
            className="text-xs text-gray-400 hover:text-gray-900"
          >
            전체보기 →
          </button>
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {showVerify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900">
            <h3 className="text-lg font-bold mb-4">
              {actionType === "delete" ? "방명록 삭제" : "방명록 수정"}
            </h3>
            <p className="mb-4 text-sm">
              본인 확인을 위해 비밀번호를 입력해주세요.
            </p>

            {/* 연락처 입력 제거 */}

            <div className="mb-6">
              <label
                htmlFor="verifyPassword"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="verifyPassword"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowVerify(false);
                  setVerifyPassword("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={verifyUser}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 작성하기 오버레이 폼 */}
      {showWrite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900">
            <h3 className="text-lg font-bold mb-4">
              {isEditing ? "방명록 수정" : "방명록 작성"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* 연락처 입력 제거 */}

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
                  required={!isEditing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  * 수정/삭제 시 필요합니다
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-1 text-gray-700"
                >
                  내용
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWrite(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  {isEditing ? "수정하기" : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 전체 방명록 보기 오버레이 */}
      {showAllEntries && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white w-full h-screen flex flex-col">
            {/* 헤더 */}
            <div className="relative flex items-center justify-center p-4 border-b">
              <h3 className="text-base text-gray-900">
                방명록 (축하 글) 전체보기
              </h3>
              <button
                onClick={() => setShowAllEntries(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none w-4 h-4 flex items-center justify-center"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 방명록 리스트 */}
            <div className="flex-1 overflow-y-auto p-6 pb-28">
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-primary-50 rounded-lg p-5 border border-primary-200"
                  >
                    {/* 상단: 아이콘 */}
                    <div className="flex justify-center mb-3">
                      <img
                        src="/images/icons/rose.png"
                        alt="decor"
                        className="h-8 object-contain"
                      />
                    </div>

                    {/* 내용 */}
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap break-words">
                      {entry.content}
                    </p>

                    {/* 하단: 작성자 정보 */}
                    <div className="flex items-center justify-between pt-3 border-t border-primary-200">
                      <span className="text-sm font-semibold text-secondary">
                        from. {entry.name}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowAllEntries(false);
                              setTimeout(() => {
                                startEdit(entry);
                              }, 100);
                            }}
                            className="hover:underline text-blue-500"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => {
                              setShowAllEntries(false);
                              setTimeout(() => {
                                confirmDelete(entry.id);
                              }, 100);
                            }}
                            className="hover:underline text-red-500"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
