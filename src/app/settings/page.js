'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function SettingsPage() {
  const [pkStart, setPkStart] = useState('2026-07-01');
  const [pkEnd, setPkEnd] = useState('2026-08-31');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [remoteUrl, setRemoteUrl] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.pkStart) setPkStart(d.pkStart);
        if (d.pkEnd) setPkEnd(d.pkEnd);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pkStart, pkEnd }),
      });
      const d = await res.json();
      if (d.success) setMsg({ t: 'success', v: '✅ 已保存' });
      else setMsg({ t: 'error', v: '保存失败' });
    } catch { setMsg({ t: 'error', v: '网络错误' }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 2000); }
  };

  useEffect(() => {
    const host = window.location.hostname;
    // 检测是否通过隧道访问
    if (!['localhost', '127.0.0.1'].includes(host)) {
      setRemoteUrl(window.location.origin);
    }
  }, []);

  return (
    <>
      <Header title="设置" subtitle="PK时间 & 远程访问" />
      <div className="space-y-4">
        {/* PK时间设置 */}
        <div className="card p-6 fade-up">
          <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-5">
            🎯 PK 时间
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label block mb-2">开始日期</label>
              <input type="date" value={pkStart}
                onChange={(e) => setPkStart(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-gray-100 transition-colors" />
            </div>
            <div>
              <label className="label block mb-2">结束日期</label>
              <input type="date" value={pkEnd}
                onChange={(e) => setPkEnd(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-gray-100 transition-colors" />
            </div>
            {msg && (
              <div className={`text-sm font-medium ${msg.t === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {msg.v}
              </div>
            )}
            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* 远程访问 */}
        <div className="card p-6 fade-up">
          <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">
            📡 远程访问
          </h2>
          {remoteUrl ? (
            <div>
              <p className="text-xs text-green-600 font-medium mb-2">✅ 已通过远程访问</p>
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-mono text-gray-500 select-all break-all">
                {remoteUrl}
              </div>
              <p className="text-[10px] text-gray-300 mt-2">分享这个链接给TA</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 mb-3">在电脑终端运行以下命令，手机和TA就能远程访问：</p>

              <div className="bg-gray-900 rounded-xl px-4 py-3 text-xs font-mono text-green-400 select-all leading-relaxed mb-4">
                cd /d D:/Desktop/学习打卡<br/>
                node remote.js
              </div>

              <p className="text-xs text-gray-400 mb-3">或者手动运行（更快，无需安装）：</p>
              <div className="bg-gray-900 rounded-xl px-4 py-3 text-xs font-mono text-green-400 select-all leading-relaxed">
                ssh -p 443 -R0:localhost:3000 a.pinggy.io
              </div>
              <p className="text-[10px] text-gray-300 mt-2">运行后会生成两个链接，用 HTTP 那个更快</p>
            </div>
          )}
        </div>

        {/* 关于 */}
        <div className="card p-6 fade-up">
          <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3">
            ℹ️ 关于
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            暑期学习打卡 · 考研情侣PK<br />
            上传新东方app截图自动识别学习时长<br />
            数据存储在本地，重启不丢失
          </p>
        </div>
      </div>
      <Navigation />
    </>
  );
}
