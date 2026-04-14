"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const navbarCollapseRef = useRef<HTMLDivElement>(null);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ [해결 1] 페이지 경로(pathname)가 바뀌면 무조건 메뉴 닫기
  useEffect(() => {
    const collapseElement = navbarCollapseRef.current;
    if (collapseElement?.classList.contains('show')) {
      const bootstrap = require('bootstrap');
      const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) 
                      || new bootstrap.Collapse(collapseElement);
      bsCollapse.hide();
    }
  }, [pathname]);

  const isActive = (path: string) => {
    if (!pathname) return "";
    if (path === "/") return pathname === "/" ? "active" : "";
    return pathname.startsWith(path) ? "active" : "";
  };

  return (
    <nav 
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        scrolled ? "bg-dark shadow-sm py-2" : "bg-transparent py-3"
      }`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="container">
        <Link className="navbar-brand fw-extrabold text-white" href="/">
          KIM DOHAN<span className="text-primary">.</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          {/* ✅ [해결 2] 모바일에서 스크롤 시 간격이 튀지 않도록 상단 마진 고정 */}
          <ul className="navbar-nav ms-auto align-items-center mt-2 mt-lg-0">
            <li className="nav-item w-100 text-lg-start">
              <Link className={`nav-link px-3 py-2 ${isActive('/')}`} href="/">Main</Link>
            </li>
            <li className="nav-item w-100 text-lg-start">
              <Link className={`nav-link px-3 py-2 ${isActive('/portfolio')}`} href="/portfolio">Portfolio</Link>
            </li>
            <li className="nav-item w-100 text-lg-start">
              <Link className={`nav-link px-3 py-2 ${isActive('/contact')}`} href="/contact">Contact</Link>
            </li>
            {/* 버튼은 모바일에서 위 메뉴와 너무 붙지 않게만 조정 */}
            <li className="nav-item my-2 my-lg-0 ms-lg-3">
               <a href="https://github.com/devtoprod95" target="_blank" className="btn btn-sm btn-outline-light px-4">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}