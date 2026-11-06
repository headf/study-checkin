import './globals.css';

export const metadata = {
  title: '学习打卡',
  description: '暑期学习打卡',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen max-w-lg mx-auto px-5 py-8 pb-28">
          {children}
        </main>
      </body>
    </html>
  );
}
