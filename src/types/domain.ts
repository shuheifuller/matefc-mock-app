// ============================================================================
// MateFC domain model. The membership categorization is the spine of the app:
// a single MembershipCategory enum + a MembershipGroup, with all per-category
// metadata living in src/lib/membership.ts.
// ============================================================================

export interface LocalizedText {
  en: string;
  ja: string;
}

export type Lang = 'en' | 'ja';
export type Role = 'parent' | 'coach';

// --- The central categorization ---------------------------------------------
export enum MembershipCategory {
  RegularCasual = 'REGULAR_CASUAL',
  RegularOnceWeekly = 'REGULAR_ONCE_WEEKLY',
  RegularTwiceWeekly = 'REGULAR_TWICE_WEEKLY',
  RegularUnlimited = 'REGULAR_UNLIMITED',
  Academy = 'ACADEMY', // special lessons + weekend matches — its own section
  Trial = 'TRIAL', // evaluating before enrolling
}

/** High-level grouping so the UI renders Academy / Trial as separate sections. */
export enum MembershipGroup {
  Regular = 'REGULAR',
  Academy = 'ACADEMY',
  Trial = 'TRIAL',
}

export interface MembershipCategoryMeta {
  category: MembershipCategory;
  group: MembershipGroup;
  label: LocalizedText;
  short: LocalizedText;
  /** CSS var name for the badge accent color. */
  badgeColor: string;
  badgeBg?: string;
  monthlyPrice?: number; // AUD
  perSessionPrice?: { member: number; nonMember: number };
  sessionsPerWeek?: number | 'unlimited';
  rules: LocalizedText[];
}

// --- People -----------------------------------------------------------------
export interface LessonPlan {
  id: string;
  category: MembershipCategory;
  name: LocalizedText;
  monthlyPrice?: number;
  enrollmentFee: number;
  directDebitDayOfMonth?: number;
  description: LocalizedText;
  rules: LocalizedText[];
  makeupAllowance?: { personalPerYear: number; weather: 'unlimited' };
}

export interface Family {
  id: string;
  familyName: string;
  primaryContact: { name: string; email: string; phone: string };
  studentIds: string[];
  autopayEnabled: boolean;
  activeKidsVoucher?: { applied: boolean; amount: number };
  preferredLang: Lang;
}

export interface Student {
  id: string;
  familyId: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO — drives age (4–14)
  category: MembershipCategory; // drives badge + section placement
  planId?: string; // undefined for trial
  homeVenueId?: string;
  enrolledSince?: string;
  trial?: TrialInfo; // present iff category === Trial
  avatarColor?: string;
  notes?: LocalizedText;
}

export type TrialStatus = 'scheduled' | 'attended' | 'converted' | 'declined';

export interface TrialInfo {
  trialDate: string; // ISO
  trialClassId: string;
  status: TrialStatus;
  evaluatedByCoachId?: string;
  outcomeNote?: LocalizedText;
  convertedToPlanId?: string;
}

export interface Coach {
  id: string;
  name: string;
  roleTitle: LocalizedText;
  bio?: LocalizedText;
  avatarColor?: string;
  isAdmin?: boolean;
}

// --- Places & scheduling ----------------------------------------------------
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Venue {
  id: string;
  name: string;
  suburb: string;
  weekdays: Weekday[];
  ageRange: { min: number; max: number };
  isNew?: boolean; // e.g. Mowbray, new Mar 2026
}

export enum ClassKind {
  Regular = 'REGULAR',
  Academy = 'ACADEMY',
  Camp = 'CAMP',
  Trial = 'TRIAL',
}

export interface ClassOffering {
  id: string;
  kind: ClassKind;
  title: LocalizedText;
  venueId: string;
  coachIds: string[];
  weekday?: Weekday;
  startTime: string; // "16:30"
  durationMin: number;
  ageRange: { min: number; max: number };
  capacity: number;
  enrolledCount: number;
  hasWeekendMatch?: boolean; // Academy
  campDates?: string[];
  campPricing?: { oneDay: number; twoDay: number; threeDay: number };
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled_weather' | 'cancelled';

export interface Session {
  id: string;
  classId: string;
  date: string; // ISO
  status: SessionStatus;
}

// --- Enrollment / attendance / progress -------------------------------------
export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  startDate: string;
  status: 'active' | 'trial' | 'waitlist' | 'ended';
}

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'excused'
  | 'makeup'
  | 'weather_cancelled';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  status: AttendanceStatus;
  markedByCoachId?: string;
}

export interface MakeupToken {
  id: string;
  studentId: string;
  reason: 'personal' | 'weather';
  earnedDate: string;
  used: boolean;
  expiresOn?: string;
}

export type Pillar = 'mind' | 'skill' | 'body'; // 心 / 技 / 体

export interface SkillProgress {
  studentId: string;
  updatedAt: string;
  coachId: string;
  skills: Array<{
    key: string;
    label: LocalizedText;
    pillar: Pillar;
    level: number; // 1–5
  }>;
  feedback: LocalizedText;
}

// --- Billing ----------------------------------------------------------------
export type InvoiceStatus = 'paid' | 'due' | 'upcoming' | 'overdue';

export interface Invoice {
  id: string;
  familyId: string;
  periodLabel: LocalizedText;
  lineItems: Array<{ label: LocalizedText; amount: number }>;
  total: number;
  currency: 'AUD';
  dueDate: string;
  status: InvoiceStatus;
  paidVia?: 'direct_debit' | 'card' | 'voucher';
}

// --- Feed & notifications ---------------------------------------------------
export enum NewsCategory {
  Camp = 'CAMP',
  NewClass = 'NEW_CLASS',
  Announcement = 'ANNOUNCEMENT',
  Event = 'EVENT',
}

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: LocalizedText;
  body: LocalizedText;
  publishedAt: string;
  pinned?: boolean;
  ctaScreen?: string;
}

export type NotificationType =
  | 'payment'
  | 'schedule'
  | 'news'
  | 'trial'
  | 'makeup'
  | 'birthday';

export interface AppNotification {
  id: string;
  forRole: Role | 'both';
  familyId?: string;
  type: NotificationType;
  title: LocalizedText;
  body: LocalizedText;
  createdAt: string;
  read: boolean;
}
