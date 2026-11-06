'use client';

import { calcScore } from '@/lib/constants';

export default function ScoreCard({ user, record, isWinner }) {
  const score = calcScore(record);
  const userColor = user?.color === 'his' ? '--accent-his' : '--accent-hers';
  const dotColor = user?.color === 'his' ? 'bg-[#3b3b5c]' : 'bg-[#b84a62]';

  return (
    <div className={`relative p-5 card ${isWinner ? 'ring-1 ring-gray-200' : ''}`}>
      {isWinner && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="text-xs font-semibold tracking-wider text-gray-400 bg-white px-3 py-0.5 rounded-full border border-gray-200">
            WIN
          </span>
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{user?.avatar || '😊'}</span>
        <div>
          <div className="font-semibold text-sm">{user?.nickname || '-'}</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="label">学习时长</span>
          <span className="text-xl font-semibold tracking-tight">
            {record?.studyHours ? `${record.studyHours.toFixed(1)}` : '0'}
            <span className="text-sm text-gray-400 font-normal ml-0.5">h</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="label">单词</span>
          <span className="text-xl font-semibold tracking-tight">
            {record?.words || 0}
            <span className="text-sm text-gray-400 font-normal ml-0.5">个</span>
          </span>
        </div>
        <div className="pt-2 mt-2 border-t border-gray-50 flex items-baseline justify-between">
          <span className="label">得分</span>
          <span className="value" style={{ color: `var(${userColor})` }}>
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
