"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤이 조금이라도 내려가면 배경색 적용
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return "";
    if (path === "/") return pathname === "/" ? "active" : "";
    return pathname.startsWith(path) ? "active" : "";
  };

  return (
    <nav 
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        scrolled ? "bg-dark shadow-sm" : "bg-transparent"
      }`}
      style={{ 
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        paddingTop: '1rem',    // py-3 수준으로 고정
        paddingBottom: '1rem'  // py-3 수준으로 고정
      }}
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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} href="/">Main</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/portfolio')}`} href="/portfolio">Portfolio</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact')}`} href="/contact">Contact</Link>
            </li>
            <li className="nav-item ms-lg-3">
               <a href="https://github.com/devtoprod95" target="_blank" className="btn btn-sm btn-outline-light opacity-75">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}