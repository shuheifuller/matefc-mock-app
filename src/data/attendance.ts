import type { AttendanceRecord, MakeupToken } from '../types/domain';

export const attendance: AttendanceRecord[] = [
  // Sora Tanaka (Unlimited) — high attendance
  { id: 'at_1', studentId: 'st_tanaka_a', sessionId: 'ses_chatswood_0608', status: 'present', markedByCoachId: 'c1' },
  { id: 'at_2', studentId: 'st_tanaka_a', sessionId: 'ses_naremburn_wed_0610', status: 'present', markedByCoachId: 'c6' },
  { id: 'at_3', studentId: 'st_tanaka_a', sessionId: 'ses_wentworth_0613', status: 'present', markedByCoachId: 'c3' },
  // Hina Tanaka (Twice) — one absent
  { id: 'at_4', studentId: 'st_tanaka_b', sessionId: 'ses_naremburn_wed_0610', status: 'present', markedByCoachId: 'c6' },
  { id: 'at_5', studentId: 'st_tanaka_b', sessionId: 'ses_naremburn_fri_0612', status: 'absent', markedByCoachId: 'c4' },
  // Oliver Smith (Once)
  { id: 'at_6', studentId: 'st_smith', sessionId: 'ses_mowbray_0609', status: 'present', markedByCoachId: 'c3' },
  // Kai Nguyen (Academy)
  { id: 'at_7', studentId: 'st_nguyen_a', sessionId: 'ses_academy_0613', status: 'present', markedByCoachId: 'c2' },
  { id: 'at_8', studentId: 'st_nguyen_a', sessionId: 'ses_naremburn_fri_0612', status: 'absent', markedByCoachId: 'c8' },
  // Lucas Brown (Once)
  { id: 'at_9', studentId: 'st_brown', sessionId: 'ses_naremburn_fri_0612', status: 'present', markedByCoachId: 'c8' },
];

export const makeupTokens: MakeupToken[] = [
  { id: 'mk_1', studentId: 'st_tanaka_a', reason: 'weather', earnedDate: '2026-05-21', used: false },
  { id: 'mk_2', studentId: 'st_tanaka_b', reason: 'personal', earnedDate: '2026-04-10', used: true, expiresOn: '2026-12-31' },
  { id: 'mk_3', studentId: 'st_tanaka_b', reason: 'personal', earnedDate: '2026-05-30', used: false, expiresOn: '2026-12-31' },
  { id: 'mk_4', studentId: 'st_smith', reason: 'weather', earnedDate: '2026-05-14', used: false },
  { id: 'mk_5', studentId: 'st_brown', reason: 'personal', earnedDate: '2026-03-20', used: false, expiresOn: '2026-12-31' },
];

export const attendanceForStudent = (studentId: string) =>
  attendance.filter((a) => a.studentId === studentId);
export const attendanceForSession = (sessionId: string) =>
  attendance.filter((a) => a.sessionId === sessionId);
export const makeupTokensForStudent = (studentId: string) =>
  makeupTokens.filter((m) => m.studentId === studentId);
