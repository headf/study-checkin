'use client';

export default function Header({ title, subtitle }) {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${bj.getMonth() + 1}/${bj.getDate()} 周${days[bj.getDay()]}`;

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
        <span className="text-xs text-gray-400 font-medium">{dateStr}</span>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-400 mt-1 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
