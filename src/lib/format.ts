import type { Lang } from '../types/domain';

export function formatAUD(amount: number): string {
  return '$' + amount.toLocaleString('en-AU', { minimumFractionDigits: 0 });
}

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (lang === 'ja') {
    return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAY_JA[d.getDay()]}）`;
  }
  return `${WEEKDAY_EN[d.getDay()]}, ${MONTHS_EN[d.getMonth()]} ${d.getDate()}`;
}

export function formatShortDate(iso: string, lang: Lang): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (lang === 'ja') return `${d.getMonth() + 1}/${d.getDate()}`;
  return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}`;
}

export function weekdayLabel(weekday: string, lang: Lang): string {
  const map: Record<string, { en: string; ja: string }> = {
    Mon: { en: 'Monday', ja: '月曜' },
    Tue: { en: 'Tuesday', ja: '火曜' },
    Wed: { en: 'Wednesday', ja: '水曜' },
    Thu: { en: 'Thursday', ja: '木曜' },
    Fri: { en: 'Friday', ja: '金曜' },
    Sat: { en: 'Saturday', ja: '土曜' },
    Sun: { en: 'Sunday', ja: '日曜' },
  };
  return map[weekday]?.[lang] ?? weekday;
}

export function ageFromDob(dob: string, today = '2026-06-14'): number {
  const b = new Date(dob);
  const t = new Date(today);
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export function isBirthdayThisWeek(dob: string, today = '2026-06-14'): boolean {
  const b = new Date(dob);
  const t = new Date(today);
  const thisYearBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
  const diff = (thisYearBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

export function relativeTime(iso: string, lang: Lang, now = '2026-06-14T09:00:00'): string {
  const then = new Date(iso).getTime();
  const cur = new Date(now).getTime();
  const mins = Math.round((cur - then) / 60000);
  if (mins < 60) return lang === 'ja' ? `${mins}分前` : `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return lang === 'ja' ? `${hrs}時間前` : `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return lang === 'ja' ? `${days}日前` : `${days}d ago`;
}
