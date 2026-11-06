export function getTodayString() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bj.toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const p = dateStr.split('-');
  return `${parseInt(p[1])}月${parseInt(p[2])}日`;
}

export function formatShort(dateStr) {
  const p = dateStr.split('-');
  return `${p[1]}/${p[2]}`;
}

export function calcScore(r) {
  if (!r) return 0;
  return Math.round(((r.studyHours || 0) * 10 + (r.words || 0)) * 10) / 10;
}

export function getPKProgress(startDate, endDate) {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const start = new Date(startDate);
  const end = new Date(endDate);

  const total = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const elapsed = Math.max(0, Math.round((bj - start) / (1000 * 60 * 60 * 24)));
  const remaining = Math.max(0, total - elapsed);
  const progress = Math.min(100, Math.round((elapsed / total) * 100));

  return { total, elapsed, remaining, progress };
}
