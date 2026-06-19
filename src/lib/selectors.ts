import {
  MembershipCategory,
  type AttendanceRecord,
  type Enrollment,
  type MakeupToken,
  type Session,
  type Student,
} from '../types/domain';
import { TODAY } from '../data';

/**
 * Whether a family may book a drop-in lesson ("participate"). True if any
 * student is on the Unlimited plan, or holds an unused, unexpired make-up token.
 * Unexpired = no `expiresOn`, or `expiresOn >= today`.
 */
export function unexpiredMakeupTokens(
  makeupTokens: MakeupToken[],
  studentId: string,
  today = TODAY,
): MakeupToken[] {
  return makeupTokens.filter(
    (m) => m.studentId === studentId && !m.used && (!m.expiresOn || m.expiresOn >= today),
  );
}

export type BookingMode = 'unlimited' | 'makeup' | 'none';

/** Per-student participation eligibility for the "Book a spot" flow. */
export function studentBookingEligibility(
  student: Student,
  makeupTokens: MakeupToken[],
  today = TODAY,
): { eligible: boolean; mode: BookingMode; makeupCount: number } {
  if (student.category === MembershipCategory.RegularUnlimited) {
    return { eligible: true, mode: 'unlimited', makeupCount: 0 };
  }
  const makeupCount = unexpiredMakeupTokens(makeupTokens, student.id, today).length;
  return makeupCount > 0
    ? { eligible: true, mode: 'makeup', makeupCount }
    : { eligible: false, mode: 'none', makeupCount: 0 };
}

export function familyHasLessonCredit(
  students: Student[],
  makeupTokens: MakeupToken[],
  today = TODAY,
): boolean {
  return students.some((st) => studentBookingEligibility(st, makeupTokens, today).eligible);
}

/** Upcoming (today or later) scheduled sessions for a set of class ids, sorted. */
export function upcomingSessionsForClasses(
  sessions: Session[],
  classIds: string[],
  fromDate = TODAY,
): Session[] {
  return sessions
    .filter((s) => classIds.includes(s.classId) && s.date >= fromDate && s.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function classIdsForStudents(enrollments: Enrollment[], studentIds: string[]): string[] {
  return Array.from(
    new Set(
      enrollments
        .filter((e) => studentIds.includes(e.studentId) && e.status !== 'ended')
        .map((e) => e.classId),
    ),
  );
}

export function studentsForFamily(students: Student[], familyId: string): Student[] {
  return students.filter((s) => s.familyId === familyId);
}

export function attendanceRate(records: AttendanceRecord[]): number {
  const counted = records.filter((r) => r.status !== 'weather_cancelled');
  if (counted.length === 0) return 0;
  const present = counted.filter((r) => r.status === 'present' || r.status === 'makeup').length;
  return Math.round((present / counted.length) * 100);
}

export function weekSessions(sessions: Session[], start = '2026-06-14', days = 8): Session[] {
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  const endIso = end.toISOString().slice(0, 10);
  return sessions
    .filter((s) => s.date >= start && s.date <= endIso)
    .sort((a, b) => a.date.localeCompare(b.date));
}
