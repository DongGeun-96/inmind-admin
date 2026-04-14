import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '인마인드 관리자',
  description: '인마인드 관리 페이지',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
