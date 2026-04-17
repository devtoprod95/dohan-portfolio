"use client";

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'react-bootstrap-icons';

export default function ScrollButtons() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // 1. 최상단일 때 Up 버튼 숨김 (10px 여유)
      setShowUp(scrollY > 10);

      // 2. 최하단일 때 Down 버튼 숨김 (바닥에서 10px 여유)
      // 현재위치 + 화면높이가 전체 높이와 거의 같으면 바닥임
      setShowDown(scrollY + clientHeight < scrollHeight - 10);
    };

    window.addEventListener('scroll', handleScroll);
    // 초기 실행 (처음 로드 시 상태 반영)
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (top: boolean) => 
    window.scrollTo({ top: top ? 0 : document.body.scrollHeight, behavior: 'smooth' });

  const btnBase = { 
    width: '50px', height: '50px', borderRadius: '50%', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'opacity 0.3s ease, transform 0.3s ease' // 부드러운 등장 효과
  };

  return (
    <div className="position-fixed bottom-0 end-0 d-flex flex-column align-items-end p-3 no-print" style={{ zIndex: 9999 }}>
      {/* Up 버튼: showUp이 true일 때만 렌더링 */}
      <button 
        onClick={() => scroll(true)} 
        className="mb-2" 
        style={{ 
          ...btnBase, 
          backgroundColor: 'var(--primary-color)',
          opacity: showUp ? 1 : 0,
          pointerEvents: showUp ? 'auto' : 'none',
          transform: showUp ? 'scale(1)' : 'scale(0.8)'
        }}>
        <ArrowUp size={24} color="#fff" />
      </button>

      {/* Down 버튼: showDown이 true일 때만 렌더링 */}
      <button 
        onClick={() => scroll(false)} 
        style={{ 
          ...btnBase, 
          backgroundColor: 'var(--sub-color)',
          opacity: showDown ? 1 : 0,
          pointerEvents: showDown ? 'auto' : 'none',
          transform: showDown ? 'scale(1)' : 'scale(0.8)'
        }}>
        <ArrowDown size={24} color="#fff" />
      </button>
    </div>
  );
}