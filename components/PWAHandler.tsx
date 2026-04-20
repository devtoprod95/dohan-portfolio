'use client';
import { useEffect, useState, useRef } from 'react';
import { MdInstallMobile, MdClose } from 'react-icons/md'; // MdClose 추가
import { SiPwa } from 'react-icons/si';

const isPwaEnabled = typeof window !== 'undefined' && 
  (process.env.NODE_ENV === 'production' || process.env.PWA_READY === 'true');

let savedPrompt: any = null;

if (typeof window !== 'undefined' && isPwaEnabled) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    savedPrompt = e;
  });
}

export default function PWAHandler() {
  const [canInstall, setCanInstall] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 말풍선 표시 상태 추가
  const deferredPrompt = useRef<any>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 세션 스토리지 확인 (이전에 닫았는지 여부)
    const isDismissed = sessionStorage.getItem('pwa_hint_dismissed');
    if (!isDismissed) setIsVisible(true);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

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
      savedPrompt = null;
    }
  };

  // 닫기 버튼 핸들러
  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_hint_dismissed', 'true');
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

      {isVisible && (
        <div 
          className="ai-hint-bubble text-primary px-3 pe-1 py-2 shadow-sm mb-2 fw-bold d-flex align-items-center justify-content-between"
          style={{ width: 'auto', borderRadius: '12px', background: '#fff' }}
        >
          <div className="d-flex align-items-center">
            <SiPwa className="me-2" style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
            <span style={{ fontSize: '0.9rem' }}>앱으로 설치하고 더 편하게 보세요!</span>
          </div>
          
          {/* 우측 X 버튼 */}
          <div 
            onClick={handleDismiss}
            style={{ 
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto', // 3. 클릭 이벤트를 강제로 활성화
            }}
          >
            <MdClose size={18} />
          </div>
        </div>
      )}

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