"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const navbarCollapseRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null); // 외부 클릭 감지용

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const collapseElement = navbarCollapseRef.current;
    if (collapseElement) {
      const bootstrap = require('bootstrap');
      const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) 
                      || new bootstrap.Collapse(collapseElement);
      bsCollapse.toggle(); // show/hide를 번갈아가며 실행
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const collapseElement = navbarCollapseRef.current;
      if (
        collapseElement?.classList.contains('show') && 
        navRef.current && !navRef.current.contains(event.target as Node)
      ) {
        const bootstrap = require('bootstrap');
        const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) 
                        || new bootstrap.Collapse(collapseElement);
        bsCollapse.hide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      ref={navRef} // 외부 클릭 감지를 위해 추가
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        scrolled ? "bg-dark shadow-sm py-2" : "bg-transparent py-3"
      }`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="container">
        <Link className="navbar-brand fw-extrabold text-white" href="/">
          KIM DOHAN<span className="text-primary">.</span>
        </Link>
        
        {/* ✅ [수정] data-bs-toggle 대신 onClick 토글 함수 사용 */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          {/* ✅ [해결 2] 모바일에서 스크롤 시 간격이 튀지 않도록 상단 마진 고정 */}
          <ul className="navbar-nav mx-auto align-items-center mt-2 mt-lg-0">
            <li className="nav-item w-100 text-center text-lg-start ms-0">
              <Link className={`nav-link px-3 py-2 ${isActive('/')}`} href="/">Main</Link>
            </li>
            <li className="nav-item w-100 text-center text-lg-start ms-0">
              <Link className={`nav-link px-3 py-2 ${isActive('/portfolio')}`} href="/portfolio">Portfolio</Link>
            </li>
            <li className="nav-item w-100 text-center text-lg-start ms-0">
              <Link className={`nav-link px-3 py-2 ${isActive('/contact')}`} href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}