'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ScoreCard from '@/components/ScoreCard';
import PKCountdown from '@/components/PKCountdown';
import PKScoreboard from '@/components/PKScoreboard';
import ScreenshotGallery from '@/components/ScreenshotGallery';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState({});
  const [screenshots, setScreenshots] = useState({});
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/records/today');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        const rm = {}, sm = {};
        data.users.forEach((u) => {
          if (u.todayRecord) rm[u.id] = u.todayRecord;
          if (u.todayScreenshots?.length > 0) sm[u.id] = u.todayScreenshots;
        });
        setRecords(rm); setScreenshots(sm);
      }
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // SSE 实时推送
  useEffect(() => {
    let es;
    function connect() {
      es = new EventSource('/api/events');
      es.addEventListener('checkin', () => {
        fetchData(); // 有人打卡了，立即刷新
      });
      es.onerror = () => {
        es?.close();
        setTimeout(connect, 3000); // 断线重连
      };
    }
    connect();
    eventSourceRef.current = { close: () => es?.close() };
    return () => es?.close();
  }, [fetchData]);

  // 轮询保底（每5秒刷新一次）
  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 5000);
    return () => clearInterval(t);
  }, [fetchData]);

  const u1 = users[0], u2 = users[1];
  const s1 = u1 && records[u1.id] ? (records[u1.id].studyHours || 0) * 10 + (records[u1.id].words || 0) : 0;
  const s2 = u2 && records[u2.id] ? (records[u2.id].studyHours || 0) * 10 + (records[u2.id].words || 0) : 0;

  return (
    <>
      <Header title="学习打卡" subtitle="记录每天的进步" />
      {loading ? (
        <div className="flex justify-center py-20 text-sm text-gray-300">加载中...</div>
      ) : (
        <div className="space-y-4">
          <PKCountdown />

          {users.length >= 2 && (
            <div className="grid grid-cols-2 gap-3">
              <ScoreCard user={u1} record={records[u1?.id]} isWinner={s1 > s2} />
              <ScoreCard user={u2} record={records[u2?.id]} isWinner={s2 > s1} />
            </div>
          )}

          <PKScoreboard users={users} records={records} />

          {users.map((u) => screenshots[u.id] && (
            <ScreenshotGallery key={u.id} screenshots={screenshots[u.id]} user={u} />
          ))}

          <a href="/checkin"
            className="block w-full py-3 text-center text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
            打卡签到
          </a>
        </div>
      )}
      <Navigation />
    </>
  );
}
