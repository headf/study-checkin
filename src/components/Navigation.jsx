'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: '今日', icon: '◉' },
  { href: '/checkin', label: '打卡', icon: '＋' },
  { href: '/pk', label: 'PK', icon: '⚡' },
  { href: '/history', label: '历史', icon: '☰' },
  { href: '/settings', label: '设置', icon: '⋯' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100/80">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${
                active ? 'scale-105' : 'opacity-40 hover:opacity-60'
              }`}>
              <span className={`text-lg leading-none mb-0.5 ${active ? 'text-black' : 'text-gray-600'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium tracking-wide uppercase ${active ? 'text-black font-semibold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
