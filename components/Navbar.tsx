"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return "";
    if (path === "/") return pathname === "/" ? "active" : "";
    return pathname.startsWith(path) ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        {/* 로고 강조 */}
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
            {/* 외부 링크 아이콘이 있다면 추가하기 좋은 위치 */}
            <li className="nav-item ms-lg-3">
               <a href="https://github.com/devtoprod95" target="_blank" className="btn btn-sm btn-outline-light opacity-75">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}