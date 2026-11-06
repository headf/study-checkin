'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PKStandings from '@/components/PKStandings';

export default function PKPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, []);

  return (
    <>
      <Header title="PK" subtitle="胜负记录" />
      <PKStandings users={users} />
      <Navigation />
    </>
  );
}
