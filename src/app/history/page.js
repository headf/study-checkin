'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import HistoryView from '@/components/HistoryView';

export default function HistoryPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, []);

  return (
    <>
      <Header title="历史" subtitle="学习记录" />
      <HistoryView users={users} />
      <Navigation />
    </>
  );
}
