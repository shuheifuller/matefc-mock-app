import type { Enrollment } from '../types/domain';
import { rosterEnrollments } from './roster';

// Which student attends which class (drives schedule + roster).
const coreEnrollments: Enrollment[] = [
  { id: 'en_1', studentId: 'st_tanaka_a', classId: 'cls_chatswood_mon', startDate: '2024-02-05', status: 'active' },
  { id: 'en_2', studentId: 'st_tanaka_a', classId: 'cls_naremburn_wed', startDate: '2024-02-05', status: 'active' },
  { id: 'en_3', studentId: 'st_tanaka_a', classId: 'cls_wentworth_sat', startDate: '2024-02-05', status: 'active' },
  { id: 'en_4', studentId: 'st_tanaka_b', classId: 'cls_naremburn_wed', startDate: '2025-02-10', status: 'active' },
  { id: 'en_5', studentId: 'st_tanaka_b', classId: 'cls_naremburn_fri', startDate: '2025-02-10', status: 'active' },
  { id: 'en_6', studentId: 'st_smith', classId: 'cls_mowbray_tue', startDate: '2026-03-03', status: 'active' },
  { id: 'en_7', studentId: 'st_nguyen_a', classId: 'cls_academy_sat', startDate: '2024-08-17', status: 'active' },
  { id: 'en_8', studentId: 'st_nguyen_a', classId: 'cls_naremburn_fri', startDate: '2024-08-17', status: 'active' },
  { id: 'en_9', studentId: 'st_nguyen_b', classId: 'cls_wentworth_sat', startDate: '2025-10-04', status: 'active' },
  { id: 'en_10', studentId: 'st_brown', classId: 'cls_naremburn_fri', startDate: '2025-02-14', status: 'active' },
  { id: 'en_11', studentId: 'st_lee', classId: 'cls_chatswood_mon', startDate: '2026-06-22', status: 'trial' },
];

export const enrollments: Enrollment[] = [...coreEnrollments, ...rosterEnrollments];

export const enrollmentsForStudent = (studentId: string) =>
  enrollments.filter((e) => e.studentId === studentId);
export const enrollmentsForClass = (classId: string) =>
  enrollments.filter((e) => e.classId === classId);
