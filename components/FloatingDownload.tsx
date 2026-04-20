"use client";

import { useState } from 'react';
import { FileEarmarkPdfFill } from 'react-bootstrap-icons';
import { usePathname } from 'next/navigation';

export default function FloatingDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const pathname = usePathname();

  // 추출 페이지에서는 버튼 숨김
  if (pathname.includes('/pdf')) return null;

  const startWorker = () => {
    const iframe = document.getElementById('pdf-worker-iframe') as HTMLIFrameElement;
    if (!iframe || isGenerating) return;

    setIsGenerating(true);
    
    // 💡 배포 환경의 서브 경로(prefix)를 포함하여 주입
    iframe.src = `${process.env.NEXT_PUBLIC_PREFIX}/pdf`;

    // PDF 생성 완료 및 다운로드 대기 시간 후 상태 초기화
    setTimeout(() => {
      setIsGenerating(false);
      iframe.src = 'about:blank'; // iframe 비우기
    }, 3000);
  };

  return (
    <div 
      className="no-print d-none d-md-flex flex-column align-items-start p-3" 
      style={{ 
        position: 'fixed',
        zIndex: 10000, 
        bottom: '70px', // 챗봇 버튼 바로 위에 위치하도록 높이 조절
        left: '0',
        width: 'auto',
        transform: 'none'
      }}
    >
      {/* PDF 생성 중 알림 말풍선 */}
      {isGenerating && (
        <div style={{
          position: 'absolute', 
          left: '85px', 
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)', 
          color: '#fff',
          whiteSpace: 'nowrap',
          padding: '8px 16px', 
          borderRadius: '30px', 
          fontSize: '0.85rem', 
          zIndex: 9999
        }}>
          PDF 생성 중...
        </div>
      )}

      <button 
        onClick={startWorker} 
        disabled={isGenerating} 
        className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0 p-0"
        style={{ 
          width: 'var(--button-size-base)', 
          height: 'var(--button-size-base)',
          backgroundColor: isGenerating ? '#cccccc' : '#ee0202ff', // 생성 중엔 회색으로
          color: '#fff',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease', // 부드러운 변화
          opacity: isGenerating ? 0.7 : 1,
        }} 
      >
        {isGenerating ? (
          <div className="spinner-border spinner-border-sm" />
        ) : (
          <FileEarmarkPdfFill style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }}/>
        )}
      </button>
    </div>
  );
}