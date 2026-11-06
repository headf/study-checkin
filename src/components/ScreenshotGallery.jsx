'use client';

export default function ScreenshotGallery({ screenshots, user }) {
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="card p-5 fade-up">
      <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3">截图记录</h2>
      <div className="grid grid-cols-3 gap-2">
        {screenshots.map((s) => (
          <a key={s.id} href={s.filename} target="_blank" rel="noopener noreferrer"
            className="block aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 hover:opacity-80 transition-opacity">
            <img src={s.filename} alt="" className="w-full h-full object-cover" loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
}
