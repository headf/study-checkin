'use client';

import { calcScore } from '@/lib/constants';

export default function PKScoreboard({ users, records }) {
  if (!users || users.length < 2 || !records) return null;

  const r1 = records[users[0]?.id] || null;
  const r2 = records[users[1]?.id] || null;
  const s1 = calcScore(r1);
  const s2 = calcScore(r2);
  const done = s1 > 0 || s2 > 0;

  return (
    <div className="card p-6 fade-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">今日PK</h2>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="text-center flex-1">
          <span className="text-xl block mb-1">{users[0]?.avatar}</span>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{users[0]?.nickname}</div>
          <div className="value text-[#3b3b5c]">{s1}</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-300 tracking-widest">VS</span>
          {done && s1 !== s2 && (
            <span className="text-[10px] text-gray-400 mt-1 font-medium">
              {s1 > s2 ? `${users[0]?.nickname}领先` : `${users[1]?.nickname}领先`}
              <span className="text-gray-300 ml-0.5">{Math.abs(s1 - s2)}</span>
            </span>
          )}
          {done && s1 === s2 && (
            <span className="text-[10px] text-gray-400 mt-1">平局</span>
          )}
        </div>

        <div className="text-center flex-1">
          <span className="text-xl block mb-1">{users[1]?.avatar}</span>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{users[1]?.nickname}</div>
          <div className="value text-[#b84a62]">{s2}</div>
        </div>
      </div>

      {!done && (
        <p className="text-center text-xs text-gray-300">等待打卡</p>
      )}

      {/* Detail */}
      {done && (
        <div className="bg-gray-50 rounded-xl p-3 mt-2">
          <div className="flex items-center justify-between text-xs py-1.5">
            <span className="text-gray-400">学习时长</span>
            <div className="flex gap-4">
              <span className="font-semibold text-[#3b3b5c] w-12 text-right">{r1?.studyHours?.toFixed(1) || '0'}h</span>
              <span className="font-semibold text-[#b84a62] w-12 text-right">{r2?.studyHours?.toFixed(1) || '0'}h</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs py-1.5">
            <span className="text-gray-400">单词</span>
            <div className="flex gap-4">
              <span className="font-semibold text-[#3b3b5c] w-12 text-right">{r1?.words || 0}</span>
              <span className="font-semibold text-[#b84a62] w-12 text-right">{r2?.words || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
