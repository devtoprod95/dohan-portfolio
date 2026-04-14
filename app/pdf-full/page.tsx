"use client";

import { useEffect } from 'react';
import Home from '../page';
import Portfolio from '../portfolio/page';
import Contact from '../contact/page';

export default function PdfFullPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const prefix = process.env.NEXT_PUBLIC_PREFIX || (window.location.hostname.includes('github.io') ? '/dohan-portfolio' : '');

  // 콘솔로 찍어보세요. 운영에서 이게 어떻게 나오는지 보는 게 제일 빠릅니다.
  console.log("Current Prefix:", prefix);

  return (
    <>
      {/* 💡 href 앞에도 prefix를 붙여줘야 배포 시 CSS를 제대로 긁어옵니다! */}
      <link rel="stylesheet" href={`${prefix}/css/pdf.css`} />

      <div className="pdf-container">
        <section id="print-home"><Home /></section>
        <section id="print-portfolio"><Portfolio /></section>
        <section id="print-contact"><Contact /></section>
      </div>
    </>
  );
}