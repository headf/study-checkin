'use client';

import { useState } from 'react';
import ScreenshotUpload from './ScreenshotUpload';

export default function CheckInForm({ users, onSuccess }) {
  const [selectedUser, setSelectedUser] = useState(users?.[0]?.id || null);
  const [studyHours, setStudyHours] = useState('');
  const [words, setWords] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleDetected = (hours) => {
    setStudyHours(hours > 0 ? hours.toString() : '');
  };

  const handleSubmit = async () => {
    if (!selectedUser) { setMsg({ t: 'error', v: '请选择打卡人' }); return; }
    if (!parseFloat(studyHours) && !parseInt(words)) {
      setMsg({ t: 'error', v: '请至少填写一项' }); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          studyHours: parseFloat(studyHours || 0),
          words: parseInt(words || 0),
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ t: 'success', v: '✅ 打卡成功' });
        setStudyHours(''); setWords(''); setNotes('');
        setTimeout(() => onSuccess?.(), 800);
      } else setMsg({ t: 'error', v: data.error || '失败' });
    } catch { setMsg({ t: 'error', v: '网络错误' }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="card p-6 fade-up">
      <h2 className="text-base font-semibold mb-5">打卡</h2>

      {/* User toggle */}
      <div className="flex gap-2 mb-6 bg-gray-50 rounded-xl p-1">
        {users?.map((user) => {
          const active = selectedUser === user.id;
          return (
            <button key={user.id}
              onClick={() => { setSelectedUser(user.id); setMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? user.color === 'his' ? 'bg-white text-[#3b3b5c] shadow-sm' : 'bg-white text-[#b84a62] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}>
              <span>{user.avatar}</span>
              <span>{user.nickname}</span>
            </button>
          );
        })}
      </div>

      {/* 截图上传 + OCR */}
      <ScreenshotUpload userId={selectedUser} onDetected={handleDetected} />

      {/* 学习时长 */}
      <div className="mb-5">
        <label className="label block mb-2">学习时长</label>
        <div className="relative">
          <input type="text" inputMode="decimal" placeholder="0"
            value={studyHours}
            onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setStudyHours(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-lg font-semibold outline-none focus:bg-gray-100 transition-colors" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">小时</span>
        </div>
      </div>

      {/* 单词 */}
      <div className="mb-5">
        <label className="label block mb-2">背单词</label>
        <div className="relative">
          <input type="text" inputMode="numeric" placeholder="0"
            value={words}
            onChange={(e) => /^\d*$/.test(e.target.value) && setWords(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-lg font-semibold outline-none focus:bg-gray-100 transition-colors" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">个</span>
        </div>
      </div>

      {/* 备注 */}
      <div className="mb-6">
        <label className="label block mb-2">备注</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="今天学了什么？" rows={2}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-gray-100 transition-colors resize-none" />
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
          msg.t === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
        }`}>{msg.v}</div>
      )}

      <button onClick={handleSubmit} disabled={submitting}
        className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors">
        {submitting ? '提交中...' : '提交打卡'}
      </button>
    </div>
  );
}
