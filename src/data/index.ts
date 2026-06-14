import { venues } from './venues';
import { coaches } from './coaches';
import { plans } from './plans';
import { classes } from './classes';
import { families, students } from './families';
import { sessions } from './sessions';
import { enrollments } from './enrollments';
import { attendance, makeupTokens } from './attendance';
import { skillProgress } from './skills';
import { invoices } from './invoices';
import { news } from './news';
import { notifications } from './notifications';

export const TODAY = '2026-06-14';

/** Initial seed snapshot loaded into DataContext state. */
export const seed = {
  venues,
  coaches,
  plans,
  classes,
  families,
  students,
  sessions,
  enrollments,
  attendance,
  makeupTokens,
  skillProgress,
  invoices,
  news,
  notifications,
};

export type Seed = typeof seed;

export * from './venues';
export * from './coaches';
export * from './plans';
export * from './classes';
export * from './families';
export * from './sessions';
export * from './enrollments';
export * from './attendance';
export * from './skills';
export * from './invoices';
export * from './news';
export * from './notifications';
