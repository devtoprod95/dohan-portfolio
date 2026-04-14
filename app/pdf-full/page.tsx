"use client";

import { useState, useEffect } from 'react';
import Home from '../page';
import Portfolio from '../portfolio/page';
import Contact from '../contact/page';

export default function PdfFullPage() {
  // 1. 초기값을 빈 문자열로 설정하여 서버 렌더링 시 에러 방지
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    // 2. 브라우저 마운트 후에만 실행되므로 window 객체에 안전하게 접근 가능
    const currentPrefix = process.env.NEXT_PUBLIC_PREFIX || 
                         (window.location.hostname.includes('github.io') ? '/dohan-portfolio' : '');
    
    setPrefix(currentPrefix);
    console.log("Current Prefix (Client-side):", currentPrefix);

    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 3. prefix가 설정된 후 올바른 경로로 CSS를 불러옴 */}
      {prefix !== undefined && (
        <link rel="stylesheet" href={`${prefix}/css/pdf.css`} />
      )}

      <div className="pdf-container">
        <section id="print-home"><Home /></section>
        <section id="print-portfolio"><Portfolio /></section>
        <section id="print-contact"><Contact /></section>
      </div>
    </>
  );
}