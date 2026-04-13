import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Inter } from 'next/font/google';
import BootstrapClient from '@/components/BootstrapClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dohan Portfolio',
  description: 'Next.js & Bootstrap Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}