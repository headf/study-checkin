'use client';

export default function TodayProgress({ users, records }) {
  if (!users || users.length < 2 || !records) return null;

  const r1 = records[users[0]?.id] || { studyHours: 0, words: 0 };
  const r2 = records[users[1]?.id] || { studyHours: 0, words: 0 };

  const maxH = Math.max(r1.studyHours, r2.studyHours, 1);
  const maxW = Math.max(r1.words, r2.words, 1);

  return (
    <div className="card p-6 fade-up">
      <h2 className="text-sm font-semibold mb-5 text-gray-600 tracking-wide uppercase">今日进度</h2>

      {/* 学习时长对比 */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-gray-400 font-medium">学习时长</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#3b3b5c] font-semibold">{users[0]?.nickname} {r1.studyHours.toFixed(1)}h</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#b84a62] font-semibold">{r2.studyHours.toFixed(1)}h {users[1]?.nickname}</span>
          </div>
        </div>
        <div className="bar-track">
          <div className="absolute relative">
            <div
              className="bar-fill bg-[#3b3b5c]"
              style={{ width: `${(r1.studyHours / maxH) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-300">{r1.studyHours.toFixed(1)}h</span>
          <span className="text-[10px] text-gray-300">{r2.studyHours.toFixed(1)}h</span>
        </div>
      </div>

      {/* 单词对比 */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-gray-400 font-medium">背单词</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#3b3b5c] font-semibold">{users[0]?.nickname} {r1.words}个</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#b84a62] font-semibold">{r2.words}个 {users[1]?.nickname}</span>
          </div>
        </div>
        <div className="bar-track">
          <div
            className="bar-fill bg-[#3b3b5c]"
            style={{ width: `${(r1.words / maxW) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-300">{r1.words}</span>
          <span className="text-[10px] text-gray-300">{r2.words}</span>
        </div>
      </div>
    </div>
  );
}
