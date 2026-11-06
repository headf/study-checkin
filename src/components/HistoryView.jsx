'use client';

import { useState, useEffect } from 'react';

export default function HistoryView({ users }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/records?start=2024-01-01&end=2099-12-31')
      .then((r) => r.json())
      .then((d) => { if (d.records) setRecords(d.records); })
      .finally(() => setLoading(false));
  }, []);

  const grouped = records.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = {};
    acc[r.date][r.userId] = r;
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const getFiltered = (date) => {
    const day = grouped[date];
    if (filter === 'all') return Object.values(day);
    return day[parseInt(filter)] ? [day[parseInt(filter)]] : [];
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="card p-5 fade-up">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {users?.map((u) => (
            <button
              key={u.id}
              onClick={() => setFilter(u.id.toString())}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === u.id.toString()
                  ? u.color === 'his' ? 'bg-[#3b3b5c] text-white' : 'bg-[#b84a62] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {u.avatar} {u.nickname}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-300 py-12">加载中...</div>
      ) : dates.length === 0 ? (
        <div className="text-center text-sm text-gray-300 py-12">暂无记录</div>
      ) : (
        dates.map((date) => {
          const items = getFiltered(date);
          if (items.length === 0) return null;

          return (
            <div key={date} className="card p-5 fade-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">{formatDateCN(date)}</span>
                <span className="text-[10px] text-gray-300 font-medium">{date}</span>
              </div>
              <div className="space-y-3">
                {items.map((record) => {
                  const user = users?.find((u) => u.id === record.userId);
                  const isHe = user?.color === 'his';
                  return (
                    <div key={record.userId} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{user?.avatar}</span>
                        <span className={`text-xs font-semibold ${isHe ? 'text-[#3b3b5c]' : 'text-[#b84a62]'}`}>
                          {user?.nickname}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-500">
                          <span className="font-semibold text-gray-700">{record.studyHours?.toFixed(1)}</span>h
                        </span>
                        <span className="text-gray-500">
                          <span className="font-semibold text-gray-700">{record.words || 0}</span>词
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {items[0]?.notes && (
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50 italic">
                  {items[0].notes}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function formatDateCN(dateStr) {
  const p = dateStr.split('-');
  return `${parseInt(p[1])}月${parseInt(p[2])}日`;
}
