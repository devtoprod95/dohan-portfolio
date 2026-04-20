import './globals.css';
import { Inter } from 'next/font/google';
import BootstrapClient from '@/components/BootstrapClient';
import Navbar from '@/components/Navbar';
import ScrollButtons from '@/components/ScrollButtons';
import ScrollToTop from '@/components/ScrollToTop';
import { Metadata, Viewport } from 'next';
import FloatingChat from '@/components/FloatingChat';
import FloatingDownload from '@/components/FloatingDownload';
import AIChatBot from '@/components/AIChatBot';
import PWAHandler from '@/components/PWAHandler';

const inter = Inter({ subsets: ['latin'] });

const prefix = process.env.NEXT_PUBLIC_PREFIX || '';

export const metadata: Metadata = {
  title: "김도한 자기소개서 | Software Engineer",
  description: "경험 중심의 풀스택 개발자, 김도한의 포트폴리오 및 자기소개서입니다.",
  keywords: ["김도한", "개발자 포트폴리오", "소프트웨어 엔지니어", "React", "Next.js", "Laravel"],
  authors: [{ name: "김도한" }],
  openGraph: {
    title: "김도한 자기소개서",
    description: "성실함과 기술력을 겸비한 개발자 김도한입니다.",
    type: "website",
  },
  manifest: `${prefix}/manifest.json`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>

      <body className={inter.className}>
        <PWAHandler />

        <ScrollToTop />
        <BootstrapClient />
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        
        {/* 💡 보이지 않는 작업용 통로 (창 안 뜨게 하는 핵심) */}
       <iframe 
          id="pdf-worker-iframe" 
          suppressHydrationWarning
          style={{ 
            position: 'absolute',
            top: '-9999px',
            left: 0,
            width: '1200px', // 가로폭 고정
            height: 'auto', 
            minHeight: '8000px', // 세로폭을 강제로 엄청 크게 잡아야 안 잘립니다
            border: 'none',
            visibility: 'hidden' 
          }} 
          src="about:blank"
        />

        <footer className="bg-light py-4 mt-5 border-top">
          <div className="container text-center">
            <p className="text-muted mb-0">© 2026 Kim Do-han. All rights reserved.</p>
          </div>
        </footer>

        <FloatingDownload />
        
        <FloatingChat /> 

        <AIChatBot />

        <ScrollButtons />
      </body>
    </html>
  );
}