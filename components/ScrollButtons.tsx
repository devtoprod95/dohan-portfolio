"use client";

import { ArrowUp, ArrowDown } from 'react-bootstrap-icons';

export default function ScrollButtons() {
  const scroll = (top: boolean) => 
    window.scrollTo({ top: top ? 0 : document.body.scrollHeight, behavior: 'smooth' });

  const btnBase = { 
    width: '50px', height: '50px', borderRadius: '50%', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <div className="fixed-bottom d-flex flex-column align-items-end p-3 mb-3 me-2" style={{ zIndex: 9999 }}>
      <button onClick={() => scroll(true)} className="mb-2" 
        style={{ ...btnBase, backgroundColor: 'var(--primary-color)' }}>
        <ArrowUp size={24} color="#fff" />
      </button>
      <button onClick={() => scroll(false)} 
        style={{ ...btnBase, backgroundColor: 'var(--sub-color)' }}>
        <ArrowDown size={24} color="#fff" />
      </button>
    </div>
  );
}