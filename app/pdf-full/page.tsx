"use client";

import { useEffect } from 'react';
import Home from '../page';
import Portfolio from '../portfolio/page';
import Contact from '../contact/page';
import '@/styles/pdf.css';

export default function PdfFullPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>

      <div className="pdf-container">
        <section id="print-home"><Home /></section>
        <section id="print-portfolio"><Portfolio /></section>
        <section id="print-contact"><Contact /></section>
      </div>
    </>
  );
}