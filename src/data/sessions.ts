import type { Session } from '../types/domain';

// Today is 2026-06-14 (Sunday). Last week completed, this week scheduled,
// with one weather-cancelled Wednesday to exercise that state.
export const sessions: Session[] = [
  // ---- last week (completed) ----
  { id: 'ses_chatswood_0608', classId: 'cls_chatswood_mon', date: '2026-06-08', status: 'completed' },
  { id: 'ses_mowbray_0609', classId: 'cls_mowbray_tue', date: '2026-06-09', status: 'completed' },
  { id: 'ses_naremburn_wed_0610', classId: 'cls_naremburn_wed', date: '2026-06-10', status: 'completed' },
  { id: 'ses_naremburn_fri_0612', classId: 'cls_naremburn_fri', date: '2026-06-12', status: 'completed' },
  { id: 'ses_wentworth_0613', classId: 'cls_wentworth_sat', date: '2026-06-13', status: 'completed' },
  { id: 'ses_academy_0613', classId: 'cls_academy_sat', date: '2026-06-13', status: 'completed' },

  // ---- this / next week (scheduled) ----
  { id: 'ses_chatswood_0615', classId: 'cls_chatswood_mon', date: '2026-06-15', status: 'scheduled' },
  { id: 'ses_mowbray_0616', classId: 'cls_mowbray_tue', date: '2026-06-16', status: 'scheduled' },
  { id: 'ses_naremburn_wed_0617', classId: 'cls_naremburn_wed', date: '2026-06-17', status: 'cancelled_weather' },
  { id: 'ses_naremburn_fri_0619', classId: 'cls_naremburn_fri', date: '2026-06-19', status: 'scheduled' },
  { id: 'ses_wentworth_0620', classId: 'cls_wentworth_sat', date: '2026-06-20', status: 'scheduled' },
  { id: 'ses_academy_0620', classId: 'cls_academy_sat', date: '2026-06-20', status: 'scheduled' },

  // Min Lee's trial session
  { id: 'ses_chatswood_0622', classId: 'cls_chatswood_mon', date: '2026-06-22', status: 'scheduled' },
];

export const sessionById = (id?: string) => sessions.find((s) => s.id === id);
