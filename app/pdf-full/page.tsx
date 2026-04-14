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

  return (
    <>
      {/* 💡 href 앞에도 prefix를 붙여줘야 배포 시 CSS를 제대로 긁어옵니다! */}
      <link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_PREFIX}/css/pdf.css`} />

      <div className="pdf-container">
        <section id="print-home"><Home /></section>
        <section id="print-portfolio"><Portfolio /></section>
        <section id="print-contact"><Contact /></section>
      </div>
    </>
  );
}