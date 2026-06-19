import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  MembershipCategory,
  NewsCategory,
  type AppNotification,
  type AttendanceRecord,
  type AttendanceStatus,
  type Family,
  type MakeupToken,
  type NewsItem,
  type Session,
  type SkillProgress,
  type Student,
} from '../types/domain';
import { TODAY } from '../data';
import { seed } from '../data';
import { planById } from '../data/plans';
import { nextId } from '../lib/ids';

interface DataValue {
  // static-ish catalogs
  venues: typeof seed.venues;
  coaches: typeof seed.coaches;
  plans: typeof seed.plans;
  classes: typeof seed.classes;
  enrollments: typeof seed.enrollments;
  invoices: typeof seed.invoices;
  // mutable state
  families: Family[];
  students: Student[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  makeupTokens: MakeupToken[];
  skillProgress: SkillProgress[];
  news: NewsItem[];
  notifications: AppNotification[];
  // mutators
  convertTrial: (studentId: string, planId: string) => void;
  enrollExisting: (studentId: string, planId: string) => void;
  bookSpot: (studentId: string) => void;
  markAttendance: (sessionId: string, studentId: string, status: AttendanceStatus) => void;
  weatherCancelSession: (sessionId: string) => void;
  saveSkillProgress: (entry: SkillProgress) => void;
  postNews: (title: string, body: string, category: NewsCategory, lang: 'en' | 'ja') => void;
  markAllNotificationsRead: (role: 'parent' | 'coach', familyId?: string) => void;
  toggleAutopay: (familyId: string) => void;
}

const DataContext = createContext<DataValue | null>(null);

const planToCategory = (planId: string): MembershipCategory =>
  planById(planId)?.category ?? MembershipCategory.RegularOnceWeekly;

export function DataProvider({ children }: { children: ReactNode }) {
  const [families, setFamilies] = useState<Family[]>(seed.families);
  const [students, setStudents] = useState<Student[]>(seed.students);
  const [sessions, setSessions] = useState<Session[]>(seed.sessions);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(seed.attendance);
  const [makeupTokens, setMakeupTokens] = useState<MakeupToken[]>(seed.makeupTokens);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>(seed.skillProgress);
  const [news, setNews] = useState<NewsItem[]>(seed.news);
  const [notifications, setNotifications] = useState<AppNotification[]>(seed.notifications);

  const convertTrial = useCallback((studentId: string, planId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              category: planToCategory(planId),
              planId,
              enrolledSince: '2026-06-14',
              trial: s.trial
                ? { ...s.trial, status: 'converted', convertedToPlanId: planId }
                : undefined,
            }
          : s,
      ),
    );
  }, []);

  const enrollExisting = useCallback((studentId: string, planId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, category: planToCategory(planId), planId } : s,
      ),
    );
  }, []);

  // Book a drop-in lesson. Unlimited students consume nothing; others spend one
  // unexpired, unused make-up token.
  const bookSpot = useCallback(
    (studentId: string) => {
      const student = students.find((s) => s.id === studentId);
      if (student?.category === MembershipCategory.RegularUnlimited) return;
      setMakeupTokens((prev) => {
        const idx = prev.findIndex(
          (m) => m.studentId === studentId && !m.used && (!m.expiresOn || m.expiresOn >= TODAY),
        );
        return idx < 0 ? prev : prev.map((m, i) => (i === idx ? { ...m, used: true } : m));
      });
    },
    [students],
  );

  const markAttendance = useCallback(
    (sessionId: string, studentId: string, status: AttendanceStatus) => {
      setAttendance((prev) => {
        const existing = prev.find((a) => a.sessionId === sessionId && a.studentId === studentId);
        if (existing) {
          return prev.map((a) => (a === existing ? { ...a, status } : a));
        }
        return [
          ...prev,
          { id: nextId('at'), sessionId, studentId, status, markedByCoachId: 'c1' },
        ];
      });
    },
    [],
  );

  const weatherCancelSession = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled_weather' } : s)),
    );
  }, []);

  const saveSkillProgress = useCallback((entry: SkillProgress) => {
    setSkillProgress((prev) => {
      const without = prev.filter((s) => s.studentId !== entry.studentId);
      return [entry, ...without];
    });
  }, []);

  const postNews = useCallback(
    (title: string, body: string, category: NewsCategory, lang: 'en' | 'ja') => {
      const item: NewsItem = {
        id: nextId('news'),
        category,
        title: { en: lang === 'en' ? title : title, ja: lang === 'ja' ? title : title },
        body: { en: body, ja: body },
        publishedAt: '2026-06-14T10:00:00',
      };
      setNews((prev) => [item, ...prev]);
      setNotifications((prev) => [
        {
          id: nextId('no'),
          forRole: 'both',
          type: 'news',
          title: item.title,
          body: { en: 'New announcement posted.', ja: '新しいお知らせが投稿されました。' },
          createdAt: '2026-06-14T10:00:00',
          read: false,
        },
        ...prev,
      ]);
    },
    [],
  );

  const markAllNotificationsRead = useCallback(
    (role: 'parent' | 'coach', familyId?: string) => {
      setNotifications((prev) =>
        prev.map((n) => {
          const matchesRole = n.forRole === role || n.forRole === 'both';
          const matchesFamily = role !== 'parent' || !n.familyId || n.familyId === familyId;
          return matchesRole && matchesFamily ? { ...n, read: true } : n;
        }),
      );
    },
    [],
  );

  const toggleAutopay = useCallback((familyId: string) => {
    setFamilies((prev) =>
      prev.map((f) => (f.id === familyId ? { ...f, autopayEnabled: !f.autopayEnabled } : f)),
    );
  }, []);

  const value = useMemo<DataValue>(
    () => ({
      venues: seed.venues,
      coaches: seed.coaches,
      plans: seed.plans,
      classes: seed.classes,
      enrollments: seed.enrollments,
      invoices: seed.invoices,
      families,
      students,
      sessions,
      attendance,
      makeupTokens,
      skillProgress,
      news,
      notifications,
      convertTrial,
      enrollExisting,
      bookSpot,
      markAttendance,
      weatherCancelSession,
      saveSkillProgress,
      postNews,
      markAllNotificationsRead,
      toggleAutopay,
    }),
    [
      families,
      students,
      sessions,
      attendance,
      makeupTokens,
      skillProgress,
      news,
      notifications,
      convertTrial,
      enrollExisting,
      bookSpot,
      markAttendance,
      weatherCancelSession,
      saveSkillProgress,
      postNews,
      markAllNotificationsRead,
      toggleAutopay,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
