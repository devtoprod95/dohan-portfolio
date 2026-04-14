"use client";

import { useState } from 'react';
import { FileEarmarkPdfFill } from 'react-bootstrap-icons';
import { usePathname } from 'next/navigation';

export default function FloatingDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const pathname = usePathname();

  // 추출 페이지에서는 버튼 숨김
  if (pathname.includes('/pdf-full')) return null;

  const startWorker = () => {
    const iframe = document.getElementById('pdf-worker-iframe') as HTMLIFrameElement;
    if (!iframe || isGenerating) return;

    setIsGenerating(true);
    
    // 💡 배포 환경의 서브 경로(prefix)를 포함하여 주입
    iframe.src = `${process.env.NEXT_PUBLIC_PREFIX}/pdf-full`;

    // PDF 생성 완료 및 다운로드 대기 시간 후 상태 초기화
    setTimeout(() => {
      setIsGenerating(false);
      iframe.src = 'about:blank'; // iframe 비우기
    }, 5000);
  };

  const btnStyle: React.CSSProperties = {
    width: '55px', height: '55px', borderRadius: '50%', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    backgroundColor: isGenerating ? '#6c757d' : '#dc3545',
    color: '#fff', position: 'fixed', 
    left: '25px', 
    bottom: '80px', // 💡 25px에서 95px로 변경 (채팅 버튼 위로!)
    zIndex: 10000, 
    cursor: isGenerating ? 'not-allowed' : 'pointer'
  };

  return (
    <div className="no-print">
      <button onClick={startWorker} disabled={isGenerating} style={btnStyle}>
        {isGenerating ? (
          <div className="spinner-border spinner-border-sm" />
        ) : (
          <FileEarmarkPdfFill size={24} />
        )}
      </button>
      
      {isGenerating && (
        <div style={{
          position: 'fixed', 
          left: '90px', 
          bottom: '90px', // 💡 버튼 위치에 맞춰 상향 조정
          backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff',
          padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem', zIndex: 9999
        }}>
          PDF 생성 중...
        </div>
      )}
    </div>
  );
}