'use client';

import { useState, useRef } from 'react';

export default function ScreenshotUpload({ userId, onDetected }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [detected, setDetected] = useState(null);
  const fileRef = useRef(null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (!userId) return;
    setUploading(true);
    setDetected(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('userId', userId.toString());
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        if (data.screenshot.recognized > 0 && onDetected) {
          setDetected(data.screenshot.recognized);
          onDetected(data.screenshot.recognized);
        } else if (data.screenshot.recognized === 0) {
          setDetected(0);
        }
      }
    } catch { /* 静默处理 */ }
    finally { setUploading(false); }
  };

  const handleRetake = () => {
    setPreview(null);
    setDetected(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="mb-5">
      <label className="label block mb-2">学习截图</label>
      <div className="relative">
        {preview ? (
          <div>
            <img src={preview} alt="" className="w-full h-28 object-cover rounded-xl bg-gray-50 mb-2" />
            <div className="flex items-center justify-between">
              {detected !== null && (
                <span className={`text-xs font-medium ${detected > 0 ? 'text-green-600' : 'text-amber-500'}`}>
                  {detected > 0
                    ? `🤖 识别到 ${detected}h`
                    : '🤖 未能识别出时长，请手动填写'}
                </span>
              )}
              {uploading && <span className="text-xs text-gray-400">识别中...</span>}
              <button onClick={handleRetake}
                className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
                重选
              </button>
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="h-14 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-300 hover:bg-gray-100 transition-colors border border-dashed border-gray-200">
              + 上传截图，自动识别学习时长
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleSelect} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}
