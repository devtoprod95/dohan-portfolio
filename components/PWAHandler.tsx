'use client';
import { useEffect, useState, useRef } from 'react';
import { MdInstallMobile } from 'react-icons/md';
import { SiPwa } from 'react-icons/si';

// PWA 활성화 여부 판단 변수 (전역에서도 사용)
const isPwaEnabled = typeof window !== 'undefined' && 
  (process.env.NODE_ENV === 'production' || process.env.PWA_READY === 'true');

let savedPrompt: any = null;

// 1. 전역 리스너에 조건부 로직 적용
if (typeof window !== 'undefined' && isPwaEnabled) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    savedPrompt = e;
  });
}

export default function PWAHandler() {
  const [canInstall, setCanInstall] = useState(false);
  const deferredPrompt = useRef<any>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 2. 내부 리스너 로직 (이미 전역에서 잡았다면 savedPrompt를 통해 전달받음)
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };

    if (isPwaEnabled) {
      if (savedPrompt) {
        deferredPrompt.current = savedPrompt;
        setCanInstall(true);
      }
      window.addEventListener('beforeinstallprompt', handler);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (isPwaEnabled) {
        window.removeEventListener('beforeinstallprompt', handler);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      savedPrompt = null; // 초기화
    }
  };

  if (!canInstall) return null;

  return (
    <div 
      className="no-print d-flex flex-column align-items-start p-3" 
      style={{ 
        position: 'fixed',
        bottom: isMobile ? '60px' : '140px',
        left: '0',
        zIndex: 1000,
      }}
    >
      <div className="ai-hint-bubble text-primary px-3 py-2 shadow-sm mb-2 fw-bold d-flex align-items-center">
        <SiPwa className="me-2" style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
        앱으로 설치하고 더 편하게 보세요!
      </div>

      <button 
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0 p-0" 
        style={{ 
          width: 'var(--button-size-base)', 
          height: 'var(--button-size-base)',
          transition: '0.3s ease'
        }} 
        onClick={handleInstallClick}
      >
        <MdInstallMobile style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
      </button>
    </div>
  );
}