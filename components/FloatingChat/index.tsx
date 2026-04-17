"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChatDotsFill } from 'react-bootstrap-icons';
import { db, rtdb } from '@/lib/firebase';
import { 
  collection, query, orderBy, limit, onSnapshot, addDoc, 
  serverTimestamp, getDocs, startAfter
} from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbTimestamp } from "firebase/database";

import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';

/**
 * [컴포넌트 설명]
 * FloatingChat: 웹사이트 하단에 고정된 플로팅 채팅창 메인 컴포넌트입니다.
 * Firestore(채팅 데이터)와 Realtime DB(접속자 수 관리)를 모두 제어합니다.
 */
export default function FloatingChat() {
  // --- 상태 관리 (State) ---
  const [userId, setUserId] = useState<string>("");           // 사용자 고유 ID (로컬스토리지 저장용)
  const [mounted, setMounted] = useState(false);               // 클라이언트 사이드 렌더링 확인용
  const [show, setShow] = useState(false);                     // DOM 상의 채팅창 렌더링 여부
  const [visible, setVisible] = useState(false);               // 슬라이딩 애니메이션 활성화 여부
  const [myNickname, setMyNickname] = useState("");            // 사용자 닉네임
  const [messages, setMessages] = useState<any[]>([]);         // 가공된 채팅 메시지 리스트
  const [onlineCount, setOnlineCount] = useState(0);           // 현재 접속자 수
  const [inputValue, setInputValue] = useState("");            // 입력창 텍스트
  const [lastVisible, setLastVisible] = useState<any>(null);   // 무한 스크롤(과거 내역)용 마지막 문서 포인터
  const [loadingMore, setLoadingMore] = useState(false);       // 이전 대화 불러오기 중 로딩 상태
  const [isMobile, setIsMobile] = useState(false);             // 반응형 대응을 위한 모바일 여부
  const [hasMore, setHasMore] = useState(true);

  const initMsgCnt = 20;
  const reloadMsgCnt = 30;

  // --- 참조 관리 (Refs) ---
  const scrollRef = useRef<HTMLDivElement | null>(null);       // ChatBody의 스크롤 제어를 위한 Ref
  const touchStartY = useRef(0);

  // [함수: 스크롤 최하단 이동]
  // 새 메시지가 올 때나 채팅창을 열 때 가장 아래로 스크롤합니다.
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // [함수: 메시지 가공 로직]
  // 1. 중복 ID 제거 (Firestore 실시간 리스너 중복 방지)
  // 2. 같은 날짜 메시지는 첫 번째에만 날짜를 표시하도록 가공
  const processMessages = useCallback((rawMsgs: any[]) => {
    const uniqueMap = new Map();
    rawMsgs.forEach(msg => uniqueMap.set(msg.id, msg));
    const uniqueMsgs = Array.from(uniqueMap.values());

    return uniqueMsgs.map((msg, idx) => {
      // 이전 메시지와 날짜가 같으면 displayDate를 비워 채팅창 날짜 구분선을 방지
      const isSameDate = idx > 0 && uniqueMsgs[idx - 1].date === msg.date;
      return { ...msg, displayDate: isSameDate ? "" : msg.date };
    });
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.scrollBehavior = 'none';
    document.body.style.overflow = 'hidden';

    const handleGlobalWheel = (e: WheelEvent) => {
      if (scrollRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      scrollRef.current?.scrollBy({ top: e.deltaY, behavior: 'instant' });
    };

    // ✅ IIFE 제거, ref로 startY 관리
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      scrollRef.current?.scrollBy({ top: deltaY, behavior: 'instant' });
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleGlobalWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
    };
  }, [visible]); // ✅ scrollRef는 ref라 의존성 배열 불필요

  // [함수: 채팅창 열기/닫기]
  const handleOpen = useCallback(() => {
    setShow(true);
    // 상태 변경 후 DOM 반영 시간에 맞춘 부드러운 애니메이션 실행
    requestAnimationFrame(() => {
      scrollToBottom();
      requestAnimationFrame(() => setVisible(true));
    });
  }, [scrollToBottom]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => setShow(false), 400); // 애니메이션 시간(0.4s) 후 DOM에서 제거
  }, []);

  // [Effect: 초기화]
  // 사용자 고유 ID 생성, 닉네임 로드, 모바일 여부 감지
  useEffect(() => {
    if (typeof window !== 'undefined' && window?.location?.pathname.includes('/pdf-full')) {
      setMounted(false);
      return;
    }

    setMounted(true);
    
    // 로컬스토리지 기반 익명 ID 생성
    let savedId = localStorage.getItem("chat_user_id") || `user_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("chat_user_id", savedId);
    setUserId(savedId);

    // 로컬스토리지 기반 닉네임 로드
    let savedNickname = localStorage.getItem("chat_nickname") || `사용자_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem("chat_nickname", savedNickname);
    setMyNickname(savedNickname);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // [함수: 닉네임 업데이트]
  const updateNickname = useCallback((newNickname: string) => {
    setMyNickname(newNickname);
    localStorage.setItem("chat_nickname", newNickname);
  }, []);

  // [Effect: 접속자 수 관리 (Realtime DB)]
  // 사용자의 접속 상태를 RTDB에 기록하고, 전체 접속자 수를 구독합니다.
  useEffect(() => {
    if (!mounted || !userId || !myNickname) return;
    const myStatusRef = ref(rtdb, `status/${userId}`);
    
    // 서버와 연결 상태 확인
    onValue(ref(rtdb, ".info/connected"), (snap) => {
      if (snap.val() === true) {
        onDisconnect(myStatusRef).remove(); // 접속 끊기면 RTDB에서 정보 자동 제거
        set(myStatusRef, { lastChanged: rtdbTimestamp(), nickname: myNickname });
      }
    });

    // 전체 접속자 리스트 카운팅
    const statusRef = ref(rtdb, "status");
    const unsubscribe = onValue(statusRef, (snapshot) => setOnlineCount(snapshot.size || 0));
    return () => unsubscribe();
  }, [mounted, userId, myNickname]);

  // [Effect: 채팅 데이터 로드 및 실시간 구독 (Firestore)]
  useEffect(() => {
    if (!mounted || !userId) return;

    // 1. 초기 20개 메시지 로드
    const initLoad = async () => {
      const initQ = query(collection(db, "chats"), orderBy("timestamp", "desc"), limit(initMsgCnt));
      const snapshot = await getDocs(initQ);
      if (!snapshot.empty) {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isMe: doc.data().userId === userId
        })).reverse();
        setMessages(processMessages(msgs));
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // 과거 내역 불러오기용 포인트
        requestAnimationFrame(scrollToBottom);
      }
    };
    initLoad();

    // 2. 실시간 새 메시지 감지 리스너
    const realtimeQ = query(collection(db, "chats"), orderBy("timestamp", "desc"), limit(1));
    let isFirst = true; // 초기 로드와 겹치지 않게 하기 위한 플래그
    const unsubscribe = onSnapshot(realtimeQ, (snapshot) => {
      if (isFirst) { isFirst = false; return; }
      const newMsgs = snapshot.docChanges()
        .filter(change => change.type === 'added')
        .map(change => ({
          id: change.doc.id,
          ...change.doc.data(),
          isMe: change.doc.data().userId === userId
        }));

      if (newMsgs.length > 0) {
        setMessages(prev => processMessages([...prev, ...newMsgs]));
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => unsubscribe();
  }, [mounted, userId, scrollToBottom, processMessages]);

  // [함수: 무한 스크롤 (이전 메시지 로드)]
  const fetchMoreMessages = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    setLoadingMore(true);
    const prevScrollHeight = scrollRef.current?.scrollHeight || 0;
    
    // 마지막 문서 이후로 10개 더 가져오기
    const nextQ = query(collection(db, "chats"), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(reloadMsgCnt));
    const snapshot = await getDocs(nextQ);
    
    if (snapshot.empty || snapshot.docs.length < reloadMsgCnt) {
      setHasMore(false);
    }
    
    if (!snapshot.empty) {
      const olderMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isMe: doc.data().userId === userId
      })).reverse();
      
      setMessages(prev => processMessages([...olderMsgs, ...prev]));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      
      // 스크롤 위치 유지 (갑자기 아래로 튀는 현상 방지)
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
        }
      });
    }
    setLoadingMore(false);
  }, [lastVisible, loadingMore, userId, processMessages, reloadMsgCnt]);

  // [함수: 메시지 전송]
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    const now = new Date();
    setInputValue("");
    
    const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    await addDoc(collection(db, "chats"), {
      userId,
      sender: myNickname,
      text,
      timestamp: serverTimestamp(),
      date: dateStr,
      time: timeStr,
    });
  }, [inputValue, userId, myNickname]);

  // --- 스타일 정의 (Memoization으로 불필요한 재계산 방지) ---
  const offcanvasStyle = useMemo<React.CSSProperties>(() => ({
    position: 'fixed', top: 0, left: 0,
    width: isMobile ? '90vw' : '50vw',
    maxWidth: isMobile ? 'none' : '500px',
    height: '100vh', backgroundColor: '#fff', zIndex: 11000,
    transform: visible ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    display: 'flex', flexDirection: 'column',
    boxShadow: '10px 0 30px rgba(0,0,0,0.15)', overflow: 'hidden',
    overscrollBehavior: 'contain', // ✅ 채팅창 끝에 도달했을 때 배경이 흔들리는 현상 방지
  }), [visible, isMobile]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. 플로팅 실행 버튼 */}
      <div className="position-fixed bottom-0 start-0 d-flex flex-column align-items-start p-3" style={{ zIndex: 9999 }}>
        <button className="btn btn-primary rounded-pill shadow-lg d-flex align-items-center px-4" onClick={handleOpen} style={{ height: '55px', border: 'none' }}>
          <ChatDotsFill className="me-2" size={18} />
          <span className="fw-bold">커피톡</span>
        </button>
      </div>

      {/* 2. 배경 오버레이 (클릭 시 닫힘) */}
      {/* 배경 오버레이 (클릭 시 닫힘) */}
      <div 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 10999,
          opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          touchAction: 'none'
        }} 
      />

      {/* 3. 사이드 채팅창 본체 */}
      <div style={offcanvasStyle}>
        <ChatHeader 
          myNickname={myNickname} 
          onlineCount={onlineCount} 
          onClose={handleClose} 
          setMyNickname={updateNickname}
        />
        {/* ChatBody를 flex 컨테이너로 감싸 토스트 메시지 중앙 정렬 보장 */}
        <div className="flex-grow-1 position-relative overflow-hidden d-flex flex-column">
          <ChatBody 
            messages={messages} 
            myNickname={myNickname} 
            scrollRef={scrollRef} 
            onLoadMore={fetchMoreMessages} 
            loadingMore={loadingMore} 
            hasMore={hasMore}
          />
        </div>
        <ChatInput 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </>
  );
}