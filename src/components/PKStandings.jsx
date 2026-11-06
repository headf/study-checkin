'use client';

import { useState, useEffect } from 'react';
import { formatShort } from '@/lib/constants';

export default function PKStandings({ users }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/records/history')
      .then((r) => r.json())
      .then((d) => { if (d.history) { setHistory(d.history); setStats(d.stats); } })
      .finally(() => setLoading(false));
  }, []);

  if (!users || users.length < 2) return null;

  if (loading) {
    return <div className="card p-6 text-center text-sm text-gray-300">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="card p-6 fade-up">
        <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-5">总战绩</h2>
        {stats && stats.total > 0 ? (
          <>
            <div className="flex items-center justify-center gap-10 mb-5">
              <div className="text-center">
                <span className="text-xl block mb-1">{users[0]?.avatar}</span>
                <div className="text-[10px] text-gray-400 uppercase mb-1">{users[0]?.nickname}</div>
                <div className="value text-[#3b3b5c]">{stats.user1.wins}</div>
                <div className="text-[10px] text-gray-300">胜</div>
              </div>
              <div className="text-center text-gray-300">
                <div className="text-xs font-semibold">VS</div>
                <div className="text-[10px] mt-1">{stats.total}场</div>
                {stats.draws > 0 && <div className="text-[10px]">平{stats.draws}</div>}
              </div>
              <div className="text-center">
                <span className="text-xl block mb-1">{users[1]?.avatar}</span>
                <div className="text-[10px] text-gray-400 uppercase mb-1">{users[1]?.nickname}</div>
                <div className="value text-[#b84a62]">{stats.user2.wins}</div>
                <div className="text-[10px] text-gray-300">胜</div>
              </div>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill bg-[#3b3b5c]"
                style={{ width: `${(stats.user1.wins / stats.total) * 100}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-gray-300 py-4">暂无PK记录</p>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card p-6 fade-up">
          <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">对战记录</h2>
          <div className="space-y-1">
            {history.map((h) => (
              <div key={h.date} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors -mx-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm">{h.user1.avatar}</span>
                  <span className={`text-xs font-semibold ${h.winner === h.user1.id ? 'text-[#3b3b5c]' : 'text-gray-300'}`}>
                    {h.user1.score}
                  </span>
                  <span className="text-[10px] text-gray-300">vs</span>
                  <span className={`text-xs font-semibold ${h.winner === h.user2.id ? 'text-[#b84a62]' : 'text-gray-300'}`}>
                    {h.user2.score}
                  </span>
                  <span className="text-sm">{h.user2.avatar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-300">{formatShort(h.date)}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    h.winner === h.user1.id ? 'bg-gray-100 text-[#3b3b5c]' :
                    h.winner === h.user2.id ? 'bg-gray-100 text-[#b84a62]' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {h.winner === h.user1.id ? 'W' : h.winner === h.user2.id ? 'W' : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
