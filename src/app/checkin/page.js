'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import CheckInForm from '@/components/CheckInForm';

export default function CheckInPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => { if (d.users) setUsers(d.users); }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header title="打卡" subtitle="记录今日学习" />
      {loading ? (
        <div className="flex justify-center py-20 text-sm text-gray-300">加载中...</div>
      ) : (
        <CheckInForm users={users} onSuccess={() => router.push('/')} />
      )}
      <Navigation />
    </>
  );
}
