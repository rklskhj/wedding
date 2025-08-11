"use client";

import { useState, useEffect } from "react";
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

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyContact, setVerifyContact] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "edit">("delete");

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

  // 방명록 추가
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !contact || !content || !password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      if (isEditing && currentId) {
        // 수정
        await updateDoc(doc(db, "guestbook", currentId), {
          name,
          contact,
          content,
          password,
          updatedAt: Date.now(),
        });
      } else {
        // 새 항목 추가
        await addDoc(collection(db, "guestbook"), {
          name,
          contact,
          content,
          password,
          createdAt: Date.now(),
        });
      }

      // 폼 초기화
      setName("");
      setContact("");
      setContent("");
      setPassword("");
      setIsEditing(false);
      setCurrentId("");

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

  // 비밀번호 및 연락처 확인
  const verifyUser = async () => {
    const entry = entries.find((e) => e.id === currentId);

    if (!entry) return;

    if (entry.password === verifyPassword && entry.contact === verifyContact) {
      if (actionType === "delete") {
        try {
          await deleteDoc(doc(db, "guestbook", currentId));
          setEntries(entries.filter((e) => e.id !== currentId));
          setShowVerify(false);
          setVerifyPassword("");
          setVerifyContact("");
        } catch (error) {
          console.error("Error deleting document: ", error);
          alert("삭제 중 오류가 발생했습니다.");
        }
      } else if (actionType === "edit") {
        setName(entry.name);
        setContact(entry.contact);
        setContent(entry.content);
        setPassword(entry.password);
        setIsEditing(true);
        setShowVerify(false);
        setVerifyPassword("");
        setVerifyContact("");
      }
    } else {
      alert("비밀번호 또는 연락처가 일치하지 않습니다.");
    }
  };

  // 연락처 마스킹 함수
  const maskContact = (contact: string) => {
    if (!contact || contact.length < 4) return contact;
    return contact.slice(0, -4) + "****";
  };

  return (
    <div className="py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">방명록</h2>

      {/* 방명록 작성 폼 */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contact" className="block text-sm font-medium mb-1">
            연락처
          </label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            * 수정/삭제 시 필요합니다
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            * 수정/삭제 시 필요합니다
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          {isEditing ? "수정하기" : "등록하기"}
        </button>
      </form>

      {/* 방명록 목록 */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{entry.name}</h3>
              <div className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {maskContact(entry.contact)}
            </p>
            <p className="mb-4">{entry.content}</p>
            <div className="flex justify-end space-x-2 text-sm">
              <button
                onClick={() => startEdit(entry)}
                className="text-blue-500 hover:underline"
              >
                수정
              </button>
              <button
                onClick={() => confirmDelete(entry.id)}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            아직 방명록이 없습니다. 첫 번째 메시지를 남겨보세요!
          </p>
        )}
      </div>

      {/* 비밀번호 확인 모달 */}
      {showVerify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {actionType === "delete" ? "방명록 삭제" : "방명록 수정"}
            </h3>
            <p className="mb-4 text-sm">
              본인 확인을 위해 연락처와 비밀번호를 입력해주세요.
            </p>

            <div className="mb-4">
              <label
                htmlFor="verifyContact"
                className="block text-sm font-medium mb-1"
              >
                연락처
              </label>
              <input
                type="text"
                id="verifyContact"
                value={verifyContact}
                onChange={(e) => setVerifyContact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="verifyPassword"
                className="block text-sm font-medium mb-1"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="verifyPassword"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowVerify(false);
                  setVerifyPassword("");
                  setVerifyContact("");
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
    </div>
  );
}
