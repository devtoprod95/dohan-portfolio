import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Inter } from 'next/font/google';
import BootstrapClient from '@/components/BootstrapClient';
import Navbar from '@/components/Navbar'; // 추가

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <BootstrapClient />
        
        <Navbar />

        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <footer className="bg-light py-4 mt-5 border-top">
          <div className="container text-center">
            <p className="text-muted mb-0">© 2026 Kim Do-han. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}