'use client';

import { useState, useEffect } from 'react';
import { getPKProgress } from '@/lib/constants';

export default function PKCountdown() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        const p = getPKProgress(s.pkStart, s.pkEnd);
        setData({ start: s.pkStart, end: s.pkEnd, ...p });
      });
  }, []);

  if (!data) return null;

  return (
    <div className="card p-5 fade-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
          🎯 暑期PK
        </h2>
        <span className="text-[10px] text-gray-300 font-medium">
          {data.start} → {data.end}
        </span>
      </div>

      <div className="flex items-center justify-center gap-6 mb-3">
        <div className="text-center">
          <div className="value text-[#3b3b5c]">{data.elapsed}</div>
          <div className="label">已过</div>
        </div>
        <div className="text-gray-200 text-2xl font-light">/</div>
        <div className="text-center">
          <div className="value text-gray-800">{data.total}</div>
          <div className="label">总天数</div>
        </div>
        <div className="text-gray-200 text-2xl font-light">/</div>
        <div className="text-center">
          <div className="value text-[#b84a62]">{data.remaining}</div>
          <div className="label">剩余</div>
        </div>
      </div>

      <div className="bar-track">
        <div className="bar-fill bg-gradient-to-r from-[#3b3b5c] to-[#b84a62]"
          style={{ width: `${data.progress}%` }} />
      </div>
      <div className="text-center mt-1.5 text-[10px] text-gray-300 font-medium">
        {data.progress}%
      </div>
    </div>
  );
}
